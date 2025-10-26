export const apiConfig = {
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || "http://localhost:3000/api",
  useMockMode: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK_MODE === "true") || true, // Toggle for mock data
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const apiEndpoints = {
  // Jobs
  jobs: "/jobs",
  jobById: (id: string) => `/jobs/${id}`,
  
  // Candidates
  register: "/candidates/register",
  login: "/candidates/login",
  candidateMe: "/candidates/me",
  apply: "/candidates/apply",
  updateProfile: "/candidates/profile",
  
  // Applications
  applications: "/applications",
  applicationById: (id: string) => `/applications/${id}`,
  updateApplicationStatus: (id: string) => `/candidates/applications/${id}/status`,
};
