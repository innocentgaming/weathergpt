"use client";

import { useState } from 'react';
import { X, User, LogIn, UserPlus, ShieldCheck, CheckCircle2, Lock, Mail, Sparkles } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  role: 'general' | 'traveller' | 'farmer' | 'disaster' | 'school';
  isGuest: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export default function AuthModal({ isOpen, onClose, currentUser, onLogin, onLogout }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'guest' | 'login' | 'register'>('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'general' | 'traveller' | 'farmer' | 'disaster' | 'school'>('general');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleGuestLogin = () => {
    const guestUser: UserProfile = {
      name: "Guest Explorer",
      email: "guest@weathergpt.local",
      role: role,
      isGuest: true
    };
    onLogin(guestUser);
    setSuccessMsg("Logged in as Guest!");
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 600);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    const loggedUser: UserProfile = {
      name: email.split('@')[0] || "User",
      email: email,
      role: role,
      isGuest: false
    };
    onLogin(loggedUser);
    setSuccessMsg("Successfully signed in!");
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    const registeredUser: UserProfile = {
      name: name,
      email: email,
      role: role,
      isGuest: false
    };
    onLogin(registeredUser);
    setSuccessMsg("Account created successfully!");
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">WeatherGPT Access</h3>
              <p className="text-xs text-slate-400">Choose your authentication preference</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current User Logged In State */}
        {currentUser ? (
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 text-2xl font-extrabold">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{currentUser.name}</h4>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                {currentUser.isGuest ? 'Guest Access' : `${currentUser.role} Account`}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex gap-3">
              <button
                onClick={onLogout}
                className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-semibold transition"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition"
              >
                Continue App
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Tabs */}
            <div className="grid grid-cols-3 bg-slate-950/60 p-1 border-b border-slate-800 text-xs font-bold text-slate-400">
              <button
                onClick={() => setActiveTab('guest')}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'guest' 
                    ? 'bg-slate-800 text-emerald-400 shadow' 
                    : 'hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Guest Mode
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'login' 
                    ? 'bg-slate-800 text-cyan-400 shadow' 
                    : 'hover:text-slate-200'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'register' 
                    ? 'bg-slate-800 text-purple-400 shadow' 
                    : 'hover:text-slate-200'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Register
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {successMsg}
                </div>
              )}

              {/* Guest Tab */}
              {activeTab === 'guest' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 text-center">
                    <Sparkles className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-white">Instant Anonymous Access</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      No email or sign-up needed. Access live weather, AI forecasts, and disaster warnings instantly.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Select Primary Persona
                    </label>
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="general">General Public</option>
                      <option value="traveller">Traveller & Commuter</option>
                      <option value="farmer">Farmer / Agriculture</option>
                      <option value="disaster">Disaster Officer</option>
                      <option value="school">School & University</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGuestLogin}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Continue as Guest
                  </button>
                </div>
              )}

              {/* Login Tab */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-cyan-600/30 transition flex items-center justify-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </button>
                </form>
              )}

              {/* Register Tab */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">User Role</label>
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="general">General Public</option>
                      <option value="traveller">Traveller</option>
                      <option value="farmer">Farmer</option>
                      <option value="disaster">Disaster Officer</option>
                      <option value="school">Student / Teacher</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
