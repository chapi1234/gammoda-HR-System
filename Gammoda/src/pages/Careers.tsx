import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import SEO from "../components/SEO";
import JobCard from "../components/JobCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { apiClient } from "../utils/api";
import { apiEndpoints } from "../config/apiConfig";
import { JobsResponse } from "../types";

export default function Careers() {
  const [jobs, setJobs] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const departments = ["Programs", "Operations", "Finance", "Human Resources", "IT"];
  const locations = ["Remote", "Headquarters", "Community City", "Field Office"];

  useEffect(() => {
    fetchJobs();
  }, [search, department, location, currentPage]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "9",
      });
      
      if (search) params.append("search", search);
      if (department) params.append("department", department);
      if (location) params.append("location", location);
      params.append("status", "open");

      const response = await apiClient.get<JobsResponse>(
        `${apiEndpoints.jobs}?${params.toString()}`
      );
      setJobs(response);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const totalPages = jobs ? Math.ceil(jobs.total / jobs.limit) : 0;

  return (
    <>
      <SEO
        title="Careers"
        description="Join our team and make a difference. Explore current job openings at Gammo Development Association."
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h1 className="mb-6 text-gray-900">Join Our Team</h1>
          <p className="text-gray-600 text-lg">
            Make a meaningful impact by joining our team of dedicated professionals working to
            transform communities and create lasting change.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <form onSubmit={handleSearchSubmit} className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={department || "all"} onValueChange={(val) => setDepartment(val === "all" ? "" : val)}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={location || "all"} onValueChange={(val) => setLocation(val === "all" ? "" : val)}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-lg bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : jobs && jobs.data.length > 0 ? (
            <>
              <div className="mb-6 text-gray-600">
                Showing {jobs.data.length} of {jobs.total} jobs
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.data.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600">No jobs found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setDepartment("");
                  setLocation("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
