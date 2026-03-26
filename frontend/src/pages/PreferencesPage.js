import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { savePreferences, getPreferences } from "../services/api";
import ProgressStepper from "../components/ProgressStepper";
import { FiArrowRight, FiCheck } from "react-icons/fi";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
const LOCATIONS = [
  "Remote",
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Austin, TX",
  "Chicago, IL",
  "Boston, MA",
  "Denver, CO",
  "Los Angeles, CA",
  "Portland, OR",
  "Washington, DC",
  "Atlanta, GA",
  "Palo Alto, CA",
  "San Jose, CA",
];
const SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "TypeScript",
  "SQL", "AWS", "Docker", "Kubernetes", "Machine Learning",
  "TensorFlow", "PyTorch", "Git", "CI/CD", "Agile",
  "Data Analysis", "Product Management", "Cybersecurity",
];
const EXPERIENCE_LEVELS = ["Entry Level", "1-3 years", "3-5 years", "5+ years", "Any"];

export default function PreferencesPage() {
  const [jobTypes, setJobTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("Any");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await getPreferences();
        if (res.data) {
          setJobTypes(res.data.jobTypes || []);
          setLocations(res.data.locations || []);
          setSkills(res.data.skills || []);
          setExperienceLevel(res.data.experienceLevel || "Any");
        }
      } catch {
        // No prefs yet
      }
    }
    load();
  }, []);

  const toggle = (arr, setArr, val) => {
    setArr((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePreferences({ jobTypes, locations, skills, experienceLevel });
      setSaved(true);
    } catch {
      // fail silently
    } finally {
      setSaving(false);
    }
  };

  const Chip = ({ label, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        selected
          ? "bg-accent-lime text-ink"
          : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-ink grid-bg noise-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <ProgressStepper currentStep={1} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Job Preferences
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Help us find the right jobs for you.
          </p>

          {/* Job Types */}
          <div className="mb-8">
            <h3 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Job Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={jobTypes.includes(t)}
                  onClick={() => toggle(jobTypes, setJobTypes, t)}
                />
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="mb-8">
            <h3 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Preferred Locations
            </h3>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((l) => (
                <Chip
                  key={l}
                  label={l}
                  selected={locations.includes(l)}
                  onClick={() => toggle(locations, setLocations, l)}
                />
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h3 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Key Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={skills.includes(s)}
                  onClick={() => toggle(skills, setSkills, s)}
                />
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h3 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Experience Level
            </h3>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map((e) => (
                <Chip
                  key={e}
                  label={e}
                  selected={experienceLevel === e}
                  onClick={() => {
                    setExperienceLevel(e);
                    setSaved(false);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-secondary flex items-center gap-2"
            >
              {saving ? (
                <div className="spinner !w-4 !h-4 !border-2" />
              ) : saved ? (
                <>
                  <FiCheck size={16} />
                  Saved
                </>
              ) : (
                "Save Preferences"
              )}
            </button>
            <button
              onClick={() => {
                handleSave().then(() => navigate("/swipe"));
              }}
              className="btn-primary flex items-center gap-2"
            >
              Discover Jobs
              <FiArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
