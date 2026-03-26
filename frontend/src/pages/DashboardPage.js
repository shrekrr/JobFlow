import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { getResume, getApplications, getFeedback } from "../services/api";
import { FiUpload, FiSliders, FiCompass, FiSend, FiTrendingUp, FiCheckCircle, FiHeart } from "react-icons/fi";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ hasResume: false, applications: 0, liked: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [resumeRes, appsRes, feedbackRes] = await Promise.allSettled([
          getResume(),
          getApplications(),
          getFeedback(),
        ]);

        const hasResume = resumeRes.status === "fulfilled" && resumeRes.value.data;
        const applications = appsRes.status === "fulfilled" ? appsRes.value.data.length : 0;
        const feedback = feedbackRes.status === "fulfilled" ? feedbackRes.value.data : {};
        const liked = Object.values(feedback).filter((f) => f.liked).length;

        setStats({ hasResume: !!hasResume, applications, liked });
      } catch {
        // Fail silently
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const quickActions = [
    {
      icon: FiUpload,
      label: "Upload Resume",
      desc: "Upload your PDF or DOC resume",
      path: "/upload",
      color: "lime",
      done: stats.hasResume,
    },
    {
      icon: FiSliders,
      label: "Set Preferences",
      desc: "Choose job types and locations",
      path: "/preferences",
      color: "cyan",
    },
    {
      icon: FiCompass,
      label: "Discover Jobs",
      desc: "Swipe through matched jobs",
      path: "/swipe",
      color: "violet",
    },
    {
      icon: FiSend,
      label: "Applications",
      desc: "View your submitted applications",
      path: "/applications",
      color: "coral",
    },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-ink grid-bg noise-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
            {greeting()}, {user?.displayName || "there"}
          </h1>
          <p className="text-gray-400">
            Here's your job search overview
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 sm:gap-4 mb-8"
        >
          <div className="glass-card rounded-xl p-4 text-center">
            <FiHeart className="mx-auto text-accent-lime mb-2" size={20} />
            <div className="font-display text-xl sm:text-2xl font-bold text-white">
              {loading ? "—" : stats.liked}
            </div>
            <div className="text-xs text-gray-400 mt-1">Liked Jobs</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <FiSend className="mx-auto text-accent-cyan mb-2" size={20} />
            <div className="font-display text-xl sm:text-2xl font-bold text-white">
              {loading ? "—" : stats.applications}
            </div>
            <div className="text-xs text-gray-400 mt-1">Applied</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <FiCheckCircle className="mx-auto text-accent-violet mb-2" size={20} />
            <div className="font-display text-xl sm:text-2xl font-bold text-white">
              {loading ? "—" : stats.hasResume ? "Yes" : "No"}
            </div>
            <div className="text-xs text-gray-400 mt-1">Resume</div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FiTrendingUp size={18} className="text-accent-lime" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              const colorMap = {
                lime: "text-accent-lime bg-accent-lime/10 border-accent-lime/20",
                cyan: "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20",
                violet: "text-accent-violet bg-accent-violet/10 border-accent-violet/20",
                coral: "text-accent-coral bg-accent-coral/10 border-accent-coral/20",
              };
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="glass-card rounded-xl p-5 hover:border-accent-lime/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[action.color]}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-white group-hover:text-accent-lime transition-colors flex items-center gap-2">
                        {action.label}
                        {action.done && (
                          <FiCheckCircle size={14} className="text-accent-lime" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-400 mt-0.5">{action.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <h2 className="font-display text-lg font-semibold text-white mb-4">
            How JobFlow Works
          </h2>
          <div className="glass-card rounded-xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
              {[
                { step: "1", label: "Upload Resume" },
                { step: "2", label: "Set Preferences" },
                { step: "3", label: "Swipe Jobs" },
                { step: "4", label: "AI Tailors Resume" },
                { step: "5", label: "Apply" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-accent-lime/10 border border-accent-lime/30 flex items-center justify-center text-accent-lime font-display font-bold text-sm mb-2">
                    {s.step}
                  </div>
                  <span className="text-xs text-gray-300">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
