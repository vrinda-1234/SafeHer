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

print("Loading YAMNet...")
yamnet = hub.load("https://tfhub.dev/google/yamnet/1")

print("Loading classifier...")
with open("classifier.pkl", "rb") as f:
    clf = pickle.load(f)

with open("label_map.pkl", "rb") as f:
    label_map = pickle.load(f)

def get_embedding(waveform):
    scores, embeddings, spectrogram = yamnet(waveform)
    return np.mean(embeddings.numpy(), axis=0)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file"}), 400

        file = request.files["file"]

        temp = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
        temp.close() #abhilasha did changes here%
        file.save(temp.name)

        waveform, sr = librosa.load(temp.name, sr=16000)
        os.remove(temp.name)

        if len(waveform) == 0:
            return jsonify({"error": "empty audio"}), 400

        waveform = waveform / (np.max(np.abs(waveform)) + 1e-6)

        embedding = get_embedding(waveform)
        embedding = embedding.reshape(1, -1)

        pred = clf.predict(embedding)[0]
        prob = clf.predict_proba(embedding).max()

        label = label_map[pred]

        # ✅ FIXED LOGIC
        is_danger = (
            label == "distress" or
            (label == "suspicious" and prob > 0.6)
        )

        return jsonify({
            "label": label,
            "confidence": float(prob),
            "danger": bool(is_danger)
        })

    except Exception as e:
        import traceback #abhilasha did changes
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)