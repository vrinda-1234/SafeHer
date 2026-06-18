# 🛡️ SafeHer

**SafeHer** is an AI-powered women's safety platform that provides real-time emergency assistance through live location tracking, SOS alerts, and intelligent audio-based distress detection.

The application continuously monitors safety conditions and can automatically trigger emergency alerts when signs of distress are detected, helping users receive assistance faster during critical situations.

---

## ✨ Features

### 🚨 One-Tap SOS Alert

* Instantly send emergency alerts to trusted contacts.
* Share live location during emergencies.
* Generate a unique tracking link for guardians.

### 📍 Real-Time Location Tracking

* Continuous GPS tracking during active SOS sessions.
* Live route updates visible to emergency contacts.
* Distance and movement monitoring.

### 🎤 AI-Based Distress Detection

* Uses Google's YAMNet audio classification model.
* Detects distress-related sounds from ambient audio.
* Automatically triggers alerts when suspicious patterns are detected.
* Reduces dependency on manual intervention during emergencies.

### 👥 Emergency Contact Management

* Add and manage trusted contacts.
* Notify multiple guardians simultaneously.
* Secure contact storage and retrieval.

### 🌐 Live Tracking Dashboard

* Real-time map visualization.
* SOS status monitoring.
* Continuous location updates.

### 🔒 Secure Authentication

* User registration and login.
* JWT-based authentication.
* Protected routes and secure session management.

---

## 🏗️ System Architecture

Frontend (React)
↓
Backend (Node.js + Express)
↓
Socket.IO (Real-Time Communication)
↓
MongoDB (Database)

AI Audio Service (Flask)
↓
YAMNet Feature Extraction
↓
Logistic Regression Classifier
↓
Distress Prediction

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Socket.IO Client
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* Socket.IO
* JWT Authentication
* MongoDB

### Machine Learning

* TensorFlow Hub
* YAMNet
* Scikit-Learn
* Logistic Regression
* Librosa

### Deployment

* Vercel (Frontend)
* Render / Hugging Face Spaces (Backend & ML Services)

---

## 🤖 AI Pipeline

1. Audio is captured from the user's device.
2. Audio is processed using YAMNet.
3. YAMNet generates high-dimensional embeddings.
4. Embeddings are passed to a trained Logistic Regression classifier.
5. Audio is classified into:

* Safe
* Suspicious
* Distress

6. If distress is detected, SafeHer can trigger emergency workflows automatically.

---

## 📂 Project Structure

SafeHer/
├── frontend/
├── backend/
├── ml-server/
│ ├── app.py
│ ├── train_classifier.py
│ ├── classifier.pkl
│ ├── label_map.pkl
│ └── yamnet.tflite
├── database/
└── README.md

---

## 🚀 Installation

### Clone Repository

```bash
git clone <repository-url>
cd SafeHer
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### ML Server

```bash
cd ml-server

pip install -r requirements.txt

python app.py
```

---

## 🔧 Environment Variables

### Frontend

```env
REACT_APP_API_URL=your_backend_url
REACT_APP_ML_URL=your_ml_server_url
```

### Backend

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
FRONTEND_URL=your_frontend_url
```

---

## 🎯 Future Enhancements

* SMS-based emergency alerts
* Voice-command SOS activation
* Fall detection using sensors
* Emergency service integration
* Offline emergency mode
* Improved deep learning audio models

---

## 👨‍💻 Team

Developed as a safety-focused intelligent assistance platform to provide faster emergency response and improve personal security through AI and real-time communication technologies.

---

## 📜 License

This project is developed for educational and demonstration purposes.
