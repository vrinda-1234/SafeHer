import React, { useEffect } from "react";
import logo from "../assests/logo.png";
import { Link } from "react-router-dom";
import L from "../assests/L.jpg"
import SafeHerSection from "../components/HowtouseSection/Howtousesection";
function LandingPage() {
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

    return () =>
      links.forEach((link) =>
        link.removeEventListener("click", handleSmoothScroll)
      );
  }, []);

  return (
    <div className="font-sans scroll-smooth">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 shadow-sm ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="SafeHer Logo" className="h-16 w-auto" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-8 font-medium text-black">
            <a href="#home" className="hover:text-pink-500 transition-colors">
              Home
            </a>
            <a
              href="#how-it-works"
              className="hover:text-pink-500 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#solution"
              className="hover:text-pink-500 transition-colors"
            >
              Solution
            </a>
            <a href="#trust" className="hover:text-pink-500 transition-colors">
              Trust
            </a>
            <a
              href="#contact"
              className="hover:text-pink-500 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex space-x-3">
            <Link to="/login">
              <button className="px-5 py-2.5 border-2 border-blue-900 text-black rounded-xl hover:text-gray-700 hover:border-pink-600">
                Login
              </button>
            </Link>

            <Link to="/signup">
              <button className="px-6 py-2.5 bg-pink-500 text-white rounded-xl shadow-lg hover:bg-pink-400 ">
                Get SafeHer
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO / HOME */}
<section
  id="home"
  className="relative min-h-screen bg-white text-black overflow-hidden"
>
  {/* Background Overlay */}
  <div className="absolute inset-0 bg-black/40 z-0"></div>

  <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16 h-screen flex items-center">
    
    {/* LEFT CONTENT */}
    <div className="w-full lg:w-1/2">
      <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
        Your Safety,
      <br />
      <span className="text-blue-900 text-7xl">Our Priority</span>
      </h1>

      <p className="text-lg text-gray-600 max-w-lg mb-10">
        SafeHer uses AI and real-time monitoring to detect distress and alert
        help before danger escalates.
      </p>

      <div className="flex flex-wrap gap-4">

      <Link to="/login">
          <button
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold
          hover:scale-105 transition border-2  border-blue-900  hover:border-pink-500 hover:animate-pulse
          ">
          Get Started
        </button>

      </Link>

      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="hidden lg:flex w-1/2 justify-end">
      <img
        src={L}
        alt="SafeHer"
        className="h-[85vh] object-cover rounded-2xl shadow-2xl"
      />
    </div>
  </div>
</section>
      {/* PROBLEM */}
      <section className="relative py-24 px-6 bg-purple-50">
        {/* Decorative blurred shapes */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-400/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Small label */}
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-rose-100 text-rose-600 text-sm font-semibold tracking-wide">
            THE REALITY
          </span>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 leading-tight">
            Safety Isn’t Guaranteed.
            <span className="text-pink-500"> That’s the Problem.</span>
          </h2>
        </div>
      </section>

      {/* SOLUTION */}
      <section
        id="solution"
        className="relative py-28 px-6 bg-gradient-to-br from-violet-50 via-white to-rose-50 overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Tag */}
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-purple-100 text-blue-900 text-sm font-semibold tracking-wide">
            HOW SAFEHER PROTECTS YOU
          </span>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6">
            A Smarter, Faster Way
            <span className="text-pink-500"> To Stay Safe</span>
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
            SafeHer combines AI, real-time data, and intelligent decision-making
            to protect you — even when you can’t react.
          </p>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div
              className="group relative bg-white rounded-2xl p-8 shadow-xl border border-slate-200
                      hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                AI-Powered Detection
              </h3>

              <p className="text-slate-600 leading-relaxed">
                Automatically detects distress signals like shouting, sudden
                movements, or abnormal patterns in real time.
              </p>

              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                        transition pointer-events-none
                        ring-2 ring-pink-400/40"
              ></div>
            </div>

            {/* Card 2 */}
            <div
              className="group relative bg-white rounded-2xl p-8 shadow-xl border border-slate-200
                      hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Smart Location Tracking
              </h3>

              <p className="text-slate-600 leading-relaxed">
                Continuously monitors your route and movement patterns to
                identify unusual or risky behavior instantly.
              </p>

              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                        transition pointer-events-none
                        ring-2 ring-blue-900/40"
              ></div>
            </div>

            {/* Card 3 */}
            <div
              className="group relative bg-white rounded-2xl p-8 shadow-xl border border-slate-200
                      hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Instant Alerts
              </h3>

              <p className="text-slate-600 leading-relaxed">
                Sends automatic alerts to trusted contacts or authorities
                without requiring any manual action.
              </p>

              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                        transition pointer-events-none
                        ring-2 ring-rose-400/40"
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
<section id="how-it-works" className=" min-h-[500px] w-full">
  <div className="w-full h-full">
    <SafeHerSection />
  </div>
</section>

      {/* TRUST */}
      <section id="trust" className="bg-white py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-12">
          Why Women Trust SafeHer
        </h2>
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
        <h2 className="text-4xl font-bold text-pink-500 mb-6">About Us</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          SafeHer was created to address a reality many women live with every
          day. We believe technology should protect, not intimidate. Social
          impact and ethical AI are at the heart of everything we do.
        </p>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-6">Contact Us</h2>
        <p className="text-gray-700 mb-8">
          Questions, feedback, or support? We’re here for you.
        </p>
        <form className="max-w-lg mx-auto flex flex-col gap-4">
          <input
            className="border px-4 py-2 rounded"
            type="text"
            placeholder="Name"
          />
          <input
            className="border px-4 py-2 rounded"
            type="email"
            placeholder="Email"
          />
          <textarea
            className="border px-4 py-2 rounded"
            placeholder="Message"
            rows="4"
          ></textarea>
          <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition">
            Send Message
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-white py-8 text-center">
        <p>© 2025 SafeHer. Built with ❤️ for women’s safety.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
