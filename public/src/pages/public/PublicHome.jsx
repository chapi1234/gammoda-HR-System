import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/download.jpg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";

const featuredJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    postedDate: "2 days ago",
    description:
      "Join our engineering team to build cutting-edge web applications using React and modern technologies.",
    requirements: ["React", "TypeScript", "Node.js"],
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    postedDate: "1 week ago",
    description:
      "Lead product strategy and development for our core platform features.",
    requirements: ["Product Strategy", "Analytics", "Leadership"],
  },
  {
    id: 3,
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    salary: "$75,000 - $95,000",
    postedDate: "3 days ago",
    description:
      "Design intuitive user experiences for our employee management platform.",
    requirements: ["Figma", "User Research", "Prototyping"],
  },
];

const stats = [
  { label: "Open Positions", value: "50+", icon: Briefcase },
  { label: "Team Members", value: "200+", icon: Users },
  { label: "Years Growing", value: "8+", icon: TrendingUp },
  { label: "Industry Awards", value: "15+", icon: Award },
];

export default function PublicHome() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(90deg, #e0e7ff 0%, #e0e7ff 40%, #f5f3ff 60%, #f5f3ff 100%)",
      }}
    >
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Join the Future of Work at{" "}
            <span className="from-accent to-accent-foreground bg-clip-text text-transparent">
              Gamo Development Association
            </span>
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
            We're building the next generation of employee management solutions.
            Join our team of passionate innovators and help shape the future of
            workplace technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/public/jobs">
                View Open Positions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/public/company">Learn About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 px-4 flex flex-col md:flex-row items-center justify-center">
        {/* Left column (stats) */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-8 w-full max-w-md">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column (image) */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src={logoImg}
            alt="GammoDA Logo"
            className="w-full max-w-md h-[300px] md:h-[500px] object-contain rounded-md"
          />
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Opportunities</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover exciting career opportunities that match your skills and
              ambitions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredJobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-card-hover transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <Badge variant="secondary">{job.department}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {job.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {job.type} • {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Posted {job.postedDate}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full" asChild>
                    <Link to={`/public/jobs/${job.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/public/jobs">
                View All Jobs
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Join GammoDA?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We believe in creating an environment where innovation thrives and
              careers flourish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-primary mr-2" />
                  Growth Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advance your career with clear progression paths, mentorship
                  programs, and continuous learning opportunities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  Collaborative Culture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Work with talented, passionate people in an inclusive
                  environment that values diversity and innovation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 text-primary mr-2" />
                  Competitive Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive health coverage, flexible work arrangements, and
                  competitive compensation packages.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of talented professionals who are already building the
            future with us
          </p>
          <Button size="lg" asChild>
            <Link to="/public/auth?mode=register">
              Create Your Account
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
