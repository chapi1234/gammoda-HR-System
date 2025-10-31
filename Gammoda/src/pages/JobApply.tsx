import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
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
import { toast } from "sonner";

export default function JobApply() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applicantName, setApplicantName] = useState(user?.name || "");
  const [applicantEmail, setApplicantEmail] = useState(user?.email || "");
  const [applicantPhone, setApplicantPhone] = useState(user?.phone || "");
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // replace file upload with resume link string to avoid file upload issues
  const [resumeLink, setResumeLink] = useState<string>("");
  const [useUpload, setUseUpload] = useState<boolean>(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [experience, setExperience] = useState<string>("");
  const [skillsRaw, setSkillsRaw] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchJob(id);
    }
  }, [id]);

  const fetchJob = async (jobId: string) => {
    setLoading(true);
    try {
      const response: any = await apiClient.get(apiEndpoints.jobById(jobId));
      // unwrap possible shapes: { status, data: job } or { data: job } or job
      let payload = response;
      if (payload && payload.data !== undefined) payload = payload.data;
      if (payload && payload.data !== undefined) payload = payload.data;

      // Defensive mapping: ensure job has the minimal expected fields so rendering won't crash
      const mapped = {
        id: payload?._id || payload?.id || jobId,
        title: payload?.title || "",
        department: payload?.department
          ? (typeof payload.department === "object" ? (payload.department.name || "") : payload.department)
          : "",
        location: payload?.location || "",
        jobType: payload?.jobType || payload?.type || "",
        salaryRange: payload?.salaryRange
          ? (typeof payload.salaryRange === "string"
              ? payload.salaryRange
              : `${payload.salaryRange?.min || ""}${payload.salaryRange?.max ? " - " + payload.salaryRange.max : ""}`)
          : (payload?.salary || ""),
        status: payload?.status || "active",
        postedDate: payload?.postedDate || payload?.createdAt || new Date().toISOString(),
        closingDate: payload?.closingDate || null,
        description: payload?.description || "",
        requirements: Array.isArray(payload?.requirements) ? payload.requirements.join(', ') : (payload?.requirements || ""),
        applicationsCount: Array.isArray(payload?.applications) ? payload.applications.length : (payload?.applicationsCount || 0),
      } as unknown as Job;

      setJob(mapped);
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
      if (!file.type.includes("pdf") && !file.type.includes("doc") && !file.type.includes("msword")) {
        toast.error("Only PDF and DOC files are allowed");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if not logged in, require name & email
    if (!user && (!applicantName || !applicantEmail)) {
      toast.error("Please provide your name and email");
      return;
    }

    // require a resume link, a file upload, or an existing uploaded resume on the candidate profile
    if (!resumeLink && !resumeFile && !user?.resume) {
      toast.error("Please provide a resume link, upload a resume file, or upload one to your profile");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("jobId", id!);
      // include resume link (if provided) so backend can save or reference it
      if (resumeLink) {
        formData.append("resumeLink", resumeLink);
      }
      // include uploaded resume file when using upload option
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }
      // include experience and skills
      if (experience) formData.append("experience", String(experience));
      if (skillsRaw) formData.append("skills", skillsRaw);
      formData.append("coverLetter", coverLetter);
      // include applicant contact info (either logged-in user or anonymous inputs)
      formData.append("name", user?.name || applicantName || "");
      formData.append("email", user?.email || applicantEmail || "");
      formData.append("phone", user?.phone || applicantPhone || "");

      // Do not set Content-Type header; allow browser/axios to set multipart boundary
      await apiClient.post(apiEndpoints.apply, formData);

      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to submit application:", err);
      let msg = "Failed to submit application. Please try again.";
      try {
        if (err && (err as any).response && (err as any).response.data && (err as any).response.data.message) {
          msg = (err as any).response.data.message;
        } else if (err && (err as any).message) {
          msg = (err as any).message;
        }
      } catch (e) {
        // ignore parsing errors
      }
      toast.error(msg);
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
      <div className="flex min-h-screen flex-col item`s-center justify-center">
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
                    {user ? (
                      <>
                        <div>
                          <Label>Full Name</Label>
                          <Input value={user?.name || ""} disabled />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input value={user?.email || ""} disabled />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <Label htmlFor="applicantName">Full Name</Label>
                          <Input id="applicantName" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} required />
                        </div>
                        <div>
                          <Label htmlFor="applicantEmail">Email</Label>
                          <Input id="applicantEmail" type="email" value={applicantEmail} onChange={(e) => setApplicantEmail(e.target.value)} required />
                        </div>
                      </>
                    )}
                  </div>
                  {/* Phone input: always editable and pre-filled for logged-in users */}
                  <div>
                    <Label htmlFor="applicantPhone">Phone</Label>
                    <Input id="applicantPhone" value={applicantPhone} onChange={(e) => setApplicantPhone(e.target.value)} />
                  </div>
                </div>

                {/* Resume Link (replace file upload) */}
                <div>
                  <Label htmlFor="resumeLink">Resume Link (Google Drive / Drive URL)</Label>
                  {user?.resume ? (
                    <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-gray-900 text-sm">Current Resume</p>
                          <p className="text-gray-500 text-xs">{user.resume.filename || user.resume.url}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600 text-sm">
                        You can paste a public link to your resume in the field below to use it for this application.
                      </p>
                    </div>
                  ) : (
                    <p className="mb-2 text-gray-600 text-sm">
                      Provide a public link to your resume (e.g., Google Drive share link)
                    </p>
                  )}
                  <div className="mt-2">
                    <Input
                      id="resumeLink"
                      type="url"
                      placeholder="https://drive.google.com/your-resume-link"
                      value={resumeLink}
                      onChange={(e) => setResumeLink(e.target.value)}
                    />
                  </div>
                </div>

                {/* Experience & Skills */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      min={0}
                      placeholder="e.g. 3"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input
                      id="skills"
                      type="text"
                      placeholder="React, Node.js, TypeScript"
                      value={skillsRaw}
                      onChange={(e) => setSkillsRaw(e.target.value)}
                      className="mt-2"
                    />
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
