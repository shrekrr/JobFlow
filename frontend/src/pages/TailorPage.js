import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { tailorResume, generateCoverLetter, getResume } from "../services/api";
import ProgressStepper from "../components/ProgressStepper";
import { FiCpu, FiEdit3, FiArrowRight, FiFileText, FiRefreshCw } from "react-icons/fi";

function renderHighlighted(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className="ai-highlight">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function TailorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;

  const [resumeText, setResumeText] = useState("");
  const [tailoredText, setTailoredText] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loadingTailor, setLoadingTailor] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("resume");

  useEffect(() => {
    if (!job) {
      navigate("/swipe");
      return;
    }
    async function loadResume() {
      try {
        const res = await getResume();
        if (res.data?.extractedText) {
          setResumeText(res.data.extractedText);
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
      }
    }
    loadResume();
  }, [job, navigate]);

  const handleTailor = async () => {
    if (!resumeText) return;
    setLoadingTailor(true);
    try {
      const res = await tailorResume(resumeText, job.jobDescription, job.title);
      setTailoredText(res.data.tailoredResume);
    } catch (err) {
      console.error("Tailor failed:", err);
    } finally {
      setLoadingTailor(false);
    }
  };

  const handleCoverLetter = async () => {
    if (!resumeText) return;
    setLoadingCover(true);
    try {
      const res = await generateCoverLetter(
        resumeText,
        job.jobDescription,
        job.title,
        job.company
      );
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      console.error("Cover letter failed:", err);
    } finally {
      setLoadingCover(false);
    }
  };

  if (!job) return null;

  return (
    <div className="min-h-screen bg-ink grid-bg noise-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <ProgressStepper currentStep={3} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          {/* Job header */}
          <div className="glass-card rounded-xl p-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-lime/20 to-accent-cyan/20 flex items-center justify-center text-accent-lime font-display font-bold text-lg border border-accent-lime/20">
              {job.company?.[0]}
            </div>
            <div>
              <h2 className="font-display font-bold text-white">{job.title}</h2>
              <p className="text-sm text-gray-400">{job.company} &middot; {job.location}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleTailor}
              disabled={loadingTailor || !resumeText}
              className="btn-primary flex items-center gap-2 text-sm flex-1 justify-center disabled:opacity-50"
            >
              {loadingTailor ? (
                <>
                  <div className="spinner !w-4 !h-4 !border-2 !border-ink/20 !border-t-ink" />
                  Tailoring...
                </>
              ) : (
                <>
                  <FiCpu size={16} />
                  AI Tailor Resume
                </>
              )}
            </button>
            <button
              onClick={handleCoverLetter}
              disabled={loadingCover || !resumeText}
              className="btn-secondary flex items-center gap-2 text-sm flex-1 justify-center disabled:opacity-50"
            >
              {loadingCover ? (
                <>
                  <div className="spinner !w-4 !h-4 !border-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FiFileText size={16} />
                  Generate Cover Letter
                </>
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-4">
            <button
              onClick={() => setActiveTab("resume")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "resume"
                  ? "border-accent-lime text-accent-lime"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Tailored Resume
            </button>
            <button
              onClick={() => setActiveTab("cover")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "cover"
                  ? "border-accent-lime text-accent-lime"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Cover Letter
            </button>
            <button
              onClick={() => setActiveTab("original")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "original"
                  ? "border-accent-lime text-accent-lime"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Original Resume
            </button>
          </div>

          {/* Content */}
          <div className="glass-card rounded-xl p-6 min-h-[400px]">
            {activeTab === "resume" && (
              <>
                {!tailoredText ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FiCpu className="text-gray-500 mb-3" size={32} />
                    <p className="text-gray-400 mb-1">No tailored resume yet</p>
                    <p className="text-gray-500 text-sm">
                      Click "AI Tailor Resume" to get started
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent-lime animate-pulse" />
                        <span className="text-xs text-gray-400">
                          Highlighted sections indicate AI changes
                        </span>
                      </div>
                      <button
                        onClick={() => setEditing(!editing)}
                        className="flex items-center gap-1 text-xs text-accent-lime hover:underline"
                      >
                        <FiEdit3 size={12} />
                        {editing ? "Preview" : "Edit"}
                      </button>
                    </div>

                    {editing ? (
                      <textarea
                        value={tailoredText}
                        onChange={(e) => setTailoredText(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-gray-200 text-sm leading-relaxed min-h-[350px] font-mono resize-y"
                      />
                    ) : (
                      <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                        {renderHighlighted(tailoredText)}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === "cover" && (
              <>
                {!coverLetter ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FiFileText className="text-gray-500 mb-3" size={32} />
                    <p className="text-gray-400 mb-1">No cover letter yet</p>
                    <p className="text-gray-500 text-sm">
                      Click "Generate Cover Letter" to create one
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-end mb-4">
                      <button
                        onClick={() => setEditing(!editing)}
                        className="flex items-center gap-1 text-xs text-accent-lime hover:underline"
                      >
                        <FiEdit3 size={12} />
                        {editing ? "Preview" : "Edit"}
                      </button>
                    </div>

                    {editing ? (
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-gray-200 text-sm leading-relaxed min-h-[350px] font-mono resize-y"
                      />
                    ) : (
                      <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                        {coverLetter}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === "original" && (
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {resumeText || (
                  <p className="text-gray-500 text-center py-16">
                    No resume uploaded yet. Go to Upload page first.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Continue */}
          {(tailoredText || coverLetter) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-end"
            >
              <button
                onClick={() =>
                  navigate("/submit", {
                    state: {
                      job,
                      tailoredResume: tailoredText,
                      coverLetter,
                    },
                  })
                }
                className="btn-primary flex items-center gap-2"
              >
                Review & Submit
                <FiArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
