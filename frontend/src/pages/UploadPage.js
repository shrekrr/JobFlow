import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { uploadResume, getResume } from "../services/api";
import ProgressStepper from "../components/ProgressStepper";
import { FiUploadCloud, FiFile, FiCheck, FiX, FiArrowRight } from "react-icons/fi";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [existingResume, setExistingResume] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkResume() {
      try {
        const res = await getResume();
        if (res.data) {
          setExistingResume(res.data);
          setUploaded(true);
        }
      } catch {
        // No resume yet
      }
    }
    checkResume();
  }, []);

  const handleFile = (f) => {
    if (!f) return;
    const valid = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!valid.includes(f.type)) {
      setError("Please upload a PDF or DOC/DOCX file");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await uploadResume(formData);
      setExistingResume(res.data);
      setUploaded(true);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink grid-bg noise-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <ProgressStepper currentStep={0} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Upload Your Resume
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Upload your current resume so our AI can tailor it for each job you apply to.
          </p>

          {/* Existing resume */}
          {existingResume && (
            <div className="glass-card rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-lime/10 flex items-center justify-center">
                <FiCheck className="text-accent-lime" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">
                  {existingResume.fileName}
                </p>
                <p className="text-xs text-gray-400">
                  Uploaded {new Date(existingResume.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Upload zone */}
          <div
            className={`glass-card rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${
              dragOver
                ? "border-accent-lime bg-accent-lime/5"
                : "border-white/10 hover:border-white/20"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            <div className="flex flex-col items-center py-12 px-6">
              <div className="w-16 h-16 rounded-2xl bg-accent-lime/10 flex items-center justify-center mb-4">
                <FiUploadCloud className="text-accent-lime" size={28} />
              </div>
              <p className="text-white font-medium mb-1">
                {file ? file.name : "Drop your resume here"}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                  : "PDF or DOC/DOCX, up to 10MB"}
              </p>
              {file && !uploaded && (
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpload();
                    }}
                    disabled={uploading}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    {uploading ? (
                      <>
                        <div className="spinner !w-4 !h-4 !border-2 !border-ink/20 !border-t-ink" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUploadCloud size={16} />
                        Upload
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="btn-secondary text-sm flex items-center gap-1"
                  >
                    <FiX size={14} />
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent-coral text-sm mt-3"
            >
              {error}
            </motion.p>
          )}

          {/* Continue */}
          {uploaded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-end"
            >
              <button
                onClick={() => navigate("/preferences")}
                className="btn-primary flex items-center gap-2"
              >
                Continue to Preferences
                <FiArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
