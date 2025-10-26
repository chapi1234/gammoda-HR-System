export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: string;
  salaryRange?: string;
  status: "open" | "closed" | "draft";
  postedDate: string;
  closingDate?: string;
  description: string;
  requirements: string;
  postedBy?: string;
  applicationsCount?: number;
}

export interface JobsResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resume?: {
    filename: string;
    url: string;
  };
  applications?: Application[];
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  job?: Job;
  status: ApplicationStatus;
  appliedDate: string;
  coverLetter?: string;
  statusHistory: StatusHistoryItem[];
}

export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export interface StatusHistoryItem {
  status: ApplicationStatus;
  timestamp: string;
  note?: string;
}

export interface AuthResponse {
  token: string;
  user: Candidate;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  year: string;
}
