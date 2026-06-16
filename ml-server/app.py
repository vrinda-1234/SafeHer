import os
import pickle
import tempfile
import traceback

# Suppress TF/CUDA noise before any TF import
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["CUDA_VISIBLE_DEVICES"] = ""  # Force CPU-only

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow_hub as hub
import numpy as np
import librosa

app = Flask(__name__)
CORS(app)

# =========================
# LOAD EVERYTHING AT STARTUP
# (with --preload in gunicorn, this runs once in the master process
#  and is shared across workers via fork — saves RAM & avoids timeouts)
# =========================
print("Loading YAMNet model...")
try:
    yamnet = hub.load("https://tfhub.dev/google/yamnet/1")
    print("YAMNet loaded successfully.")
except Exception as e:
    print(f"FATAL: Could not load YAMNet: {e}")
    raise

print("Loading classifier...")
try:
    with open("classifier.pkl", "rb") as f:
        clf = pickle.load(f)

    with open("label_map.pkl", "rb") as f:
        label_map = pickle.load(f)
    print("Classifier loaded successfully.")
except FileNotFoundError as e:
    print(f"FATAL: Missing pickle file: {e}")
    raise


# =========================
# EMBEDDING FUNCTION
# =========================
def get_embedding(waveform):
    _, embeddings, _ = yamnet(waveform)
    return np.mean(embeddings.numpy(), axis=0)


# =========================
# HEALTH CHECK ROUTE
# (Render pings / — give it a 200 so workers don't get flagged)
# =========================
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "SaHer ML server is running"}), 200


# =========================
# PREDICT ROUTE
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    temp_path = None
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        # Determine suffix from content type for ffmpeg/librosa compatibility
        content_type = file.content_type or ""
        suffix = ".webm"
        if "ogg" in content_type:
            suffix = ".ogg"
        elif "wav" in content_type:
            suffix = ".wav"
        elif "mp4" in content_type or "m4a" in content_type:
            suffix = ".mp4"

        # Save to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            temp_path = tmp.name

        # Load & resample to 16 kHz mono (YAMNet requirement)
        waveform, _ = librosa.load(temp_path, sr=16000, mono=True)

        if len(waveform) == 0:
            return jsonify({"error": "Audio file is empty or unreadable"}), 400

        # Cap at 5 seconds to keep RAM + latency predictable on free tier
        MAX_SAMPLES = 16000 * 5
        waveform = waveform[:MAX_SAMPLES]

        # Normalize
        peak = np.max(np.abs(waveform))
        if peak > 0:
            waveform = waveform / (peak + 1e-6)

        # Get YAMNet embedding
        embedding = get_embedding(waveform).reshape(1, -1)

        # Classifier prediction
        pred = clf.predict(embedding)[0]
        proba = clf.predict_proba(embedding)[0]
        confidence = float(proba.max())
        label = label_map[pred]

        # Danger logic
        is_danger = label == "distress" or (label == "suspicious" and confidence > 0.6)

        return jsonify({
            "label": label,
            "confidence": round(confidence, 4),
            "danger": bool(is_danger),
        })

    except librosa.util.exceptions.ParameterError as e:
        return jsonify({"error": f"Audio processing error: {str(e)}"}), 422

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        # Always clean up the temp file
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


# =========================
# RUN APP (dev only — use gunicorn in production)
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)