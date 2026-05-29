import os
import numpy as np
import tensorflow_hub as hub
import librosa
from sklearn.linear_model import LogisticRegression
import pickle

# Load YAMNet
print("Loading YAMNet...")
yamnet = hub.load("https://tfhub.dev/google/yamnet/1")

DATASET_PATH = "dataset"

X = []
y = []

label_map = {
    "safe": 0,
    "suspicious": 1,
    "distress": 2
}

def extract_embedding(file_path):
    waveform, sr = librosa.load(file_path, sr=16000)

    if len(waveform) == 0:
        return None

    waveform = waveform / (np.max(np.abs(waveform)) + 1e-6)

    scores, embeddings, spectrogram = yamnet(waveform)

    # average embedding over time
    embedding = np.mean(embeddings.numpy(), axis=0)

    return embedding

print("Extracting features...")

for label in os.listdir(DATASET_PATH):
    folder = os.path.join(DATASET_PATH, label)

    if not os.path.isdir(folder):
        continue

    for file in os.listdir(folder):
        path = os.path.join(folder, file)

        try:
            emb = extract_embedding(path)
            if emb is not None:
                X.append(emb)
                y.append(label_map[label])
        except Exception as e:
            print("Error:", path, e)

X = np.array(X)
y = np.array(y)

print("Training classifier...")

clf = LogisticRegression(max_iter=2000)
clf.fit(X, y)

# Save model
with open("classifier.pkl", "wb") as f:
    pickle.dump(clf, f)

with open("label_map.pkl", "wb") as f:
    pickle.dump({v: k for k, v in label_map.items()}, f)

print("Training complete ✅")