import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { submitApplication } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProgressStepper from "../components/ProgressStepper";
import { FiSend, FiCheck, FiFileText, FiMail, FiAlertCircle } from "react-icons/fi";

export default function SubmitPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { job, tailoredResume, coverLetter } = location.state || {};

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  if (!job) {
    navigate("/swipe");
    return null;
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const res = await submitApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        coverLetter: coverLetter || "",
        tailoredResume: tailoredResume || "",
        candidateName: user?.displayName || user?.email || "Applicant",
      });

      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink grid-bg noise-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <ProgressStepper currentStep={4} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          {submitted ? (
            /* Success state */
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-accent-lime/10 flex items-center justify-center mx-auto mb-6">
                <FiCheck className="text-accent-lime" size={36} />
              </div>
              <h1 className="font-display text-2xl font-bold text-white mb-2">
                Application Submitted!
              </h1>
              <p className="text-gray-400 mb-6">
                Your application for <span className="text-white font-medium">{job.title}</span> at{" "}
                <span className="text-accent-lime">{job.company}</span> has been sent.
              </p>

              {result?.emailSent && (
                <div className="flex items-center gap-2 justify-center text-sm text-accent-lime bg-accent-lime/10 rounded-lg px-4 py-2 mb-6">
                  <FiMail size={14} />
                  Email sent to HR
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate("/swipe")}
                  className="btn-secondary"
                >
                  Find More Jobs
                </button>
                <button
                  onClick={() => navigate("/applications")}
                  className="btn-primary"
                >
                  View Applications
                </button>
              </div>
            </motion.div>
          ) : (
            /* Review state */
            <>
              <h1 className="font-display text-2xl font-bold text-white mb-2">
                Review & Submit
              </h1>
              <p className="text-gray-400 text-sm mb-6">
                Review your application before submitting.
              </p>

              {/* Job info */}
              <div className="glass-card rounded-xl p-4 mb-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-lime/20 to-accent-cyan/20 flex items-center justify-center text-accent-lime font-display font-bold text-lg border border-accent-lime/20">
                  {job.company?.[0]}
                </div>
                <div>
                  <h2 className="font-display font-bold text-white">{job.title}</h2>
                  <p className="text-sm text-gray-400">{job.company} &middot; {job.location}</p>
                </div>
              </div>

              {/* Applicant info */}
              <div className="glass-card rounded-xl p-4 mb-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Applicant</div>
                <p className="text-white font-medium">{user?.displayName || "—"}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>

              {/* Attachments */}
              <div className="glass-card rounded-xl p-4 mb-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Attachments</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <FiFileText className="text-accent-lime" size={18} />
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        {tailoredResume ? "Tailored Resume" : "Original Resume"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {tailoredResume ? "AI-optimized for this role" : "Your uploaded resume"}
                      </p>
                    </div>
                    <FiCheck className="text-accent-lime" size={14} />
                  </div>
                  {coverLetter && (
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <FiMail className="text-accent-lime" size={18} />
                      <div className="flex-1">
                        <p className="text-sm text-white">Cover Letter</p>
                        <p className="text-xs text-gray-400">AI-generated cover letter</p>
                      </div>
                      <FiCheck className="text-accent-lime" size={14} />
                    </div>
                  )}
                </div>
              </div>

              {/* Cover letter preview */}
              {coverLetter && (
                <div className="glass-card rounded-xl p-4 mb-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                    Cover Letter Preview
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {coverLetter}
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-4 py-3 mb-4">
                  <FiAlertCircle size={16} />
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => navigate(-1)}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="spinner !w-4 !h-4 !border-2 !border-ink/20 !border-t-ink" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
