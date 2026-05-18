from flask import Flask, request, jsonify
from flask_cors import CORS
import librosa
import numpy as np
import tensorflow_hub as hub
import pandas as pd
import tempfile
import os

app = Flask(__name__)
CORS(app)

print("Loading model...")
model = hub.load('https://tfhub.dev/google/yamnet/1')
print("Model loaded ✅")

# Load class names
class_map_path = 'https://raw.githubusercontent.com/tensorflow/models/master/research/audioset/yamnet/yamnet_class_map.csv'
class_names = pd.read_csv(class_map_path)['display_name'].tolist()

# 🚨 Keywords for danger detection
danger_keywords = [
    "yell", "shout", "scream", "screaming",
    "cry", "crying", "child crying",
    "female screaming", "distress", "panic"
]


@app.route('/predict', methods=['POST'])
def predict_audio():
    try:
        # ✅ Check file exists
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        print("File received:", file.filename)

        # ✅ Save file temporarily
        temp = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
        file_path = temp.name
        file.save(file_path)
        temp.close()

        # ✅ Load audio
        waveform, sr = librosa.load(file_path, sr=16000)

        # Cleanup temp file
        os.remove(file_path)

        # 🚨 Handle empty audio
        if len(waveform) == 0:
            return jsonify({"error": "Empty audio"}), 400

        # 🔥 Normalize audio (important)
        if np.max(np.abs(waveform)) > 0:
            waveform = waveform / np.max(np.abs(waveform))

        # 🔥 Calculate loudness
        loudness = float(np.mean(np.abs(waveform)))
        print("🔥 Loudness:", loudness)

        # ✅ Run model
        scores, embeddings, spectrogram = model(waveform)

        scores = scores.numpy()
        mean_scores = np.mean(scores, axis=0)

        # Top 10 predictions
        top_indices = np.argsort(mean_scores)[-10:][::-1]

        results = []
        danger = False

        print("Top predictions:")

        for i in top_indices:
            label = class_names[i]
            conf = float(mean_scores[i])

            print(label, conf)

            results.append({
                "label": label,
                "confidence": conf
            })

            # 🔥 AI-based detection
            if any(word in label.lower() for word in danger_keywords) and conf > 0.02:
                danger = True

        # 🔥 Loudness-based detection (backup)
        if loudness > 0.04:
            print("⚠️ High loudness detected!")
            danger = True

        return jsonify({
            "results": results,
            "danger": danger,
            "loudness": loudness
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=8000)