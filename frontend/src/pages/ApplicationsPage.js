import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getApplications } from "../services/api";
import { FiSend, FiCheck, FiClock, FiMail } from "react-icons/fi";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getApplications();
        setApplications(res.data || []);
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-ink grid-bg noise-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            My Applications
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Track your submitted applications
          </p>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="spinner" />
            </div>
          ) : applications.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <FiSend className="mx-auto text-gray-500 mb-3" size={32} />
              <p className="text-gray-400 mb-1">No applications yet</p>
              <p className="text-gray-500 text-sm">
                Start by discovering and applying to jobs
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-lime/20 to-accent-cyan/20 flex items-center justify-center text-accent-lime font-display font-bold border border-accent-lime/20 mt-0.5">
                        {app.company?.[0]}
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-white">
                          {app.jobTitle}
                        </h3>
                        <p className="text-sm text-gray-400">{app.company}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <FiClock size={12} />
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </span>
                          {app.emailSent && (
                            <span className="flex items-center gap-1 text-xs text-accent-lime">
                              <FiMail size={12} />
                              Email sent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-accent-lime bg-accent-lime/10 px-2 py-1 rounded-md">
                      <FiCheck size={12} />
                      Applied
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
