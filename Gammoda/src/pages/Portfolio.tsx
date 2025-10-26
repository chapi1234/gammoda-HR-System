import { useState } from "react";
import SEO from "../components/SEO";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Water & Sanitation", "Education", "Agriculture", "Healthcare", "Infrastructure"];

  const projects = [
    {
      id: 1,
      title: "Rural Water Access Program",
      category: "Water & Sanitation",
      location: "Northern Region",
      year: "2023-2024",
      image: "https://images.unsplash.com/photo-1668961915523-884872e392f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHdlbGwlMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzYxMzk5ODU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Constructed 50 deep wells providing clean water access to over 25,000 people across 15 communities.",
    },
    {
      id: 2,
      title: "Community Schools Initiative",
      category: "Education",
      location: "Central Province",
      year: "2022-2024",
      image: "https://images.unsplash.com/photo-1666281269793-da06484657e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBjbGFzc3Jvb20lMjBhZnJpY2F8ZW58MXx8fHwxNzYxMzk5ODU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Built 12 schools, trained 200+ teachers, and provided educational materials to 5,000 students.",
    },
    {
      id: 3,
      title: "Sustainable Farming Project",
      category: "Agriculture",
      location: "Southern District",
      year: "2023-2025",
      image: "https://images.unsplash.com/photo-1662075206108-50db9360502e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGZhcm1pbmclMjB0cmFpbmluZ3xlbnwxfHx8fDE3NjEzOTk4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Trained 800 farmers in modern agricultural techniques, increasing crop yields by an average of 60%.",
    },
    {
      id: 4,
      title: "Community Health Centers",
      category: "Healthcare",
      location: "Eastern Region",
      year: "2022-2023",
      image: "https://images.unsplash.com/photo-1691341114517-e61d8e2e2298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY2xpbmljJTIwY29tbXVuaXR5fGVufDF8fHx8MTc2MTM5OTg1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Established 8 health centers and trained 50 community health workers serving 30,000 people.",
    },
    {
      id: 5,
      title: "Village Sanitation Program",
      category: "Water & Sanitation",
      location: "Western Zone",
      year: "2023",
      image: "https://images.unsplash.com/photo-1758620546575-2c0feb9c68c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGNvbW11bml0eSUyMHByb2plY3R8ZW58MXx8fHwxNzYxMzk5ODU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Built sanitation facilities in 25 villages, improving hygiene and reducing waterborne diseases by 70%.",
    },
    {
      id: 6,
      title: "Road Infrastructure Development",
      category: "Infrastructure",
      location: "Multiple Regions",
      year: "2021-2024",
      image: "https://images.unsplash.com/photo-1761039808254-15fe18badb9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBkZXZlbG9wbWVudCUyMHRlYW18ZW58MXx8fHwxNzYxMzk5ODU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Constructed and rehabilitated 150km of rural roads, connecting isolated communities to markets.",
    },
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <>
      <SEO title="Our Portfolio" description="Explore our development projects and their impact on communities." />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h1 className="mb-6 text-gray-900">Our Projects</h1>
          <p className="text-gray-600 text-lg">
            Transforming communities through sustainable development initiatives across multiple sectors
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-56 w-full object-cover"
                />
                <CardContent className="p-6">
                  <Badge className="mb-3">{project.category}</Badge>
                  <h3 className="mb-2 text-gray-900">{project.title}</h3>
                  <p className="mb-3 text-gray-600 text-sm">{project.description}</p>
                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <span>{project.location}</span>
                    <span>{project.year}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-600">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Impact Summary */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl bg-blue-600 p-12 text-center text-white">
            <h2 className="mb-4">Creating Lasting Impact</h2>
            <p className="mb-8 text-blue-100 text-lg">
              Every project we undertake is designed with sustainability in mind, ensuring
              communities can maintain and build upon the progress we make together.
            </p>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              <div>
                <div className="text-4xl">75+</div>
                <div className="text-blue-100">Active Projects</div>
              </div>
              <div>
                <div className="text-4xl">500+</div>
                <div className="text-blue-100">Communities</div>
              </div>
              <div>
                <div className="text-4xl">100K+</div>
                <div className="text-blue-100">Lives Impacted</div>
              </div>
              <div>
                <div className="text-4xl">15+</div>
                <div className="text-blue-100">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
