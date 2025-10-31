import { AxiosRequestConfig } from "axios";

// Mock data storage
const mockData: any = {
  jobs: [
    {
      id: "1",
      title: "Program Manager",
      department: "Programs",
      location: "Remote",
      jobType: "Full-time",
      salaryRange: "$60,000 - $80,000",
  status: "active",
      postedDate: "2025-10-15T00:00:00Z",
      closingDate: "2025-11-30T23:59:59Z",
      description: "Lead and manage development programs focused on community empowerment and sustainable growth.",
      requirements: "5+ years in program management, strong leadership skills, experience in development sector.",
      applicationsCount: 12,
    },
    {
      id: "2",
      title: "Field Officer",
      department: "Operations",
      location: "Community City",
      jobType: "Full-time",
      salaryRange: "$40,000 - $55,000",
  status: "active",
      postedDate: "2025-10-18T00:00:00Z",
      closingDate: "2025-12-15T23:59:59Z",
      description: "Work directly with communities to implement development projects and monitor progress.",
      requirements: "Bachelor's degree in social sciences, 2+ years field experience, valid driver's license.",
      applicationsCount: 8,
    },
    {
      id: "3",
      title: "Finance Officer",
      department: "Finance",
      location: "Headquarters",
      jobType: "Full-time",
      salaryRange: "$50,000 - $65,000",
  status: "active",
      postedDate: "2025-10-20T00:00:00Z",
      closingDate: "2025-11-25T23:59:59Z",
      description: "Manage financial operations, budgeting, and reporting for development projects.",
      requirements: "CPA or equivalent, 3+ years in non-profit finance, proficiency in accounting software.",
      applicationsCount: 5,
    },
  ],
  candidates: [
    {
      id: "c1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 987-6543",
      resume: {
        filename: "john_doe_resume.pdf",
        url: "/uploads/john_doe_resume.pdf",
      },
      applications: [],
    },
  ],
  applications: [],
};

// Mock API implementation
export const mockApi = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    await delay(300); // Simulate network delay

    // Parse URL and query params
    const [path, queryString] = url.split("?");
    const params = new URLSearchParams(queryString);

    // Jobs list
    if (path === "/jobs") {
      const search = params.get("search")?.toLowerCase() || "";
      const department = params.get("department") || "";
      const location = params.get("location") || "";
      const status = params.get("status") || "open";
      const page = parseInt(params.get("page") || "1");
      const limit = parseInt(params.get("limit") || "10");

  let filtered = mockData.jobs.filter((job: any) => {
        const matchesSearch =
          !search ||
          job.title.toLowerCase().includes(search) ||
          job.description.toLowerCase().includes(search);
        const matchesDepartment = !department || job.department === department;
        const matchesLocation = !location || job.location === location;
        const matchesStatus = !status || job.status === status;
        return matchesSearch && matchesDepartment && matchesLocation && matchesStatus;
      });

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = filtered.slice(start, end);

      return {
        data: paginated,
        total: filtered.length,
        page,
        limit,
      } as T;
    }

    // Job by ID
    if (path.startsWith("/jobs/")) {
      const id = path.split("/")[2];
  const job = mockData.jobs.find((j: any) => j.id === id);
      if (!job) throw new Error("Job not found");
      return job as T;
    }

    // Candidate profile
    if (path === "/candidates/me") {
  const candidate = mockData.candidates[0]; // In mock mode, return first candidate
      return {
        ...candidate,
        applications: mockData.applications.filter(
          (app: any) => app.candidateId === candidate.id
        ),
      } as T;
    }

    throw new Error(`Mock API: Unhandled GET ${url}`);
  },

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    await delay(500);

    // Register
    if (url === "/candidates/register") {
      const newCandidate = {
        id: `c${mockData.candidates.length + 1}`,
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        resume: null,
        applications: [],
      };
      mockData.candidates.push(newCandidate);
      return {
        token: "mock-jwt-token-" + Date.now(),
        user: newCandidate,
      } as T;
    }

    // Login
    if (url === "/candidates/login") {
  const candidate = mockData.candidates.find((c: any) => c.email === data.email);
      if (!candidate) throw new Error("Invalid credentials");
      return {
        token: "mock-jwt-token-" + Date.now(),
        user: candidate,
      } as T;
    }

    // Apply for job
    if (url === "/candidates/apply") {
      const newApplication = {
        id: `app${mockData.applications.length + 1}`,
        candidateId: "c1", // Mock candidate ID
        jobId: data.get ? data.get("jobId") : data.jobId,
        status: "applied",
        appliedDate: new Date().toISOString(),
        coverLetter: data.get ? data.get("coverLetter") : data.coverLetter,
        statusHistory: [
          {
            status: "applied",
            timestamp: new Date().toISOString(),
            note: "Application submitted",
          },
        ],
      };
      mockData.applications.push(newApplication as any);
      return {
        applicationId: newApplication.id,
        status: newApplication.status,
      } as T;
    }

    throw new Error(`Mock API: Unhandled POST ${url}`);
  },

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    await delay(300);

    // Update profile
    if (url === "/candidates/profile") {
      const candidate = mockData.candidates[0];
      Object.assign(candidate, data);
      return candidate as T;
    }

    throw new Error(`Mock API: Unhandled PATCH ${url}`);
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    await delay(300);
    throw new Error(`Mock API: Unhandled DELETE ${url}`);
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
