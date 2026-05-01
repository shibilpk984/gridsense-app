"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Zap, BarChart3, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  async function handleLogin() {
    try {
      setLoading(true);
      // Simulate network delay for the animation
      await new Promise((r) => setTimeout(r, 1500));
      
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) return alert(data.error || "Login failed");
      window.location.href = "/dashboard";
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white flex overflow-hidden selection:bg-emerald-500/30">
      {/* Left side - Immersive Branding */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between p-16 border-r border-white/10 overflow-hidden">
        {/* Dynamic Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#0A0A0B] to-[#0A0A0B] -z-10" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"
        />

        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">GridSense</span>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-xl z-10">
          <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-8">
            Manage your energy grid with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">precision.</span>
          </motion.h1>
          
          <div className="grid grid-cols-2 gap-6 mt-12">
            {[
              { icon: BarChart3, title: "Real-time Analytics", desc: "Monitor multi-home usage instantly." },
              { icon: ShieldCheck, title: "Enterprise Grade", desc: "Bank-level security for your data." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                <feature.icon className="w-6 h-6 text-emerald-400 mb-4" />
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side - Auth Flow */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-[400px] space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-medium tracking-tight">Welcome back</h2>
            <p className="text-zinc-500">Enter your credentials to access your dashboard.</p>
          </div>

          <div className="space-y-5">
            {/* Custom Input 1 */}
            <div className="relative group">
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${focused === 'email' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 blur-md' : 'opacity-0'}`} />
              <div className={`relative flex items-center bg-[#121214] border rounded-xl overflow-hidden transition-colors duration-300 ${focused === 'email' ? 'border-emerald-500/50' : 'border-white/10 group-hover:border-white/20'}`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent px-5 py-4 text-sm outline-none placeholder:text-zinc-600"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Custom Input 2 */}
            <div className="relative group">
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${focused === 'password' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 blur-md' : 'opacity-0'}`} />
              <div className={`relative flex items-center bg-[#121214] border rounded-xl overflow-hidden transition-colors duration-300 ${focused === 'password' ? 'border-emerald-500/50' : 'border-white/10 group-hover:border-white/20'}`}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent px-5 py-4 text-sm outline-none placeholder:text-zinc-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link href="#" className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Interactive Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full relative group overflow-hidden rounded-xl bg-white text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-cyan-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-2 py-4">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      Sign In <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-white hover:text-emerald-400 transition-colors">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}