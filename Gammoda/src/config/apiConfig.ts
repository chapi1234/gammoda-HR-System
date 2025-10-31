const env = typeof import.meta !== 'undefined' ? (import.meta as any).env : ({} as any);

const defaultApiUrl = env?.VITE_API_BASE_URL || (env?.VITE_API_URL ? `${String(env.VITE_API_URL).replace(/\/$/, '')}/api` : "http://localhost:5000/api");

export const apiConfig = {
  baseURL: defaultApiUrl,
  // Toggle for mock data: set VITE_USE_MOCK_MODE=true to enable mock mode. Defaults to false.
  useMockMode: env?.VITE_USE_MOCK_MODE === "true",
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
