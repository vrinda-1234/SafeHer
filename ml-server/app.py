from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow_hub as hub
import numpy as np
import librosa
import tempfile
import os
import pickle

app = Flask(__name__)
CORS(app)

# =========================
# GLOBALS (lazy load model)
# =========================
yamnet = None

def load_model():
    global yamnet
    if yamnet is None:
        print("Loading YAMNet (this may take time)...")
        yamnet = hub.load("https://tfhub.dev/google/yamnet/1")
        print("YAMNet loaded successfully")

# =========================
# LOAD CLASSIFIER ON START
# =========================
print("Loading classifier...")
with open("classifier.pkl", "rb") as f:
    clf = pickle.load(f)

with open("label_map.pkl", "rb") as f:
    label_map = pickle.load(f)


# =========================
# EMBEDDING FUNCTION
# =========================
def get_embedding(waveform):
    scores, embeddings, spectrogram = yamnet(waveform)
    return np.mean(embeddings.numpy(), axis=0)


# =========================
# PREDICT ROUTE
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # ensure model is loaded only when needed
        load_model()

        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        # save temp file
        temp = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
        file.save(temp.name)

        # load audio
        waveform, sr = librosa.load(temp.name, sr=16000)
        os.remove(temp.name)

        if len(waveform) == 0:
            return jsonify({"error": "empty audio"}), 400

        # limit audio length (CRITICAL for Render stability)
        waveform = waveform[:16000 * 5]

        # normalize
        waveform = waveform / (np.max(np.abs(waveform)) + 1e-6)

        # embedding
        embedding = get_embedding(waveform)
        embedding = embedding.reshape(1, -1)

        # prediction
        pred = clf.predict(embedding)[0]
        prob = float(clf.predict_proba(embedding).max())

        label = label_map[pred]

        # danger logic
        is_danger = (
            label == "distress" or
            (label == "suspicious" and prob > 0.6)
        )

        return jsonify({
            "label": label,
            "confidence": prob,
            "danger": bool(is_danger)
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# =========================
# RUN APP
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)