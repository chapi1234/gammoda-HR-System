import { Link } from "react-router-dom";
import { ArrowRight, Users, Target, Award, TrendingUp } from "lucide-react";
import SEO from "../components/SEO";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { siteConfig } from "../config/siteConfig";

export default function Home() {
  const stats = [
    { label: "Communities Served", value: "500+", icon: Users },
    { label: "Active Projects", value: "75", icon: Target },
    { label: "Years of Impact", value: "15+", icon: Award },
    { label: "Lives Improved", value: "100K+", icon: TrendingUp },
  ];

  const featuredProjects = [
    {
      title: "Clean Water Initiative",
      description: "Providing access to clean water for rural communities",
      image: "https://images.unsplash.com/photo-1668961915523-884872e392f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHdlbGwlMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzYxMzk5ODU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Education for All",
      description: "Building schools and training teachers in underserved areas",
      image: "https://images.unsplash.com/photo-1666281269793-da06484657e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBjbGFzc3Jvb20lMjBhZnJpY2F8ZW58MXx8fHwxNzYxMzk5ODU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Sustainable Agriculture",
      description: "Empowering farmers with modern techniques and tools",
      image: "https://images.unsplash.com/photo-1662075206108-50db9360502e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGZhcm1pbmclMjB0cmFpbmluZ3xlbnwxfHx8fDE3NjEzOTk4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <>
      <SEO />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-gray-900">
              {siteConfig.tagline}
            </h1>
            <p className="mb-8 text-gray-600 text-lg">
              Join us in making a lasting difference in communities across the region. Together,
              we create opportunities, build capacity, and transform lives.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to={siteConfig.links.careers}>
                <Button size="lg" className="gap-2">
                  Explore Careers <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to={siteConfig.links.about}>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-gray-900 text-3xl">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 text-gray-900">Who We Are</h2>
              <p className="mb-4 text-gray-600">
                {siteConfig.companyName} is a pioneering development organization committed to
                creating sustainable change in communities across the region. Since our founding,
                we've been at the forefront of community empowerment, social innovation, and
                sustainable development.
              </p>
              <p className="mb-6 text-gray-600">
                Our multidisciplinary team works hand-in-hand with local communities to identify
                needs, co-create solutions, and build lasting capacity for self-reliance.
              </p>
              <Link to={siteConfig.links.about}>
                <Button variant="outline" className="gap-2">
                  Read Our Story <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1761039808254-15fe18badb9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBkZXZlbG9wbWVudCUyMHRlYW18ZW58MXx8fHwxNzYxMzk5ODU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Community development team"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-gray-900">Featured Projects</h2>
            <p className="text-gray-600">
              Discover our impact across communities through transformative initiatives
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Card key={index} className="overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-48 w-full object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="mb-2 text-gray-900">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to={siteConfig.links.portfolio}>
              <Button variant="outline" className="gap-2">
                View All Projects <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="mb-4 text-white">Join Our Team</h2>
          <p className="mb-8 text-blue-100 text-lg">
            We're looking for passionate individuals who want to make a real difference.
            Explore our current openings and start your journey with us.
          </p>
          <Link to={siteConfig.links.careers}>
            <Button size="lg" variant="secondary" className="gap-2">
              View Open Positions <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
