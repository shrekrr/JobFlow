import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { getRecommendedJobs, getPreferences, getResume, saveFeedback } from "../services/api";
import ProgressStepper from "../components/ProgressStepper";
import {
  FiMapPin, FiBriefcase, FiClock, FiDollarSign,
  FiX, FiHeart, FiChevronDown, FiChevronUp, FiLoader
} from "react-icons/fi";

function JobCard({ job, onSwipe, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const [expanded, setExpanded] = useState(false);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 120) {
      animate(x, 500, { duration: 0.3 });
      setTimeout(() => onSwipe("right"), 300);
    } else if (info.offset.x < -120) {
      animate(x, -500, { duration: 0.3 });
      setTimeout(() => onSwipe("left"), 300);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300 });
    }
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 glass-card rounded-2xl p-6 scale-[0.95] opacity-60" />
    );
  }

  return (
    <motion.div
      className="absolute inset-0 swipe-card"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
    >
      {/* Like/Nope labels */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-6 right-6 z-10 bg-accent-lime text-ink font-display font-bold text-xl px-4 py-1 rounded-lg border-2 border-accent-lime rotate-12"
      >
        LIKE
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-6 left-6 z-10 bg-accent-coral text-white font-display font-bold text-xl px-4 py-1 rounded-lg border-2 border-accent-coral -rotate-12"
      >
        NOPE
      </motion.div>

      <div className="glass-card rounded-2xl p-6 h-full flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-lime/20 to-accent-cyan/20 flex items-center justify-center text-accent-lime font-display font-bold text-lg border border-accent-lime/20">
              {job.company?.[0]}
            </div>
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md">
              {job.postedDate}
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-white mb-1">
            {job.title}
          </h2>
          <p className="text-accent-lime text-sm font-medium">{job.company}</p>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FiMapPin size={14} />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FiBriefcase size={14} />
            <span>{job.jobType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FiClock size={14} />
            <span>{job.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FiDollarSign size={14} />
            <span>{job.salaryRange}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skillsRequired?.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-accent-lime/10 text-accent-lime text-xs rounded-md border border-accent-lime/20"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Description toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-2"
        >
          {expanded ? "Hide" : "Show"} Description
          {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>

        {expanded && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-gray-300 text-sm leading-relaxed flex-1"
          >
            {job.jobDescription}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default function SwipePage() {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedJobs, setLikedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const prefsRes = await getPreferences().catch(() => ({ data: {} }));
        const resumeRes = await getResume().catch(() => ({ data: null }));

        const res = await getRecommendedJobs(
          prefsRes.data || {},
          resumeRes.data?.extractedText || ""
        );
        setJobs(res.data || []);
      } catch {
        // Fallback: get all jobs
        try {
          const { getJobs } = require("../services/api");
          const res = await getJobs();
          setJobs(res.data || []);
        } catch {}
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSwipe = async (direction) => {
    const job = jobs[currentIndex];
    if (!job) return;

    const liked = direction === "right";
    try {
      await saveFeedback(job.id, liked);
    } catch {}

    if (liked) {
      setLikedJobs((prev) => [...prev, job]);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleButtonSwipe = (direction) => {
    handleSwipe(direction);
  };

  const currentJob = jobs[currentIndex];
  const nextJob = jobs[currentIndex + 1];
  const isFinished = currentIndex >= jobs.length && jobs.length > 0;

  return (
    <div className="min-h-screen bg-ink grid-bg noise-bg">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <ProgressStepper currentStep={2} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-2xl font-bold text-white">
              Discover Jobs
            </h1>
            {jobs.length > 0 && (
              <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                {currentIndex + 1} / {jobs.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FiLoader className="text-accent-lime animate-spin mb-4" size={32} />
              <p className="text-gray-400">Finding jobs for you...</p>
            </div>
          ) : isFinished ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-accent-lime/10 flex items-center justify-center mx-auto mb-4">
                <FiHeart className="text-accent-lime" size={28} />
              </div>
              <h2 className="font-display text-xl font-bold text-white mb-2">
                All Caught Up!
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                You've seen all {jobs.length} jobs.
                {likedJobs.length > 0 && ` You liked ${likedJobs.length}!`}
              </p>
              {likedJobs.length > 0 && (
                <div className="space-y-2 mb-6">
                  {likedJobs.map((j) => (
                    <button
                      key={j.id}
                      onClick={() =>
                        navigate("/tailor", { state: { job: j } })
                      }
                      className="w-full glass-card rounded-xl p-3 flex items-center justify-between hover:border-accent-lime/30 transition-colors"
                    >
                      <div className="text-left">
                        <p className="text-white text-sm font-medium">
                          {j.title}
                        </p>
                        <p className="text-gray-400 text-xs">{j.company}</p>
                      </div>
                      <span className="text-accent-lime text-xs">
                        Tailor Resume →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-gray-400">No jobs found. Try adjusting your preferences.</p>
            </div>
          ) : (
            <>
              {/* Card stack */}
              <div className="relative h-[460px] sm:h-[500px] mb-6">
                {nextJob && <JobCard job={nextJob} onSwipe={() => {}} isTop={false} />}
                {currentJob && (
                  <JobCard
                    key={currentJob.id}
                    job={currentJob}
                    onSwipe={handleSwipe}
                    isTop={true}
                  />
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => handleButtonSwipe("left")}
                  className="w-14 h-14 rounded-full bg-accent-coral/10 border border-accent-coral/30 flex items-center justify-center text-accent-coral hover:bg-accent-coral/20 transition-colors active:scale-95"
                >
                  <FiX size={24} />
                </button>
                <button
                  onClick={() => handleButtonSwipe("right")}
                  className="w-16 h-16 rounded-full bg-accent-lime/10 border-2 border-accent-lime/30 flex items-center justify-center text-accent-lime hover:bg-accent-lime/20 transition-colors active:scale-95 glow-lime"
                >
                  <FiHeart size={26} />
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
