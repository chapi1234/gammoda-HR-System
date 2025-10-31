import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, Calendar, ArrowLeft, Send } from "lucide-react";
import SEO from "../components/SEO";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { apiClient } from "../utils/api";
import { apiEndpoints } from "../config/apiConfig";
import { Job } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { siteConfig } from "../config/siteConfig";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJob(id);
    }
  }, [id]);

  const fetchJob = async (jobId: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.jobById(jobId));
      // response may be the job object or { data: job }
      const jobObj = response && (response as any).data ? (response as any).data : response;

      // Normalize backend job document to the frontend Job shape
      const mapped = {
        id: jobObj._id || jobObj.id,
        title: jobObj.title || "",
        department: jobObj.department ? (typeof jobObj.department === "object" ? (jobObj.department.name || "") : jobObj.department) : "",
        location: jobObj.location || "",
        jobType: jobObj.jobType || jobObj.type || "",
        salaryRange: jobObj.salaryRange
          ? (typeof jobObj.salaryRange === "string"
              ? jobObj.salaryRange
              : `${jobObj.salaryRange.min || ""}${jobObj.salaryRange.max ? " - " + jobObj.salaryRange.max : ""}`)
          : jobObj.salary || "",
        status: jobObj.status || "active",
        postedDate: jobObj.postedDate || jobObj.createdAt || new Date().toISOString(),
        closingDate: jobObj.closingDate,
        description: jobObj.description || "",
        requirements: Array.isArray(jobObj.requirements) ? jobObj.requirements.join(', ') : (jobObj.requirements || ""),
        applicationsCount: Array.isArray(jobObj.applications) ? jobObj.applications.length : (jobObj.applicationsCount || 0),
      } as Job;

      setJob(mapped);
    } catch (error) {
      console.error("Failed to fetch job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/careers/${id}/apply`);
    } else {
      navigate(`/careers/${id}/apply`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-gray-900">Job Not Found</h1>
        <Link to="/careers">
          <Button>Back to Careers</Button>
        </Link>
      </div>
    );
  }

  const postedDate = new Date(job.postedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const closingDate = job.closingDate
    ? new Date(job.closingDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <SEO title={job.title} description={job.description} />

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Back Button */}
          <Link to="/careers" className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            Back to Careers
          </Link>

          {/* Job Header */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="mb-2 text-gray-900">{job.title}</h1>
                  <div className="flex flex-wrap gap-3 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.jobType}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={job.status === "active" ? "default" : "secondary"}>
                    {job.status}
                  </Badge>
              </div>

              <div className="mb-6 flex flex-wrap gap-4 border-t border-gray-200 pt-4 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Posted: {postedDate}</span>
                </div>
                {closingDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Closes: {closingDate}</span>
                  </div>
                )}
                {job.salaryRange && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salaryRange}</span>
                  </div>
                )}
              </div>

              {job.status === "active" && (
                <Button onClick={handleApply} size="lg" className="w-full gap-2 sm:w-auto">
                  Apply Now <Send className="h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <h2 className="mb-4 text-gray-900">About the Position</h2>
              <div className="prose max-w-none text-gray-600">
                <p>{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <h2 className="mb-4 text-gray-900">Requirements</h2>
              <div className="prose max-w-none text-gray-600">
                <p>{job.requirements}</p>
              </div>
            </CardContent>
          </Card>

          {/* About Company */}
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-4 text-gray-900">About {siteConfig.companyShortName}</h2>
              <p className="mb-4 text-gray-600">{siteConfig.description}</p>
              <Link to={siteConfig.links.about} className="text-blue-600 hover:underline">
                Learn more about us →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
