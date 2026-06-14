import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assests/logo.png";
import L from "../assests/L.jpg";
import {
  Shield, Brain, MapPin, Bell, Lock, Users,
  Phone, Navigation, PhoneCall, CheckCircle,
  ArrowRight, Mic, AlertTriangle, Zap, Eye
} from "lucide-react";

/* ─────────────────────── GLOBAL STYLES ─────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; background: #FAFAFA; color: #111018; overflow-x: hidden; }

    @keyframes pulseRing {
      0%   { transform: scale(1);   opacity: .4; }
      70%  { transform: scale(1.6); opacity: 0;  }
      100% { transform: scale(1.6); opacity: 0;  }
    }
    @keyframes float {
      0%,100% { transform: translateY(0); }
      50%     { transform: translateY(-12px); }
    }
    @keyframes blink {
      0%,100% { opacity: 1; }
      50%     { opacity: .25; }
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes scanLine {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(500px); }
    }

    .reveal { opacity: 0; transform: translateY(28px); transition: opacity .6s ease, transform .6s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    .gradient-text {
      background: linear-gradient(110deg, #E8195A 0%, #9333EA 55%, #2563EB 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-link {
      color: rgba(17,16,24,.5);
      font-size: 13.5px; font-weight: 500;
      text-decoration: none; transition: color .2s;
    }
    .nav-link:hover { color: #E8195A; }

    .btn-primary {
      background: linear-gradient(135deg, #E8195A, #9333EA);
      color: #fff; border: none; border-radius: 11px;
      padding: 12px 24px; font-size: 14px; font-weight: 600;
      font-family: 'Inter', sans-serif; cursor: pointer;
      box-shadow: 0 4px 20px rgba(232,25,90,.28);
      transition: opacity .2s, transform .2s;
    }
    .btn-primary:hover { opacity: .88; transform: translateY(-1px); }

    .btn-ghost {
      background: #fff;
      color: #111018;
      border: 1.5px solid #E4E2F0;
      border-radius: 11px; padding: 11px 22px;
      font-size: 14px; font-weight: 500;
      font-family: 'Inter', sans-serif; cursor: pointer;
      transition: border-color .2s, color .2s;
    }
    .btn-ghost:hover { border-color: #E8195A; color: #E8195A; }

    .feature-card {
      background: #fff;
      border: 1.5px solid #EEE;
      border-radius: 22px; padding: 28px;
      transition: transform .3s, border-color .3s, box-shadow .3s;
      position: relative; overflow: hidden;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      border-color: rgba(232,25,90,.2);
      box-shadow: 0 16px 48px rgba(232,25,90,.07);
    }

    .trust-card {
      background: #fff;
      border: 1.5px solid #EEE;
      border-radius: 18px; padding: 26px;
      transition: transform .3s, border-color .3s, box-shadow .3s;
    }
    .trust-card:hover {
      transform: translateY(-3px);
      border-color: rgba(147,51,234,.2);
      box-shadow: 0 12px 36px rgba(147,51,234,.07);
    }

    .live-dot {
      display: inline-block; width: 7px; height: 7px;
      border-radius: 50%; background: #16A34A;
      animation: blink 1.4s ease infinite; margin-right: 7px;
    }

    .step-connector {
      width: 1px; height: 52px;
      background: linear-gradient(to bottom, rgba(232,25,90,.35), transparent);
      margin: 0 auto;
    }

    .phone-screen {
      background: #fff;
      border-radius: 32px;
      border: 1.5px solid #E4E2F0;
      overflow: hidden; position: relative;
      box-shadow: 0 32px 80px rgba(17,16,24,.1), 0 4px 16px rgba(17,16,24,.06);
    }

    .stat-number {
      font-family: 'Syne', sans-serif;
      font-size: 34px; font-weight: 800;
      background: linear-gradient(135deg, #E8195A, #9333EA);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .marquee-inner { display: flex; width: max-content; animation: marquee 26s linear infinite; }

    input, textarea {
      width: 100%;
      background: #fff;
      border: 1.5px solid #E4E2F0;
      border-radius: 11px; padding: 13px 16px;
      color: #111018; font-family: 'Inter', sans-serif;
      font-size: 14px; outline: none; transition: border-color .2s;
    }
    input::placeholder, textarea::placeholder { color: rgba(17,16,24,.28); }
    input:focus, textarea:focus { border-color: #E8195A; }
    textarea { resize: vertical; min-height: 110px; }

    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr !important; }
      .hero-headline { font-size: 52px !important; }
      .hero-phone { display: none !important; }
      .features-grid { grid-template-columns: 1fr 1fr !important; }
      .trust-grid { grid-template-columns: 1fr 1fr !important; }
      .mission-grid { grid-template-columns: 1fr !important; }
      .hiw-grid { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 600px) {
      .features-grid { grid-template-columns: 1fr !important; }
      .trust-grid { grid-template-columns: 1fr !important; }
      .hero-headline { font-size: 40px !important; }
    }
  `}</style>
);

/* ─────────────────────── DATA ─────────────────────── */
const features = [
  { icon: <Bell size={22}/>, color:"#E8195A", bg:"rgba(232,25,90,.1)",   title:"Emergency SOS",    desc:"One tap sends your live GPS to every emergency contact — even without internet via SMS.", tag:"Instant" },
  { icon: <MapPin size={22}/>, color:"#9333EA", bg:"rgba(147,51,234,.1)", title:"Safety Score",     desc:"Real-time risk rating for your exact location with nearest hospitals and police stations.", tag:"Real-time" },
  { icon: <Mic size={22}/>, color:"#2563EB", bg:"rgba(37,99,235,.1)",    title:"Voice Monitoring",  desc:"On-device AI detects screams or distress sounds and fires an alert — no internet needed.", tag:"AI" },
  { icon: <PhoneCall size={22}/>, color:"#16A34A", bg:"rgba(22,163,74,.1)", title:"Fake Call",      desc:"Trigger a convincing incoming call in one tap to exit any uncomfortable situation discreetly.", tag:"Discreet" },
  { icon: <Navigation size={22}/>, color:"#D97706", bg:"rgba(217,119,6,.1)", title:"Safe Route",    desc:"Set your destination and get alerted the moment your path deviates unexpectedly.", tag:"Smart" },
  { icon: <Eye size={22}/>, color:"#E8195A", bg:"rgba(232,25,90,.1)",    title:"Always Watching",   desc:"Background monitoring runs silently 24/7 — protecting you even when you forget to check.", tag:"Always On" },
];

