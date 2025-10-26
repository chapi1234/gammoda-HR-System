import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import SEO from "../components/SEO";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { apiClient } from "../utils/api";
import { apiEndpoints } from "../config/apiConfig";
import { Job } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";

export default function JobApply() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (id) {
      fetchJob(id);
    }
  }, [id]);

  const fetchJob = async (jobId: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get<Job>(apiEndpoints.jobById(jobId));
      setJob(response);
    } catch (error) {
      console.error("Failed to fetch job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      // Validate file type
      if (!file.type.includes("pdf") && !file.type.includes("doc")) {
        toast.error("Only PDF and DOC files are allowed");
        return;
      }
      setResume(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume && !user?.resume) {
      toast.error("Please upload your resume");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("jobId", id!);
      if (resume) {
        formData.append("resume", resume);
      }
      formData.append("coverLetter", coverLetter);

      await apiClient.post(apiEndpoints.apply, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to submit application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
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

  return (
    <>
      <SEO title={`Apply for ${job.title}`} />

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link
            to={`/careers/${id}`}
            className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job
          </Link>

          <Card className="mb-6">
            <CardContent className="p-8">
              <h1 className="mb-2 text-gray-900">Apply for {job.title}</h1>
              <p className="text-gray-600">
                {job.department} • {job.location}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Candidate Info */}
                <div className="space-y-4">
                  <h2 className="text-gray-900">Your Information</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Full Name</Label>
                      <Input value={user?.name || ""} disabled />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={user?.email || ""} disabled />
                    </div>
                  </div>
                  {user?.phone && (
                    <div>
                      <Label>Phone</Label>
                      <Input value={user.phone} disabled />
                    </div>
                  )}
                </div>

                {/* Resume Upload */}
                <div>
                  <Label htmlFor="resume">Resume/CV</Label>
                  {user?.resume ? (
                    <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-gray-900 text-sm">Current Resume</p>
                          <p className="text-gray-500 text-xs">{user.resume.filename}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600 text-sm">
                        Upload a new resume to replace your current one (optional)
                      </p>
                    </div>
                  ) : (
                    <p className="mb-2 text-gray-600 text-sm">
                      Upload your resume (PDF or DOC, max 5MB)
                    </p>
                  )}
                  <div className="mt-2">
                    <label
                      htmlFor="resume"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-8 transition-colors hover:border-blue-400 hover:bg-blue-50"
                    >
                      <Upload className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">
                        {resume ? resume.name : "Choose file or drag here"}
                      </span>
                      <input
                        id="resume"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you're a great fit for this position..."
                    rows={8}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Application"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/careers/${id}`)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
