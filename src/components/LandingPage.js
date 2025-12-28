import React, { useEffect, useState } from "react";
import logo from "../assests/logo.png";
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth scroll for internal links
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const href = e.target.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };

    const links = document.querySelectorAll('nav a[href^="#"]');
    links.forEach((link) => link.addEventListener("click", handleSmoothScroll));

    return () => links.forEach((link) => link.removeEventListener("click", handleSmoothScroll));
  }, []);

  return (
    <div className="font-sans scroll-smooth">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
  <div className="flex items-center space-x-3">
    <img
      src={logo}
      alt="SafeHer Logo"
      className="h-16 w-auto"
    />
  </div>
</div>


          {/* Navigation */}
          <nav className="hidden lg:flex space-x-8 font-medium text-gray-600">
            <a href="#home" className="hover:text-pink-500 transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-pink-500 transition-colors">How It Works</a>
            <a href="#solution" className="hover:text-pink-500 transition-colors">Solution</a>
            <a href="#trust" className="hover:text-pink-500 transition-colors">Trust</a>
            <a href="#contact" className="hover:text-pink-500 transition-colors">Contact</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex space-x-3">
            <button className="px-5 py-2.5 border-2 border-pink-500 text-gray-700 rounded-xl hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 transition">
              Login
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-lg">
              Get SafeHer
            </button>
          </div>
        </div>
      </header>

      {/* HERO / HOME */}
      <section id="home" className="bg-purple-50 min-h-screen flex flex-col justify-center items-center text-center px-4 pt-32">
        <h1 className="text-5xl font-bold text-purple-900 mb-4">
          Your Safety, Our Priority
        </h1>
        <p className="text-xl text-purple-700 mb-8 max-w-xl">
          SafeHer uses AI and real-time monitoring to detect distress and alert help before danger escalates.
        </p>
        <div className="flex gap-4">
          <button className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition">
            Get Started
          </button>
          <a href="#how-it-works" className="bg-white border border-purple-700 text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-100 transition">
            How It Works
          </a>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="bg-white py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-purple-900 mb-6">The Problem</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Women face fear in everyday situations — walking home late, isolated areas, or emergencies where asking for help isn’t possible.
        </p>
      </section>

      {/* SOLUTION */}
      <section className="bg-purple-50 py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-purple-900 mb-12">Our Solution</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">AI-Powered Detection</h3>
            <p>Detects shouting, running, and abnormal patterns automatically to act fast in emergencies.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Smart Location Tracking</h3>
            <p>Monitors your route and movement, sending alerts when unusual activity is detected.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Instant Alerts</h3>
            <p>Notifies trusted contacts or authorities automatically — no manual action needed.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-purple-900 mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-left">
          <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">1. Continuous Monitoring</h3>
            <p>AI listens for distress patterns while respecting privacy.</p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">2. Anomaly Detection</h3>
            <p>Detects sudden movement, shouting, or abnormal sensor data.</p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">3. Smart Decision</h3>
            <p>AI confirms risk using multiple signals to reduce false alarms.</p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">4. Alert & Protect</h3>
            <p>Emergency alerts sent to trusted contacts with live location.</p>
          </div>
        </div>
      </section>

      {/* PREDICTIVE SAFETY SCORE */}
      <section className="bg-purple-50 py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-purple-900 mb-6">Predictive Safety Score</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Know the safety of an area before you step into it. Live data + AI generates a safety score to help you plan safer routes.
        </p>
        <div className="text-6xl font-bold text-purple-700">82% Safe</div>
      </section>

      {/* TRUST */}
      <section className="bg-white py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-purple-900 mb-12">Why Women Trust SafeHer</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">Secure Data</h3>
            <p>All data encrypted and privacy protected.</p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">AI Powered</h3>
            <p>TensorFlow Lite analyzes patterns in real-time.</p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">Real-World Tested</h3>
            <p>Works under real-life conditions and emergencies.</p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2">Women-Centric Design</h3>
            <p>Built with women’s safety as the core priority.</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-purple-50 py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-purple-900 mb-6">About Us</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          SafeHer was created to address a reality many women live with every day. 
          We believe technology should protect, not intimidate. Social impact and ethical AI are at the heart of everything we do.
        </p>
      </section>

      {/* CONTACT */}
      <section className="bg-white py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-purple-900 mb-6">Contact Us</h2>
        <p className="text-gray-700 mb-8">Questions, feedback, or support? We’re here for you.</p>
        <form className="max-w-lg mx-auto flex flex-col gap-4">
          <input className="border px-4 py-2 rounded" type="text" placeholder="Name" />
          <input className="border px-4 py-2 rounded" type="email" placeholder="Email" />
          <textarea className="border px-4 py-2 rounded" placeholder="Message" rows="4"></textarea>
          <button className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition">
            Send Message
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="bg-purple-900 text-white py-8 text-center">
        <p>© 2025 SafeHer. Built with ❤️ for women’s safety.</p>
      </footer>

    </div>
  );
}

export default App;
