"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMode = (registerState: boolean) => {
    setIsRegister(registerState);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser(name, email, password);
        await loginUser(email, password);
      } else {
        await loginUser(email, password);
      }
      router.push("/route53");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1b2a] flex flex-col justify-center items-center p-4 text-white font-sans">
      <div className="w-full max-w-md bg-[#161e2e] border border-gray-700 rounded-lg p-6 shadow-2xl">
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-[#ec7211] text-white font-bold px-2 py-1 rounded text-xs">AWS</div>
          <span className="font-semibold text-lg">Amazon Route 53 Console</span>
        </div>

        <h1 className="text-xl font-bold mb-1">
          {isRegister ? "Create AWS Admin User" : "IAM User Sign-In"}
        </h1>
        <p className="text-xs text-gray-400 mb-4">
          {isRegister
            ? "Register a new user for Route 53 management"
            : "Sign in with your account credentials"}
        </p>

        {error && (
          <div className="mb-4 bg-red-900/40 border border-red-500 text-red-200 text-xs p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Route53 Admin"
                className="w-full bg-[#0f1b2a] border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-[#ec7211]"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-1">IAM User Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              className="w-full bg-[#0f1b2a] border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-[#ec7211]"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0f1b2a] border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-[#ec7211]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ec7211] hover:bg-[#eb5f07] font-semibold py-2 px-4 rounded text-white transition-colors"
          >
            {loading ? "Authenticating..." : isRegister ? "Register & Sign In" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-700 text-center text-xs text-gray-400">
          {isRegister ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => toggleMode(false)}
                className="text-[#ec7211] underline hover:text-white"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Need an account?{" "}
              <button
                type="button"
                onClick={() => toggleMode(true)}
                className="text-[#ec7211] underline hover:text-white"
              >
                Create One
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
