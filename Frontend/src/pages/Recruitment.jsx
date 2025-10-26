import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Search,
  Plus,
  Filter,
  Eye,
  UserCheck,
  UserX,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  Star,
  Edit3,
  Phone,
  Mail,
  FileText,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";

const Recruitment = () => {
  const { isHR } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetailDialog, setShowJobDetailDialog] = useState(false);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [editJobData, setEditJobData] = useState({});

  // Mock job postings data
  const [jobPostings, setJobPostings] = useState([
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Arbaminch, AM",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      status: "active",
      postedDate: "2025-01-15",
      applications: 12,
      description:
        "We are looking for an experienced frontend developer to join our team...",
    },
    {
      id: 2,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Addis Ababa, AA",
      type: "Full-time",
      salary: "$70,000 - $90,000",
      status: "active",
      postedDate: "2025-01-10",
      applications: 8,
      description: "Lead our marketing initiatives and drive brand growth...",
    },
    {
      id: 3,
      title: "Sales Executive",
      department: "Sales",
      location: "Chencha, IL",
      type: "Full-time",
      salary: "$60,000 - $80,000",
      status: "closed",
      postedDate: "2025-01-05",
      applications: 15,
      description: "Join our sales team and help us expand our client base...",
    },
  ]);

  // Mock applicants data
  const [applicants, setApplicants] = useState([
    {
      id: 1,
      name: "Hana Jote",
      email: "hana.jote@email.com",
      phone: "+2519-2986-4782",
      position: "Senior Frontend Developer",
      jobId: 1,
      experience: "5 years",
      skills: ["React", "TypeScript", "Node.js"],
      status: "shortlisted",
      appliedDate: "2025-01-20",
      resume: "hana_jote_resume.pdf",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Amanuel Admasu",
      email: "amanuel.admasu@email.com",
      phone: "+2519-8976-1732",
      position: "Marketing Manager",
      jobId: 2,
      experience: "7 years",
      skills: ["Digital Marketing", "SEO", "Analytics"],
      status: "under_review",
      appliedDate: "2025-01-18",
      resume: "amanuel_admasu_resume.pdf",
      rating: 4.2,
    },
    {
      id: 3,
      name: "Tsega Eyuel",
      email: "tsega.eyuel@email.com",
      phone: "+2519-2657-0537",
      position: "Sales Executive",
      jobId: 3,
      experience: "3 years",
      skills: ["B2B Sales", "CRM", "Lead Generation"],
      status: "rejected",
      appliedDate: "2025-01-15",
      resume: "tsega_eyuel_resume.pdf",
      rating: 3.8,
    },
    {
      id: 4,
      name: "Biruk Tesfaye",
      email: "biruk.tesfaye@email.com",
      phone: "+2519-1111-2233",
      position: "Senior Frontend Developer",
      jobId: 1,
      experience: "6 years",
      skills: ["React", "Vue.js", "GraphQL", "AWS"],
      status: "applied",
      appliedDate: "2025-08-22",
      resume: "biruk_tesfaye_resume.pdf",
      rating: 4.8,
    },
    {
      id: 5,
      name: "Temesgen Abel",
      email: "temesgen.abel@email.com",
      phone: "+2519-4444-5566",
      position: "Senior Frontend Developer",
      jobId: 1,
      experience: "4 years",
      skills: ["React", "Angular", "TypeScript"],
      status: "under_review",
      appliedDate: "2024-01-19",
      resume: "michael_davis_resume.pdf",
      rating: 4.0,
    },
  ]);

  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    salary: "",
    description: "",
  });

  const statusOptions = ["all", "active", "closed", "draft"];
  const applicantStatusOptions = [
    "all",
    "applied",
    "under_review",
    "shortlisted",
    "rejected",
    "hired",
  ];
  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "Human Resources",
    "Finance",
    "Operations",
  ];
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];

  const filteredJobs = jobPostings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || applicant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddJob = () => {
    if (!newJob.title || !newJob.department || !newJob.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const job = {
      ...newJob,
      id: jobPostings.length + 1,
      status: "active",
      postedDate: new Date().toISOString().split("T")[0],
      applications: 0,
    };

    setJobPostings([...jobPostings, job]);
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "",
      salary: "",
      description: "",
    });
    setShowJobDialog(false);
    toast.success("Job posting created successfully!");
  };

  const handleApplicantAction = (id, status) => {
    setApplicants((prev) =>
      prev.map((applicant) =>
        applicant.id === id ? { ...applicant, status } : applicant
      )
    );
    toast.success(`Applicant ${status} successfully!`);
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setEditJobData(job);
    setIsEditingJob(false);
    setShowJobDetailDialog(true);
  };

  const handleEditJob = () => {
    setIsEditingJob(true);
  };

  const handleSaveJobEdit = () => {
    setJobPostings((prev) =>
      prev.map((job) => (job.id === selectedJob.id ? { ...editJobData } : job))
    );
    setSelectedJob(editJobData);
    setIsEditingJob(false);
    toast.success("Job updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditJobData(selectedJob);
    setIsEditingJob(false);
  };

  const getJobApplicants = (jobId) => {
    return applicants.filter((applicant) => applicant.jobId === jobId);
  };

  const getJobStatusBadge = (status) => {
    const variants = {
      active: { variant: "default", label: "Active" },
      closed: { variant: "secondary", label: "Closed" },
      draft: { variant: "outline", label: "Draft" },
    };
    const config = variants[status] || variants.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getApplicantStatusBadge = (status) => {
    const variants = {
      applied: { variant: "secondary", label: "Applied" },
      under_review: { variant: "outline", label: "Under Review" },
      shortlisted: { variant: "default", label: "Shortlisted" },
      rejected: { variant: "destructive", label: "Rejected" },
      hired: { variant: "default", label: "Hired" },
    };
    const config = variants[status] || variants.applied;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const totalJobs = jobPostings.length;
  const activeJobs = jobPostings.filter((j) => j.status === "active").length;
  const totalApplicants = applicants.length;
  const shortlistedApplicants = applicants.filter(
    (a) => a.status === "shortlisted"
  ).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recruitment</h1>
          <p className="text-muted-foreground">
            {isHR
              ? "Manage job postings and applicants"
              : "View available positions"}
          </p>
        </div>
        {isHR && (
          <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent
              // className="max-w-2xl"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <DialogHeader>
                <DialogTitle>Create Job Posting</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new job posting
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={newJob.title}
                      onChange={(e) =>
                        setNewJob({ ...newJob, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={newJob.department}
                      onValueChange={(value) =>
                        setNewJob({ ...newJob, department: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. New York, NY"
                      value={newJob.location}
                      onChange={(e) =>
                        setNewJob({ ...newJob, location: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Job Type</Label>
                    <Select
                      value={newJob.type}
                      onValueChange={(value) =>
                        setNewJob({ ...newJob, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    placeholder="e.g. $70,000 - $90,000"
                    value={newJob.salary}
                    onChange={(e) =>
                      setNewJob({ ...newJob, salary: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed job description..."
                    value={newJob.description}
                    onChange={(e) =>
                      setNewJob({ ...newJob, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowJobDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddJob} className="btn-gradient">
                  Post Job
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              Currently recruiting
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applicants
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicants}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shortlistedApplicants}</div>
            <p className="text-xs text-muted-foreground">Ready for interview</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap w-full gap-2">
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          {/* Job Filters */}
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "all"
                          ? "All Status"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="dashboard-card hover:shadow-card-hover transition-all duration-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Building2 className="w-4 h-4" />
                        {job.department}
                      </CardDescription>
                    </div>
                    {getJobStatusBadge(job.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UserCheck className="w-4 h-4" />
                      <span>{job.applications} applicants</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewJobDetails(job)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applicants" className="space-y-6">
          {/* Applicant Filters */}
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {applicantStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "all"
                          ? "All Status"
                          : status
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Applicants Table */}
          <Card className="data-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  {isHR && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {applicant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{applicant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {applicant.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{applicant.position}</TableCell>
                    <TableCell>{applicant.experience}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {applicant.skills.slice(0, 2).map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {applicant.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{applicant.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getApplicantStatusBadge(applicant.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(applicant.appliedDate).toLocaleDateString()}
                    </TableCell>
                    {isHR && (
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {applicant.status === "applied" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() =>
                                handleApplicantAction(
                                  applicant.id,
                                  "shortlisted"
                                )
                              }
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}
                          {applicant.status !== "rejected" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() =>
                                handleApplicantAction(applicant.id, "rejected")
                              }
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {((activeTab === "jobs" && filteredJobs.length === 0) ||
        (activeTab === "applicants" && filteredApplicants.length === 0)) && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No {activeTab === "jobs" ? "jobs" : "applicants"} found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Job Detail Dialog */}
      <Dialog open={showJobDetailDialog} onOpenChange={setShowJobDetailDialog}>
        <DialogContent
          className="max-w-4xl"
          style={{ maxHeight: "100vh", overflowY: "auto" }}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  {selectedJob?.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4" />
                  {selectedJob?.department}
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                {getJobStatusBadge(selectedJob?.status)}
                {isHR && !isEditingJob && (
                  <Button variant="outline" size="sm" onClick={handleEditJob}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Job
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Job Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingJob ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={editJobData.title || ""}
                          onChange={(e) =>
                            setEditJobData({
                              ...editJobData,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Department</Label>
                        <Select
                          value={editJobData.department || ""}
                          onValueChange={(value) =>
                            setEditJobData({
                              ...editJobData,
                              department: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={editJobData.location || ""}
                          onChange={(e) =>
                            setEditJobData({
                              ...editJobData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Job Type</Label>
                        <Select
                          value={editJobData.type || ""}
                          onValueChange={(value) =>
                            setEditJobData({ ...editJobData, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {jobTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Salary Range</Label>
                        <Input
                          value={editJobData.salary || ""}
                          onChange={(e) =>
                            setEditJobData({
                              ...editJobData,
                              salary: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedJob?.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedJob?.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedJob?.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          Posted{" "}
                          {selectedJob &&
                            new Date(
                              selectedJob.postedDate
                            ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedJob?.applications} applicants</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditingJob ? (
                    <Textarea
                      value={editJobData.description || ""}
                      onChange={(e) =>
                        setEditJobData({
                          ...editJobData,
                          description: e.target.value,
                        })
                      }
                      rows={8}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedJob?.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Edit Job Actions */}
            {isEditingJob && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button onClick={handleSaveJobEdit} className="btn-gradient">
                  Save Changes
                </Button>
              </div>
            )}

            {/* Applicants Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Applicants (
                  {selectedJob && getJobApplicants(selectedJob.id).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedJob && getJobApplicants(selectedJob.id).length > 0 ? (
                  <div className="space-y-4">
                    {getJobApplicants(selectedJob.id).map((applicant) => (
                      <div
                        key={applicant.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${applicant.name}`}
                              />
                              <AvatarFallback>
                                {applicant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                              <div>
                                <h4 className="font-semibold">
                                  {applicant.name}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {applicant.email}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {applicant.phone}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <span>
                                  <strong>Experience:</strong>{" "}
                                  {applicant.experience}
                                </span>
                                <span>
                                  <strong>Applied:</strong>{" "}
                                  {new Date(
                                    applicant.appliedDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  <strong>Skills:</strong>
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {applicant.skills.map((skill, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getApplicantStatusBadge(applicant.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  `/resumes/${applicant.resume}`,
                                  "_blank"
                                )
                              }
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Resume
                            </Button>
                            {isHR &&
                              applicant.status !== "hired" &&
                              applicant.status !== "rejected" && (
                                <div className="flex gap-1">
                                  {applicant.status !== "shortlisted" && (
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleApplicantAction(
                                          applicant.id,
                                          "shortlisted"
                                        )
                                      }
                                      className="btn-gradient"
                                    >
                                      <UserCheck className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleApplicantAction(
                                        applicant.id,
                                        "rejected"
                                      )
                                    }
                                  >
                                    <UserX className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No applicants for this position yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recruitment;