const steps = [
  { num:"01", icon:<Phone size={20}/>,        title:"Sign up in 60 seconds",       desc:"Create your account and add up to 5 emergency contacts. They don't need the app." },
  { num:"02", icon:<MapPin size={20}/>,       title:"Set your safe routes",        desc:"Tell SafeHer your regular journeys. It learns your patterns and watches for deviations." },
  { num:"03", icon:<Zap size={20}/>,          title:"One tap when it matters",     desc:"Press SOS — or let AI detect distress automatically. Contacts get your live location instantly." },
  { num:"04", icon:<CheckCircle size={20}/>,  title:"Help arrives, not just alerts", desc:"Contacts see a live map. They can call you or share your location with authorities." },
];

const trust = [
  { icon:<Lock size={22}/>,   color:"#9333EA", title:"End-to-End Encrypted", desc:"Your location and messages are encrypted before leaving your device." },
  { icon:<Brain size={22}/>,  color:"#2563EB", title:"On-Device AI",         desc:"Voice detection runs entirely on your phone. No audio is ever uploaded." },
  { icon:<Shield size={22}/>, color:"#16A34A", title:"Instant SOS",        desc:"Alert all your emergency contacts in instant." },
  { icon:<Users size={22}/>,  color:"#E8195A", title:"Built for Women",      desc:"Every feature was designed around real safety scenarios, not theoretical threats." },
];

const marqueeItems = ["Emergency SOS","Real-time Safety Score","AI Voice Detection","Offline SMS Alerts","Safe Route Tracking","Fake Call Trigger","End-to-End Encrypted","Zero Data Sold"];

