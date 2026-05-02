import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Landing() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-slate-50 font-sans">
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary-600 min-h-[520px] flex items-center">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-white/5 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
            <span>🌱</span> Community-Powered Giving, Exchanging & Resale
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Turn Surplus Into<br />
            <span className="text-accent">Someone's Blessing</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with your community to donate food, clothes, exchange toys, and resell unused items — reducing waste while helping those in need in Mirzapur and beyond.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4">
            <button className="bg-accent hover:bg-yellow-500 text-slate-900 font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5" onClick={() => navigate("/feed")}>
              🎁 Browse Items
            </button>
            {!user && (
              <button onClick={() => navigate("/register")} className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl border-2 border-white/30 transition-all hover:-translate-y-0.5">
                Create Account
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Why ShareCycle ♻️?</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">We bridge the gap between those who have and those who need.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem */}
          <div className="rounded-3xl p-8 border border-red-100 bg-gradient-to-br from-red-50 to-white shadow-sm">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl mb-6">⚠️</div>
            <h3 className="text-2xl font-bold text-red-900 mb-3">The Problem</h3>
            <p className="text-gray-600 leading-relaxed">
              Every day, tons of food expires unused and perfectly good clothes end up in landfills — while millions in our communities lack access to these basic necessities. Waste and need exist side by side.
            </p>
          </div>

          {/* Solution */}
          <div className="rounded-3xl p-8 border border-primary-100 bg-gradient-to-br from-primary-50 to-white shadow-sm">
            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center text-2xl mb-6">✨</div>
            <h3 className="text-2xl font-bold text-primary-900 mb-3">Our Solution</h3>
            <p className="text-gray-600 leading-relaxed">
              ShareCycle ♻️ directly connects donors and recipients within localities — making it effortless to donate food, exchange toys, or resell quality furniture at fair prices. No middlemen. Just community.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { step: '01', icon: '📝', title: 'Register', desc: 'Create a free account in under 2 minutes with just your name and email.' },
              { step: '02', icon: '📦', title: 'Post or Browse', desc: 'List your surplus items or browse available donations near you.' },
              { step: '03', icon: '🤝', title: 'Connect & Share', desc: 'Claim what you need or hand off what you don\'t — directly in your community.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-primary-50 border-2 border-primary-200 flex items-center justify-center text-3xl mb-6 shadow-sm">
                  {item.icon}
                </div>
                <div className="text-xs font-extrabold text-primary-500 tracking-widest mb-3 uppercase">Step {item.step}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm">
        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
           <span className="text-2xl">🤝</span>
        </div>
        <p className="text-white font-bold text-lg mb-2">ShareCycle ♻️</p>
        <p>Community Donation & Resale Platform</p>
        <div className="mt-8 flex flex-col items-center gap-4">
           <button onClick={() => navigate("/admin-login")} className="text-slate-500 hover:text-primary-400 text-xs font-bold uppercase tracking-widest border border-slate-700 px-4 py-2 rounded-lg transition-colors">
              Secure Admin Login
           </button>
           <p className="text-slate-600">© 2026 ShareCycle ♻️. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;