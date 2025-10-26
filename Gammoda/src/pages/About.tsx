import { Users, Target, Heart, Award } from "lucide-react";
import SEO from "../components/SEO";
import { Card, CardContent } from "../components/ui/card";
import { siteConfig } from "../config/siteConfig";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We approach every community with empathy, respect, and genuine care for their wellbeing.",
    },
    {
      icon: Users,
      title: "Partnership",
      description: "We work alongside communities, building solutions together rather than imposing them.",
    },
    {
      icon: Target,
      title: "Impact",
      description: "We focus on creating measurable, sustainable change that lasts for generations.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from planning to execution.",
    },
  ];

  const timeline = [
    { year: "2010", event: "GamoDA founded with a mission to empower rural communities" },
    { year: "2012", event: "Launched first clean water initiative, serving 50 communities" },
    { year: "2015", event: "Expanded to education sector, building 20 schools" },
    { year: "2018", event: "Reached milestone of 100,000 lives directly impacted" },
    { year: "2020", event: "Introduced sustainable agriculture programs across the region" },
    { year: "2023", event: "Recognized as leading development organization by international bodies" },
    { year: "2025", event: "Continuing to grow our impact and reach more communities" },
  ];

  return (
    <>
      <SEO title="About Us" description={`Learn about ${siteConfig.companyName}'s mission, values, and impact on communities.`} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h1 className="mb-6 text-gray-900">About {siteConfig.companyShortName}</h1>
          <p className="text-gray-600 text-lg">
            For over 15 years, we've been dedicated to creating positive, lasting change in
            communities through sustainable development programs and genuine partnerships.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-gray-900">Our Mission</h2>
              <p className="text-gray-600">
                To empower communities through sustainable development initiatives that address
                fundamental needs in water, education, healthcare, and economic opportunity. We
                believe in building capacity from within, creating solutions that communities can
                own and sustain long after our initial engagement.
              </p>
            </div>
            <div>
              <h2 className="mb-4 text-gray-900">Our Vision</h2>
              <p className="text-gray-600">
                A world where every community has the resources, knowledge, and capacity to thrive
                independently. We envision self-reliant communities that can solve their own
                challenges, create opportunities, and build a better future for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-gray-900">Our Values</h2>
            <p className="text-gray-600">The principles that guide our work and define who we are</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mb-2 text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-gray-900">Our Journey</h2>
            <p className="text-gray-600">Key milestones in our mission to create lasting impact</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 h-full w-0.5 bg-blue-200" />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex gap-6">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                    {item.year}
                  </div>
                  <div className="flex-1 pt-3">
                    <p className="text-gray-900">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-gray-900">Our Team</h2>
            <p className="text-gray-600">
              Passionate professionals from diverse backgrounds, united by a common purpose
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-200" />
                <h3 className="mb-1 text-gray-900">Development Experts</h3>
                <p className="text-gray-600 text-sm">
                  Specialists in community development, project management, and capacity building
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-200" />
                <h3 className="mb-1 text-gray-900">Technical Professionals</h3>
                <p className="text-gray-600 text-sm">
                  Engineers, educators, healthcare workers, and agricultural specialists
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-200" />
                <h3 className="mb-1 text-gray-900">Support Staff</h3>
                <p className="text-gray-600 text-sm">
                  Finance, HR, communications, and operations teams ensuring smooth execution
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
