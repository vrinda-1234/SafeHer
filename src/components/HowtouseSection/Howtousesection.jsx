import { useState, useEffect } from "react";
import {
  Moon,
  Heart,
  Car,
  Train,
  Activity,
  UserPlus,
} from "lucide-react";
import "./SafeHerSection.css";

const headings = [
  ["Safety that", "thinks ahead"],
  ["Safety that", "thinks ahead"],
  ["Protection in", "real time"],
  ["Protection in", "real time"],
  ["Confidence for", "every journey"],
  ["Confidence for", "every journey"],
];

const cardsData = [
  {
    icon: <Moon />,
    title: "The Long Walk Home",
    desc: "The street is quiet, your playlist is on, and the journey feels longer than usual. Whether you're returning from work, college, or a night out, SafeHer quietly watches over your journey so you can focus on getting home safely.",
  },

  {
    icon: <UserPlus />,
    title: "Exploring New Places",
    desc: "A new city, a new campus, or a neighborhood you've never visited before. SafeHer helps you move through unfamiliar environments with greater awareness, confidence, and peace of mind.",
  },

  {
    icon: <Train />,
    title: "Late-Night Commutes",
    desc: "The last bus, the final metro ride, the nearly empty platform. When public spaces feel quieter and less predictable, SafeHer stays alert and ready to assist whenever needed.",
  },

  {
    icon: <Heart />,
    title: "Moments That Feel Off",
    desc: "You can't always explain it, but sometimes your instincts notice something before your mind does. SafeHer is designed for those moments.",
  },

  {
    icon: <Car />,
    title: "Everyday Journeys",
    desc: "From college lectures to office meetings, shopping trips , SafeHer brings reassurance to the everyday moments in between.",
  },

  {
    icon: <Activity />,
    title: "Living Without Looking Over Your Shoulder",
    desc: "Walk, travel, explore, and embrace opportunities with greater confidence.Helping you focus on living your life instead of worrying about what could go wrong.",
  },
];

export default function SafeHerSection() {
  const [current, setCurrent] = useState(0);

  const goTo = (idx) => {
    if (idx < 0 || idx >= cardsData.length) return;
    setCurrent(idx);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft") goTo(current - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current]);

  return (
    <section className="safeher-section">
      {/* LEFT SIDE */}
      <div className="left-col relative">
        <h2 className="text-4xl">
          {headings[current][0]} <br />
          <strong dangerouslySetInnerHTML={{ __html: headings[current][1] }} />
        </h2>

        <div className="underline-bar" />
        <div className="flex position absolute left-5 bottom-20 gap-6">
          <button onClick={() => goTo(current - 1)}
             className="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center text-2xl hover:bg-pink-600 transition"
          >
          ←
          </button>

<button
  onClick={() => goTo(current + 1)}
  className="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center text-2xl hover:bg-pink-600 transition"
>
  →
</button>
        </div>

        

        <div className="nav-dots">
          {cardsData.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === current ? "active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      {/* CARDS */}
      <div className="cards-wrapper">
        <div
          className="cards-track"
          style={{
            transform: `translateX(-${current * 260}px)`,
          }}
        >
          {cardsData.map((card, i) => (
            <div
              key={i}
              className={`use-card ${i >= current && i <= current + 2 ? "visible" : ""}`}
            >
              <div className="card-top">
                <div className="icon-box">{card.icon}</div>
                <span className="card-num">{i + 1}</span>
              </div>

              <div className="card-title">{card.title}</div>
              <div className="card-desc">{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}