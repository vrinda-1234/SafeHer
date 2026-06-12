import React, { useEffect } from "react";
import logo from "../assests/logo.png";
import { Link } from "react-router-dom";
import L from "../assests/L.jpg";
import SafeHerSection from "../components/HowtouseSection/Howtousesection";
import {
  Shield,
  Brain,
  MapPin,
  Bell,
  Lock,
  Users,
  Sparkles,
  Phone,
} from "lucide-react";
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
      <header
        className="
  fixed top-0 left-0 right-0 z-50
  bg-white/70
  backdrop-blur-xl
  border-b border-white/20
  shadow-lg
"
      >
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="SafeHer Logo" className="h-12 w-auto" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-8 font-medium text-black">
            <a
              href="#home"
              className="
  text-slate-700
  font-medium
  hover:text-pink-500
  hover:-translate-y-1
  transition-all
  duration-300
"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              className="
  text-slate-700
  font-medium
  hover:text-pink-500
  hover:-translate-y-1
  transition-all
  duration-300
"
            >
              How It Works
            </a>
            <a
              href="#solution"
              className="
  text-slate-700
  font-medium
  hover:text-pink-500
  hover:-translate-y-1
  transition-all
  duration-300
"
            >
              Solution
            </a>
            <a
              href="#trust"
              className="
  text-slate-700
  font-medium
  hover:text-pink-500
  hover:-translate-y-1
  transition-all
  duration-300
"
            >
              Trust
            </a>
            <a
              href="#contact"
              className="
  text-slate-700
  font-medium
  hover:text-pink-500
  hover:-translate-y-1
  transition-all
  duration-300
"
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
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50  via-white to-pink-50"
      >
        <div className="absolute top-20 left-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-32 right-40 animate-pulse">
          <Shield size={80} className="text-pink-300" />
        </div>

        {/* Background Overlay */}

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36 min-h-screen flex items-center">
          {/* LEFT CONTENT */}

          <div className="w-full lg:w-1/2">
            <div className="mb-6">
              <span className="px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold">
                AI Powered Women's Safety Platform
              </span>
            </div>
            <h1
              className="
              text-6xl md:text-8xl
  font-extrabold
  tracking-tight
  leading-none
  mb-8
"
            >
              Your Safety,
              <br />
              <span
                className="
  bg-gradient-to-r
  from-blue-900
  to-pink-500
  bg-clip-text
  text-transparent
"
              >
                Our Priority
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg mb-10">
              SafeHer uses AI and real-time monitoring to detect distress and
              alert help before danger escalates.
            </p>

            <div>
              <Link to="/login">
                <button
                  className="
      bg-white
      text-black
      px-6
      py-3
      rounded-xl
      font-semibold
      border-2
      border-blue-900
      hover:border-pink-500
      hover:scale-105
      transition
    "
                >
                  Get Started
                </button>
              </Link>

              <div
                className="mt-10
  bg-white/60
  backdrop-blur-xl
  border
  border-white
  rounded-3xl
  p-6
  inline-flex
  gap-12
  shadow-2xl"
              >
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">24/7</h3>
                  <p className="text-sm text-slate-500">Monitoring</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-blue-900">AI</h3>
                  <p className="text-sm text-slate-500">Detection</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-blue-900">Instant</h3>
                  <p className="text-sm text-slate-500">Alerts</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden lg:flex w-1/2 justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 to-blue-500 rounded-[40px] blur-2xl opacity-60" />

              <img
                src={L}
                alt="SafeHer"
                className="relative h-[80vh] object-cover rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] hover:scale-[1.02] transition-all duration-500"
              />
            </div>
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
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain size={42} />,
                title: "AI Detection",
                desc: "Detects distress and dangerous situations automatically.",
              },
              {
                icon: <MapPin size={42} />,
                title: "Live Tracking",
                desc: "Monitors route deviation and suspicious movement.",
              },
              {
                icon: <Bell size={42} />,
                title: "Instant SOS",
                desc: "Alerts emergency contacts immediately.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="
      bg-white
      p-8
      rounded-3xl
      shadow-xl
      hover:-translate-y-2
      transition-all
      duration-300
      border
      border-slate-100
      "
              >
                <div className="text-pink-500 mb-4">{item.icon}</div>

                <h3 className="font-bold text-2xl text-blue-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
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
      <section id="trust" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-5xl font-bold text-blue-900 mb-16">
            Why Women Trust SafeHer
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Lock size={36} />,
                title: "Secure Data",
                desc: "End-to-end encrypted safety information.",
              },
              {
                icon: <Brain size={36} />,
                title: "AI Powered",
                desc: "Real-time behaviour analysis.",
              },
              {
                icon: <Shield size={36} />,
                title: "Reliable",
                desc: "Designed for real-world emergencies.",
              },
              {
                icon: <Users size={36} />,
                title: "Community First",
                desc: "Built specifically for women.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="
          rounded-3xl
          bg-gradient-to-br
          from-white
          to-slate-50
          p-8
          shadow-xl
          hover:-translate-y-2
          transition-all
        "
              >
                <div className="text-pink-500 mb-5">{item.icon}</div>

                <h3 className="font-bold text-xl text-blue-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 bg-gradient-to-br from-pink-50 to-purple-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="bg-pink-100 text-pink-500 px-4 py-2 rounded-full">
                ABOUT SAFEHER
              </span>

              <h2 className="text-5xl font-bold mt-6 text-blue-900">
                Technology That Protects
              </h2>

              <p className="mt-6 text-lg text-gray-700">
                SafeHer combines AI, live location intelligence, emergency
                detection, and instant response systems to help women stay safe
                wherever they are.
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-2xl">
              <Sparkles className="text-pink-500 mb-4" size={50} />

              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Our Mission
              </h3>

              <p className="text-gray-600">
                To make personal safety proactive instead of reactive using
                intelligent technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="py-24 px-4 bg-gradient-to-br from-blue-50 via-white to-pink-50"
      >
        <h2 className="text-4xl font-bold text-blue-900 mb-6">Contact Us</h2>
        <p className="text-gray-700 mb-8 text-center">
          Questions, feedback, or support? We’re here for you.
        </p>

        <div
          className="
  max-w-xl
  mx-auto
  bg-white/70
  backdrop-blur-xl
  p-10
  rounded-3xl
  shadow-[0_20px_60px_rgba(0,0,0,0.15)]
  border
  border-white
"
        >
          <form className="flex flex-col gap-4">
            <input
              className="border px-4 py-3 rounded-xl"
              type="text"
              placeholder="Name"
            />

            <input
              className="border px-4 py-3 rounded-xl"
              type="email"
              placeholder="Email"
            />

            <textarea
              className="border px-4 py-3 rounded-xl"
              placeholder="Message"
              rows="4"
            ></textarea>

            <button className="bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-white py-8 text-center">
        <p>© 2025 SafeHer. Built with ❤️ for women’s safety.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
