import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Upload,
  Eye,
  Download,
  Lock,
  Save,
  Camera,
} from "lucide-react";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    dateOfBirth: user?.dateOfBirth || "",
    department: user?.department || "",
    position: user?.position || "",
    joinDate: user?.joinDate || "",
    bio: user?.bio || "",
    skills: user?.skills || "",
    emergencyContact: user?.emergencyContact || "",
    emergencyPhone: user?.emergencyPhone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Simulate password change
    toast.success("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setResumeFile(file);
        toast.success("Resume uploaded successfully!");
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target.result);
          toast.success("Profile picture updated successfully!");
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and settings
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            className={!isEditing ? "btn-gradient" : ""}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        {/* Profile Overview */}
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative flex justify-center items-center">
                <Avatar>
                  <AvatarImage className="w-100 h-150" src={profileImage || user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <Label
                      htmlFor="profile-image-upload"
                      className="cursor-pointer"
                    >
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                        asChild
                      >
                        <div>
                          <Camera className="w-4 h-4" />
                        </div>
                      </Button>
                    </Label>
                  </>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">
                  {user?.position} • {user?.department}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">
                    Employee ID: {user?.employeeId}
                  </Badge>
                  <Badge
                    variant={
                      user?.status === "active" ? "default" : "secondary"
                    }
                  >
                    {user?.status || "Active"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="flex flex-wrap w-full gap-2">
            <TabsTrigger value="personal" className="cursor-pointer">
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="security" className="cursor-pointer">
              Security
            </TabsTrigger>
            <TabsTrigger value="documents" className="cursor-pointer">
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          dateOfBirth: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    rows={3}
                    className={
                      isEditing ? "resize-none" : "resize-none bg-muted"
                    }
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profileData.department}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={profileData.position}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={profileData.joinDate}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={3}
                    className={
                      isEditing ? "resize-none" : "resize-none bg-muted"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    placeholder="List your skills (comma separated)"
                    value={profileData.skills}
                    onChange={(e) =>
                      setProfileData({ ...profileData, skills: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={2}
                    className={
                      isEditing ? "resize-none" : "resize-none bg-muted"
                    }
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      placeholder="Emergency contact name"
                      value={profileData.emergencyContact}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          emergencyContact: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      placeholder="Emergency contact phone"
                      value={profileData.emergencyPhone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          emergencyPhone: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProfileUpdate}
                      className="btn-gradient"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={handlePasswordChange} className="btn-gradient">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Resume & Documents</CardTitle>
                <CardDescription>
                  Manage your resume and other important documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Resume</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your latest resume (PDF format)
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Label htmlFor="resume-upload" className="cursor-pointer">
                    <Button className="btn-gradient">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </Label>
                  {resumeFile && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Selected: {resumeFile.name}
                    </p>
                  )}
                </div>

                {/* Current Documents */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Current Documents</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 font-semibold text-xs">
                            PDF
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">Resume_2024.pdf</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on Jan 15, 2024
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
