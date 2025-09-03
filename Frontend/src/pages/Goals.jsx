import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Target,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  BookOpen,
  Users,
  Trophy,
  Edit,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { toast } from "react-toastify";

const Goals = () => {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Complete React Certification",
      description: "Finish the advanced React development course",
      progress: 75,
      target: 100,
      deadline: "2024-12-31",
      category: "skill",
      status: "in-progress",
    },
    {
      id: 2,
      title: "Improve Team Collaboration",
      description: "Enhance communication and teamwork skills",
      progress: 60,
      target: 100,
      deadline: "2024-11-30",
      category: "soft-skill",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Complete Project Alpha",
      description: "Deliver the frontend components for Project Alpha",
      progress: 90,
      target: 100,
      deadline: "2024-09-15",
      category: "project",
      status: "in-progress",
    },
    {
      id: 4,
      title: "Attend 5 Tech Conferences",
      description: "Participate in industry conferences for networking",
      progress: 80,
      target: 100,
      deadline: "2024-12-01",
      category: "networking",
      status: "in-progress",
    },
  ]);

  const achievements = [
    {
      id: 1,
      title: "Employee of the Month",
      description: "Outstanding performance in July 2024",
      date: "2024-07-31",
      type: "recognition",
    },
    {
      id: 2,
      title: "Project Excellence Award",
      description: "Successfully delivered Project Beta ahead of schedule",
      date: "2024-06-15",
      type: "project",
    },
    {
      id: 3,
      title: "Team Player Award",
      description: "Exceptional collaboration and support to team members",
      date: "2024-05-20",
      type: "teamwork",
    },
  ];

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    progress: 0,
    target: 100,
    deadline: "",
    category: "skill",
    status: "in-progress",
  });

  const category = ["skill", "soft-skill", "project", "networking"];
  const [editingGoal, setEditingGoal] = useState(null);

  const handleAddGoal = () => {
    if (
      !newGoal.title ||
      !newGoal.description ||
      !newGoal.deadline ||
      !newGoal.category
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const goal = {
      ...newGoal,
      id: goals.length + 1,
      progress: parseInt(newGoal.progress) || 0,
      target: parseInt(newGoal.target) || 100,
      status: "in-progress",
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: "",
      description: "",
      progress: 0,
      target: 100,
      deadline: "",
      category: "",
      status: "in-progress",
    });
    setShowAddDialog(false);
    toast.success("Goal added successfully!");
  };

  const handleEditGoal = (goal) => {
    setEditingGoal({
      ...goal,
      progress: goal.progress.toString(),
      target: goal.target.toString(),
    });
  };

  const handleUpdateGoal = () => {
    if (!editingGoal.title || !editingGoal.description || !editingGoal.deadline || !editingGoal.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedGoal = {
      ...editingGoal,
      progress: parseInt(editingGoal.progress) || 0,
      target: parseInt(editingGoal.target) || 100
    };

    setGoals(goals.map(goal =>
      goal.id === editingGoal.id ? updatedGoal : goal
    ));
    setEditingGoal(null);
    toast.success('Goal updated successfully!');
  };

  // const handleUpdateGoal = () => {
  //   if (
  //     !editingGoal.title ||
  //     !editingGoal.description ||
  //     !editingGoal.deadline ||
  //     !editingGoal.category
  //   ) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }

  //   const updatedGoal = {
  //     ...editingGoal,
  //     progress: parseInt(editingGoal.progress) || 0,
  //     target: parseInt(editingGoal.target) || 100,
  //   };

  //   const wasCompleted =
  //     goals.find((goal) => goal.id === editingGoal.id)?.status === "completed";
  //   setGoals(
  //     goals.map((goal) => (goal.id === editingGoal.id ? updatedGoal : goal))
  //   );

  //   // If goal is now completed and wasn't before, add to achievements
  //   if (updatedGoal.status === "completed" && !wasCompleted) {
  //     const alreadyAchieved = achievements.some(
  //       (a) => a.title === updatedGoal.title
  //     );
  //     if (!alreadyAchieved) {
  //       setAchievements([
  //         ...achievements,
  //         {
  //           id: achievements.length + 1,
  //           title: updatedGoal.title,
  //           description: updatedGoal.description,
  //           date: new Date().toISOString().split("T")[0],
  //           type: updatedGoal.category,
  //         },
  //       ]);
  //       toast.success("Goal moved to achievements!");
  //     }
  //   }

  //   setEditingGoal(null);
  //   toast.success("Goal updated successfully!");
  // };
  
  const handleDeleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    toast.success("Goal removed successfully!");
  };

  const updateGoalProgress = (goalId, newProgress) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? { ...goal, progress: Math.min(newProgress, goal.target) }
          : goal
      )
    );
    toast.success("Goal progress updated!");
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "skill":
        return BookOpen;
      case "soft-skill":
        return Users;
      case "project":
        return Target;
      case "networking":
        return Star;
      default:
        return Target;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              My Goals & Achievements
            </h1>
            <p className="text-muted-foreground">
              Track your progress and celebrate your achievements
            </p>
          </div>
          {/* <Button className="btn-gradient">
            <Target className="w-4 h-4 mr-2" />
            Set New Goal
          </Button> */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Target className="w-4 h-4 mr-2" />
                Set New Goal
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-md"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <DialogHeader>
                <DialogTitle>Create a New Goal</DialogTitle>
                <DialogDescription>
                  Set a new goal to track your progress and achievements.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title *</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                    placeholder="Enter The Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, description: e.target.value })
                    }
                    placeholder="Enter The Detailed Description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, deadline: e.target.value })
                    }
                    placeholder="Choose The Deadline"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value) =>
                      setNewGoal({ ...newGoal, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {category.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddGoal} className="btn-gradient">
                  Add Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{goals.length}</p>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      goals.reduce((acc, goal) => acc + goal.progress, 0) /
                        goals.length
                    )}
                    %
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Average Progress
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{achievements.length}</p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals and Achievements Tabs */}
        <Tabs defaultValue="goals" className="w-full">
          <TabsList className="flex flex-wrap w-full gap-3">
            <TabsTrigger value="goals">Current Goals</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {goals.map((goal) => {
                const CategoryIcon = getCategoryIcon(goal.category);
                return (
                  <Card key={goal.id} className="dashboard-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="w-5 h-5 text-primary" />
                          <CardTitle className="text-lg">
                            {goal.title}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {goal.category.replace("-", " ")}
                        </Badge>
                      </div>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span
                            className={`font-medium ${getProgressColor(
                              goal.progress
                            )}`}
                          >
                            {goal.progress}%
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge
                          variant={
                            goal.progress >= 90 ? "default" : "secondary"
                          }
                        >
                          {goal.status.replace("-", " ")}
                        </Badge>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateGoalProgress(goal.id, goal.progress + 10)
                          }
                          disabled={goal.progress >= 100}
                        >
                          Update Progress
                        </Button>

                        <Dialog
                          open={!!editingGoal}
                          onOpenChange={(open) => !open && setEditingGoal(null)}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditGoal(goal)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Goal
                          </Button>
                          <DialogContent
                            className="max-w-md"
                            style={{ maxHeight: "90vh", overflowY: "auto" }}
                          >
                            <DialogHeader>
                              <DialogTitle>Edit Goal</DialogTitle>
                              <DialogDescription>
                                Update goal information.
                              </DialogDescription>
                            </DialogHeader>
                            {editingGoal && (
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-title">Title *</Label>
                                  <Input
                                    id="edit-title"
                                    value={editingGoal.title}
                                    onChange={(e) =>
                                      setEditingGoal({
                                        ...editingGoal,
                                        title: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">
                                    Description *
                                  </Label>
                                  <Input
                                    id="edit-description"
                                    value={editingGoal.description}
                                    onChange={(e) =>
                                      setEditingGoal({
                                        ...editingGoal,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-category">
                                      Category *
                                    </Label>
                                    <Select
                                      value={editingGoal.category}
                                      onValueChange={(value) =>
                                        setEditingGoal({
                                          ...editingGoal,
                                          category: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[
                                          "skill",
                                          "soft-skill",
                                          "project",
                                          "networking",
                                        ].map((cat) => (
                                          <SelectItem key={cat} value={cat}>
                                            {cat.replace("-", " ")}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-progress">
                                      Progress (%)
                                    </Label>
                                    <Input
                                      id="edit-progress"
                                      type="number"
                                      value={editingGoal.progress}
                                      onChange={(e) =>
                                        setEditingGoal({
                                          ...editingGoal,
                                          progress: e.target.value,
                                        })
                                      }
                                      min={0}
                                      max={100}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-target">
                                      Target (%)
                                    </Label>
                                    <Input
                                      id="edit-target"
                                      type="number"
                                      value={editingGoal.target}
                                      onChange={(e) =>
                                        setEditingGoal({
                                          ...editingGoal,
                                          target: e.target.value,
                                        })
                                      }
                                      min={0}
                                      max={100}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-deadline">
                                      Deadline *
                                    </Label>
                                    <Input
                                      id="edit-deadline"
                                      type="date"
                                      value={editingGoal.deadline}
                                      onChange={(e) =>
                                        setEditingGoal({
                                          ...editingGoal,
                                          deadline: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select
                                    value={editingGoal.status}
                                    onValueChange={(value) =>
                                      setEditingGoal({
                                        ...editingGoal,
                                        status: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="in-progress">
                                        In Progress
                                      </SelectItem>
                                      <SelectItem value="completed">
                                        Completed
                                      </SelectItem>
                                      <SelectItem value="on-hold">
                                        On Hold
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setEditingGoal(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleUpdateGoal}
                                className="btn-gradient"
                              >
                                Update Goal
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="dashboard-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="capitalize">
                            {achievement.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Goals;
