import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Target, TrendingUp, Award, Calendar, CheckCircle, 
  Clock, Star, BookOpen, Users, Trophy 
} from 'lucide-react';
import { toast } from 'react-toastify';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Complete React Certification',
      description: 'Finish the advanced React development course',
      progress: 75,
      target: 100,
      deadline: '2024-12-31',
      category: 'skill',
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Improve Team Collaboration',
      description: 'Enhance communication and teamwork skills',
      progress: 60,
      target: 100,
      deadline: '2024-11-30',
      category: 'soft-skill',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Complete Project Alpha',
      description: 'Deliver the frontend components for Project Alpha',
      progress: 90,
      target: 100,
      deadline: '2024-09-15',
      category: 'project',
      status: 'in-progress'
    },
    {
      id: 4,
      title: 'Attend 5 Tech Conferences',
      description: 'Participate in industry conferences for networking',
      progress: 80,
      target: 100,
      deadline: '2024-12-01',
      category: 'networking',
      status: 'in-progress'
    }
  ]);

  const achievements = [
    {
      id: 1,
      title: 'Employee of the Month',
      description: 'Outstanding performance in July 2024',
      date: '2024-07-31',
      type: 'recognition'
    },
    {
      id: 2,
      title: 'Project Excellence Award',
      description: 'Successfully delivered Project Beta ahead of schedule',
      date: '2024-06-15',
      type: 'project'
    },
    {
      id: 3,
      title: 'Team Player Award',
      description: 'Exceptional collaboration and support to team members',
      date: '2024-05-20',
      type: 'teamwork'
    }
  ];

  const updateGoalProgress = (goalId, newProgress) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: Math.min(newProgress, goal.target) }
        : goal
    ));
    toast.success('Goal progress updated!');
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'skill':
        return BookOpen;
      case 'soft-skill':
        return Users;
      case 'project':
        return Target;
      case 'networking':
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
            <h1 className="text-3xl font-bold text-foreground">My Goals & Achievements</h1>
            <p className="text-muted-foreground">Track your progress and celebrate your achievements</p>
          </div>
          <Button className="btn-gradient">
            <Target className="w-4 h-4 mr-2" />
            Set New Goal
          </Button>
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
                    {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Average Progress</p>
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
          <TabsList className="grid w-full grid-cols-2">
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
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {goal.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className={`font-medium ${getProgressColor(goal.progress)}`}>
                            {goal.progress}%
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                        <Badge variant={goal.progress >= 90 ? 'default' : 'secondary'}>
                          {goal.status.replace('-', ' ')}
                        </Badge>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateGoalProgress(goal.id, goal.progress + 10)}
                          disabled={goal.progress >= 100}
                        >
                          Update Progress
                        </Button>
                        <Button size="sm" variant="ghost">
                          Edit Goal
                        </Button>
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
                        <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
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