/* ─────────────────────── HOOK ─────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─────────────────────── LABEL ─────────────────────── */
const Label = ({ children, color = "#E8195A", bg = "rgba(232,25,90,.1)" }) => (
  <span style={{ display:"inline-block", padding:"4px 14px", borderRadius:99, background:bg, color, fontSize:11, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", marginBottom:16 }}>{children}</span>
);

/* ─────────────────────── PHONE MOCKUP ─────────────────────── */
function PhoneMockup() {
  return (
    <div
      className="hero-phone"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform:"translateY(-60px)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "420px",
          animation: "float 5s ease-in-out infinite",
        }}
      >
        {/* Rings */}
        <div
          style={{
            position: "absolute",
            inset: "-20px",
            borderRadius: "50%",
            border: "1.5px solid rgba(235,35,90,.22)",
            animation: "pulseRing 2.2s ease-out infinite",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: "-40px",
            borderRadius: "50%",
            border: "1.5px solid rgba(235,35,90,.1)",
            animation: "pulseRing 2.2s ease-out infinite .65s",
          }}
        />

        {/* Image */}
        <img
          src={L}
          alt="SafeHer App"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "24px",
            boxShadow: "0 25px 60px rgba(17,16,24,.15)",
            position: "relative",
            zIndex: 1,
          }}
        />

        {/* Badge 1 */}
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            left: "-15%",
            zIndex: 2,
            background: "#fff",
            border: "1.5px solid #EEE",
            borderRadius: 16,
            padding: "10px 14px",
            boxShadow: "0 8px 24px rgba(0,0,0,.08)",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#16A34A",
              marginBottom: 2,
            }}
          >
            ✓ SOS Sent
          </p>
          <p
            style={{
              fontSize: 10,
              color: "rgba(17,16,24,.35)",
            }}
          >
            3 contacts notified
          </p>
        </div>

        {/* Badge 2 */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "-18%",
            zIndex: 2,
            background: "#fff",
            border: "1.5px solid #EEE",
            borderRadius: 16,
            padding: "10px 14px",
            boxShadow: "0 8px 24px rgba(0,0,0,.08)",
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: "rgba(17,16,24,.35)",
              marginBottom: 3,
            }}
          >
            AI monitoring
          </p>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#9333EA",
            }}
          >
            Active ●
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── MARQUEE ─────────────────────── */
function MarqueeStrip() {
  return (
    <div style={{ overflow:"hidden", padding:"18px 0", borderTop:"1px solid #EEE", borderBottom:"1px solid #EEE", background:"#EEE" }}>
      <div className="marquee-inner">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={i} style={{ display:"flex", alignItems:"center", gap:12, whiteSpace:"nowrap", padding:"0 28px", fontSize:12.5, fontWeight:600, color:"rgba(17,16,24,.4)", letterSpacing:".04em" }}>
            <span style={{ width:10, height:10, borderRadius:"50%", background:"#E8195A", display:"inline-block", flexShrink:0 }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── HOW IT WORKS ─────────────────────── */
function HowItWorks() {
  const alerts = [
    { time:"now", icon:<AlertTriangle size={14}/>, color:"#E8195A", bg:"rgba(232,25,90,.08)", border:"rgba(232,25,90,.15)", text:"SOS activated near MG Road", sub:"Location shared with 3 contacts" },
    { time:"2m",  icon:<MapPin size={14}/>,        color:"#D97706", bg:"rgba(217,119,6,.08)", border:"rgba(217,119,6,.15)",   text:"Route deviation detected",   sub:"Expected: Main Street → Home" },
    { time:"8m",  icon:<Mic size={14}/>,           color:"#9333EA", bg:"rgba(147,51,234,.08)",border:"rgba(147,51,234,.15)",  text:"AI monitoring active",        sub:"Listening for distress signals" },
    { time:"15m", icon:<CheckCircle size={14}/>,   color:"#16A34A", bg:"rgba(22,163,74,.08)", border:"rgba(22,163,74,.15)",   text:"Arrived home safely",         sub:"Safe route complete ✓" },
  ];

  return (
    <section id="how-it-works" style={{ padding:"100px 24px", background:"#F9F7FF", borderTop:"1px solid #EDE8FF", borderBottom:"1px solid #EDE8FF" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:64 }} className="reveal">
          <Label color="#9333EA" bg="rgba(147,51,234,.08)">How It Works</Label>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:44, fontWeight:800, letterSpacing:"-1px", lineHeight:1.1, color:"#111018" }}>
            Safety in <span className="gradient-text">four steps.</span>
          </h2>
          <p style={{ marginTop:14, fontSize:15, color:"rgba(17,16,24,.45)", maxWidth:400, margin:"14px auto 0" }}>
            From setup to SOS, SafeHer is designed to be fast when it counts.
          </p>
        </div>

        <div className="hiw-grid" style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:"0 72px", alignItems:"start" }}>
          {/* Steps */}
          <div>
            {steps.map((step, i) => (
              <div key={i} className="reveal" style={{ display:"flex", gap:20 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{
                    width:48, height:48, borderRadius:14, flexShrink:0,
                    background: i===0 ? "linear-gradient(135deg,#E8195A,#9333EA)" : "#fff",
                    border: i===0 ? "none" : "1.5px solid #EEE",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color: i===0 ? "#fff" : "rgba(17,16,24,.35)",
                    boxShadow: i===0 ? "0 6px 20px rgba(232,25,90,.25)" : "none"
                  }}>{step.icon}</div>
                  {i < steps.length - 1 && <div className="step-connector" />}
                </div>
                <div style={{ paddingBottom: i < steps.length-1 ? 32 : 0, paddingTop:10 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:"rgba(232,25,90,.6)", letterSpacing:".1em", display:"block", marginBottom:4 }}>{step.num}</span>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:"#111018", marginBottom:6 }}>{step.title}</h3>
                  <p style={{ fontSize:14, color:"rgba(17,16,24,.45)", lineHeight:1.75 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alert preview */}
          <div className="reveal" style={{ position:"sticky", top:120 }}>
            <div style={{ background:"#fff", border:"1.5px solid #EEE", borderRadius:24, padding:28, boxShadow:"0 8px 40px rgba(17,16,24,.06)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:22 }}>
                <span className="live-dot" />
                <p style={{ fontSize:11, fontWeight:600, color:"rgba(17,16,24,.4)", letterSpacing:".08em", textTransform:"uppercase" }}>Live Alert Preview</p>
              </div>
              {alerts.map((alert, i) => (
                <div key={i} style={{ display:"flex", gap:12, marginBottom: i<3 ? 16 : 0, alignItems:"flex-start" }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:alert.bg, border:`1.5px solid ${alert.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:alert.color, flexShrink:0 }}>{alert.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <p style={{ fontSize:13, fontWeight:600, color:"#111018" }}>{alert.text}</p>
                      <span style={{ fontSize:10, color:"rgba(17,16,24,.3)" }}>{alert.time}</span>
                    </div>
                    <p style={{ fontSize:12, color:"rgba(17,16,24,.4)" }}>{alert.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop:14, fontSize:12, color:"rgba(17,16,24,.35)", textAlign:"center" }}>All alerts delivered in under 2 seconds</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── MAIN ─────────────────────── */
export default function LandingPage() {
  useReveal();

  return (
    <>
      <GlobalStyle />
      <div style={{ background:"#FAFAFA", color:"#111018", overflowX:"hidden" }}>

        {/* NAVBAR */}
        <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(250,250,250,.92)", backdropFilter:"blur(20px)", borderBottom:"1px solid #EEE" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", height:66, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <img src={logo} alt="SafeHer" style={{ height:80, width:"auto" }} />
            <nav style={{ display:"flex", gap:32 }}>
              {[["Home","#home"],["Features","#features"],["How It Works","#how-it-works"],["Trust","#trust"],["Contact","#contact"]].map(([l,h]) => (
                <a key={l} href={h} className="nav-link">{l}</a>
              ))}
            </nav>
            <div style={{ display:"flex", gap:10 }}>
              <Link to="/login"><button className="btn-ghost" style={{ padding:"8px 18px", fontSize:13 }}>Log in</button></Link>
              <Link to="/signup"><button className="btn-primary" style={{ padding:"8px 18px", fontSize:13 }}>Get SafeHer</button></Link>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section id="home" style={{ minHeight:"100vh", display:"flex", alignItems:"center", paddingTop:66, background:"linear-gradient(155deg,#FFF5F8 0%,#FAFAFA 45%,#F5F0FF 100%)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"8%", left:"4%", width:520, height:520, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,25,90,.06),transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:"5%", right:"4%", width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle,rgba(147,51,234,.06),transparent 70%)", pointerEvents:"none" }} />

          <div className="hero-grid" style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center", width:"100%" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", marginBottom:22, gap:6 }}>
                <span className="live-dot" />
                <span style={{ fontSize:12, color:"rgba(17,16,24,.4)", fontWeight:500 }}>Protection active · 5,000+ women safeguarded</span>
              </div>

              <h1 className="hero-headline" style={{ fontFamily:"'Syne',sans-serif", fontSize:72, fontWeight:800, lineHeight:1.02, letterSpacing:"-2.5px", marginBottom:22, color:"#111018" }}>
                Your safety,<br /><span className="gradient-text">always on.</span>
              </h1>

              <p style={{ fontSize:17, color:"rgba(17,16,24,.5)", lineHeight:1.8, maxWidth:420, marginBottom:36 }}>
                AI-powered distress detection, real-time route monitoring, and one-tap SOS — so help is always within reach.
              </p>

              <div style={{ display:"flex", gap:12, marginBottom:52 }}>
                <Link to="/signup"><button className="btn-primary">Start for free <ArrowRight size={14} style={{ display:"inline", marginLeft:5 }} /></button></Link>
                <a href="#features"><button className="btn-ghost">See how it works</button></a>
              </div>

              <div style={{ display:"flex", gap:36 }}>
                {[["5K+","Women protected"],["< 2s","SOS response"],["99.9%","Alert delivery"]].map(([v,l]) => (
                  <div key={l}>
                    <p style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#E8195A", lineHeight:1 }}>{v}</p>
                    <p style={{ fontSize:12, color:"rgba(17,16,24,.35)", marginTop:4 }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <PhoneMockup />
          </div>
        </section>

        {/* MARQUEE */}
        <MarqueeStrip />

        {/* STAT STRIP */}
        <section style={{ background:"#fff", borderBottom:"1px solid #EEE", padding:"28px 24px", textAlign:"center" }}>
          <p style={{ fontSize:17, fontWeight:500, color:"rgba(17,16,24,.65)", maxWidth:700, margin:"0 auto" }}>
            Every <span style={{ color:"#E8195A", fontWeight:700 }}>33 seconds</span>, a woman faces a safety threat in public. SafeHer ensures you're never alone.
          </p>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ padding:"100px 24px", background:"#FAFAFA" }}>
          <div style={{ maxWidth:1200, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:56 }} className="reveal">
              <Label>Features</Label>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:44, fontWeight:800, letterSpacing:"-1px", lineHeight:1.1, color:"#111018" }}>
                Six layers of <span className="gradient-text">protection.</span>
              </h2>
              <p style={{ marginTop:14, fontSize:15, color:"rgba(17,16,24,.42)", maxWidth:400, margin:"14px auto 0" }}>
                Each feature was built around a real scenario, not a checkbox.
              </p>
            </div>
            <div className="features-grid reveal" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {features.map((f, i) => (
                <div key={i} className="feature-card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                    <div style={{ width:46, height:46, borderRadius:13, background:f.bg, display:"flex", alignItems:"center", justifyContent:"center", color:f.color }}>{f.icon}</div>
                    <span style={{ fontSize:10, fontWeight:700, color:f.color, background:f.bg, padding:"3px 10px", borderRadius:99, letterSpacing:".06em" }}>{f.tag}</span>
                  </div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, marginBottom:10, color:"#111018" }}>{f.title}</h3>
                  <p style={{ fontSize:13.5, color:"rgba(17,16,24,.45)", lineHeight:1.75 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* QUOTE STRIP */}
        <section style={{ padding:"72px 24px", background:"#fff", borderTop:"1px solid #EEE", borderBottom:"1px solid #EEE" }}>
          <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center" }} className="reveal">
            <p style={{ fontSize:11, fontWeight:600, color:"#1E3A8A", letterSpacing:".1em", textTransform:"uppercase", marginBottom:18 }}>In the press</p>
            <p style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:700, color:"rgba(17,16,24,.8)", lineHeight:1.55, maxWidth:660, margin:"0 auto 24px" }}>
              "SafeHer is setting a new standard for personal safety technology — invisible until you need it, instant when you do."
            </p>
            <p style={{ fontSize:13, color:"#1E3A8A" }}>Tech India Today · Women & Tech Digest · Safety First Magazine</p>
          </div>
        </section>

        {/* TRUST */}
        <section id="trust" style={{ padding:"100px 24px", background:"#FAFAFA" }}>
          <div style={{ maxWidth:1200, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:52 }} className="reveal">
              <Label color="#9333EA" bg="rgba(147,51,234,.08)">Privacy First</Label>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:44, fontWeight:800, letterSpacing:"-1px", color:"#111018" }}>
                Why women <span className="gradient-text">trust</span> SafeHer
              </h2>
            </div>
            <div className="trust-grid reveal" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              {trust.map((t, i) => (
                <div key={i} className="trust-card">
                  <div style={{ width:46, height:46, borderRadius:13, background:`${t.color}12`, display:"flex", alignItems:"center", justifyContent:"center", color:t.color, marginBottom:18 }}>{t.icon}</div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, marginBottom:8, color:"#111018" }}>{t.title}</h3>
                  <p style={{ fontSize:13, color:"rgba(17,16,24,.42)", lineHeight:1.7 }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MISSION BANNER */}
        <section style={{ padding:"0 24px 100px", background:"#FAFAFA" }}>
          <div className="mission-grid reveal" style={{ maxWidth:1200, margin:"0 auto", background:"linear-gradient(135deg,#FFF0F5,#F5F0FF,#EFF6FF)", border:"1.5px solid #EEE", borderRadius:28, padding:"64px 56px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center", boxShadow:"0 8px 40px rgba(232,25,90,.05)" }}>
            <div>
              <Label>Our Mission</Label>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800, lineHeight:1.2, letterSpacing:"-1px", marginBottom:18, color:"#111018" }}>
                Technology that protects — not surveils.
              </h2>
              <p style={{ fontSize:15, color:"rgba(17,16,24,.45)", lineHeight:1.85, marginBottom:28 }}>
                SafeHer exists to make personal safety proactive instead of reactive. No ads, no data selling — just a tool that works the moment you need it most.
              </p>
              <Link to="/signup"><button className="btn-primary">Join 5,000+ women <ArrowRight size={14} style={{ display:"inline", marginLeft:5 }} /></button></Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[["5K+","Women protected"],["99.9%","Alert delivery"],["< 2s","SOS response"],["0","Data ever sold"]].map(([v,l]) => (
                <div key={l} style={{ background:"#fff", border:"1.5px solid #EEE", borderRadius:18, padding:"24px 16px", textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
                  <p className="stat-number" style={{ marginBottom:6 }}>{v}</p>
                  <p style={{ fontSize:12, color:"rgba(17,16,24,.38)" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding:"0 24px 100px", background:"#FAFAFA" }}>
          <div style={{ maxWidth:480, margin:"0 auto", textAlign:"center" }} className="reveal">
            <Label color="#2563EB" bg="rgba(37,99,235,.08)">Get in Touch</Label>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:38, fontWeight:800, letterSpacing:"-1px", marginBottom:10, color:"#111018" }}>We're here for you</h2>
            <p style={{ fontSize:14, color:"#1E3A8A", marginBottom:36 }}>Questions, feedback, or partnership enquiries?</p>
            <div style={{ background:"#fff", border:"1.5px solid #EEE", borderRadius:24, padding:36, boxShadow:"0 8px 40px rgba(0,0,0,.06)" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <input type="text" placeholder="Your name" />
                <input type="email" placeholder="Email address" />
                <textarea placeholder="Your message..." />
                <button className="btn-primary" style={{ width:"100%", padding:14, fontSize:15, marginTop:4, borderRadius:11 }}>Send Message</button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop:"1px solid #EEE", padding:"36px 24px", background:"#1E3A8A" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
            
            <p style={{ fontSize:12, color:"#fff" }}>© 2025 SafeHer · Built for women's safety · No data sold. Ever.</p>
            <div style={{ display:"flex", gap:20 }}>
              {["Privacy","Terms","Contact"].map(l => <a key={l} href="#" style={{ fontSize:12, color:"#fff", textDecoration:"none" }}>{l}</a>)}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
