"use client";

import Link from "next/link";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Zap,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [focused, setFocused] = useState<
    string | null
  >(null);

  async function handleRegister() {
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      setLoading(true);

      await new Promise((r) =>
        setTimeout(r, 1200)
      );

      const res = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error || "Registration failed"
        );
        return;
      }

      window.location.href = "/login";
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white flex overflow-hidden selection:bg-emerald-500/30">
      {/* Left Side */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between p-16 border-r border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0A0A0B] to-[#0A0A0B] -z-10" />

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>

          <span className="text-xl font-bold tracking-tight">
            GridSense
          </span>
        </motion.div>

        <div className="max-w-xl">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-6xl font-medium tracking-tight leading-[1.05]"
          >
            Start managing energy smarter.
          </motion.h1>

          <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
            Create your GridSense account
            and unlock advanced electricity
            tracking across all your homes.
          </p>

          <div className="grid grid-cols-2 gap-5 mt-12">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
              <UserPlus className="w-6 h-6 text-cyan-400 mb-4" />

              <h3 className="font-medium">
                Multi-Home Support
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Manage multiple properties
                seamlessly.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-4" />

              <h3 className="font-medium">
                Secure Sessions
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Enterprise-grade account
                protection.
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-zinc-500">
          Designed for modern energy
          management.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="w-full max-w-[420px] space-y-8"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Create Account
            </p>

            <h2 className="mt-3 text-5xl font-medium tracking-tight">
              Register
            </h2>
          </div>

          <div className="space-y-5">
            {[
              {
                key: "email",
                type: "email",
                value: email,
                setter: setEmail,
                placeholder:
                  "name@example.com",
              },
              {
                key: "password",
                type: "password",
                value: password,
                setter: setPassword,
                placeholder: "Password",
              },
              {
                key: "confirm",
                type: "password",
                value: confirmPassword,
                setter:
                  setConfirmPassword,
                placeholder:
                  "Confirm password",
              },
            ].map((field) => (
              <div
                key={field.key}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    focused === field.key
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-20 blur-md"
                      : "opacity-0"
                  }`}
                />

                <div
                  className={`relative flex items-center bg-[#121214] border rounded-xl overflow-hidden transition-colors duration-300 ${
                    focused === field.key
                      ? "border-cyan-500/50"
                      : "border-white/10 group-hover:border-white/20"
                  }`}
                >
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) =>
                      field.setter(
                        e.target.value
                      )
                    }
                    onFocus={() =>
                      setFocused(field.key)
                    }
                    onBlur={() =>
                      setFocused(null)
                    }
                    className="w-full bg-transparent px-5 py-4 text-sm outline-none placeholder:text-zinc-600"
                    placeholder={
                      field.placeholder
                    }
                  />
                </div>
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleRegister}
              disabled={
                loading ||
                !email ||
                !password ||
                !confirmPassword
              }
              className="w-full relative group overflow-hidden rounded-xl bg-white text-black font-medium disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-center justify-center gap-2 py-4">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="flex items-center gap-2"
                    >
                      Create Account{" "}
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white hover:text-cyan-400 transition-colors"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}