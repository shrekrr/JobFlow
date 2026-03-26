import axios from "axios";
import { auth } from "./firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// Attach auth token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Jobs
export const getJobs = () => api.get("/jobs");
export const getJob = (id) => api.get(`/jobs/${id}`);
export const getRecommendedJobs = (preferences, resumeText) =>
  api.post("/jobs/recommend", { preferences, resumeText });

// Resume
export const uploadResume = (formData) =>
  api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getResume = () => api.get("/resume");

// AI
export const tailorResume = (resumeText, jobDescription, jobTitle) =>
  api.post("/ai/tailor", { resumeText, jobDescription, jobTitle });
export const generateCoverLetter = (resumeText, jobDescription, jobTitle, company) =>
  api.post("/ai/cover-letter", { resumeText, jobDescription, jobTitle, company });
export const getMatchScore = (resumeText, jobDescription) =>
  api.post("/ai/match", { resumeText, jobDescription });

// Feedback
export const saveFeedback = (jobId, liked) =>
  api.post("/feedback/swipe", { jobId, liked });
export const saveApplied = (jobId) =>
  api.post("/feedback/applied", { jobId });
export const getFeedback = () => api.get("/feedback");

// Application
export const submitApplication = (data) =>
  api.post("/application/submit", data);
export const getApplications = () => api.get("/application");

// User
export const savePreferences = (prefs) =>
  api.post("/user/preferences", prefs);
export const getPreferences = () => api.get("/user/preferences");
export const saveProfile = (profile) =>
  api.post("/user/profile", profile);

export default api;
