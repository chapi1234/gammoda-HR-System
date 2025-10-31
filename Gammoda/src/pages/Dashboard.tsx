import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, FileText, Briefcase, Upload, LogOut, Edit } from "lucide-react";
import SEO from "../components/SEO";
import ApplicationStatusBadge from "../components/ApplicationStatusBadge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../utils/api";
import { apiEndpoints } from "../config/apiConfig";
import { Candidate } from "../types";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  const [candidateData, setCandidateData] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCandidateData();
  }, []);

  const fetchCandidateData = async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.get<Candidate>(apiEndpoints.candidateMe);
      // apiClient returns response.data in most setups, but some endpoints may wrap payload
      // defensively unwrap possible shapes: { status, data }, { data: candidate }, or candidate
      let payload = res;
      if (payload && payload.data !== undefined) {
        // if double-wrapped { data: { data: ... } }
        if (payload.data.data !== undefined) payload = payload.data.data;
        else payload = payload.data;
      }

      const data = payload as Candidate;
      setCandidateData(data);
      setFormData({
        name: data?.name || "",
        phone: data?.phone || "",
      });
    } catch (error) {
      console.error("Failed to fetch candidate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await apiClient.patch<Candidate>(apiEndpoints.updateProfile, formData);
      updateUser(updated);
      setCandidateData(updated);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setResume(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const updated = await apiClient.patch<Candidate>(apiEndpoints.updateProfile, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateUser(updated);
      setCandidateData(updated);
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Failed to upload resume:", error);
      toast.error("Failed to upload resume");
    } finally {
      setUploading(false);
      setResume(null);
    }
  };

  // Helper to format dates safely and support multiple payload field names
  function formatApplicationDate(app: any) {
    const dateVal = app?.appliedAt || app?.appliedDate || app?.appliedOn || app?.createdAt || app?.applied_on;
    if (!dateVal) return "Unknown";
    try {
      return new Date(dateVal).toLocaleDateString();
    } catch (e) {
      return String(dateVal);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Dashboard" />

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Welcome back, {candidateData?.name || user?.name}!</h1>
              <p className="text-gray-600">Manage your profile and track your applications</p>
            </div>
            <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="applications" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Applications
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(!editMode)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      {editMode ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user?.email} disabled />
                        <p className="mt-1 text-gray-500 text-xs">Email cannot be changed</p>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                      <Button type="submit">Save Changes</Button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label>Full Name</Label>
                        <p className="text-gray-900">{candidateData?.name}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="text-gray-900">{candidateData?.email}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p className="text-gray-900">
                          {candidateData?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidateData?.resume ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-gray-900">{candidateData.resume.filename}</p>
                          <a
                            href={candidateData.resume.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View Resume
                          </a>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="resume-upload">Upload New Resume</Label>
                        <label
                          htmlFor="resume-upload"
                          className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-4 transition-colors hover:border-blue-400 hover:bg-blue-50"
                        >
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-600">
                            {uploading ? "Uploading..." : "Choose new file"}
                          </span>
                          <input
                            id="resume-upload"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeUpload}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-4 text-gray-600">No resume uploaded yet</p>
                      <label
                        htmlFor="resume-upload"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-8 transition-colors hover:border-blue-400 hover:bg-blue-50"
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">
                          {uploading ? "Uploading..." : "Upload your resume"}
                        </span>
                        <input
                          id="resume-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          disabled={uploading}
                        />
                      </label>
                      <p className="mt-2 text-gray-500 text-sm">
                        PDF or DOC format, max 5MB
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>My Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidateData?.applications && candidateData.applications.length > 0 ? (
                    <div className="space-y-4">
                      {candidateData.applications.map((application) => (
                        <div
                          key={(application as any)._id || (application as any).id}
                          className="rounded-lg border border-gray-200 p-4"
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <h3 className="text-gray-900">
                                {(application as any)?.job?.title || (application as any)?.jobTitle || (application as any)?.jobName || "Position"}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                Applied on {formatApplicationDate(application)}
                              </p>
                            </div>
                            <ApplicationStatusBadge status={(application as any).status} />
                          </div>

                          {application.statusHistory && application.statusHistory.length > 0 && (
                            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                              <p className="text-gray-600 text-sm">Status History:</p>
                              {application.statusHistory.map((history, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-500">
                                    {new Date(history.timestamp).toLocaleDateString()}
                                  </span>
                                  <span className="text-gray-900">{history.status}</span>
                                  {history.note && (
                                    <span className="text-gray-600">- {history.note}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Briefcase className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <p className="mb-4 text-gray-600">No applications yet</p>
                      <Link to="/careers">
                        <Button>Browse Jobs</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
