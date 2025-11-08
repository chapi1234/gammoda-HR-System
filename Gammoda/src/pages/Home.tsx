import { Link } from "react-router-dom";
import { ArrowRight, Users, Target, Award, TrendingUp } from "lucide-react";
import SEO from "../components/SEO";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { siteConfig } from "../config/siteConfig";
import { motion } from "framer-motion";


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
      <motion.section
        style={{ background: "var(--hero-gradient)" }}
        className="relative py-20 lg:py-32 flex items-center"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 50 }}   // Initial entrance
            animate={{ opacity: 1, y: 0 }}    // Fade in and slide up
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Title */}
            <motion.h1
              style={{ fontSize: "3rem", lineHeight: "1.2", fontFamily: "cursive" }}
              className="mb-6 text-gray-900"
              animate={{
                y: [0, -10, 0, 10, 0],   // continuous vertical motion after entrance
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,             // start after initial entrance animation
              }}
            >
              {siteConfig.tagline}
            </motion.h1>

            {/* Description */}
            <motion.p
              style={{ fontSize: "1.5rem", lineHeight: "1.2", fontFamily: "cursive" }}
              className="mb-8 text-gray-600 text-lg"
              animate={{
                x: [0, 10, 0, -10, 0],   // continuous side-to-side motion
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,              // start after initial entrance
              }}
            >
              Join us in making a lasting difference in communities across the region.
              Together, we create opportunities, build capacity, and transform lives.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 1 }}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
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
              <h2 style={{ fontSize: "2rem", lineHeight: "1.2", fontFamily:"cursive" }} className="mb-6 text-gray-900">Who We Are</h2>
              <p style={{ fontSize: "1rem", lineHeight: "1.2", fontFamily:"cursive" }} className="mb-4 text-gray-600">
                {siteConfig.companyName} is a pioneering development organization committed to
                creating sustainable change in communities across the region. Since our founding,
                we've been at the forefront of community empowerment, social innovation, and
                sustainable development.
              </p>
              <p style={{ fontSize: "1rem", lineHeight: "1.2", fontFamily:"cursive" }} className="mb-6 text-gray-600">
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

{/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2
              style={{ fontSize: "2.3rem", lineHeight: "1.2", fontFamily: "cursive" }}
              className="mb-4 text-gray-900"
            >
              Featured Projects
            </h2>
            <p
              style={{ fontSize: "1.5rem", lineHeight: "1.2", fontFamily: "cursive" }}
              className="text-gray-600"
            >
              Discover our impact across communities through transformative initiatives
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="h-48 w-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-gray-900 text-xl font-semibold">
                      {project.title}
                    </h3>
                    <p className="text-gray-600">{project.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
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
      <section style={{ background: "var(--div-gradient)" }} className="bg-blue-200 py-20 max-w-7xl mx-auto my-8 rounded-2xl">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 style={{ fontSize: "2.5rem", lineHeight: "1.2", fontFamily:"cursive" }} className="mb-4 text-black">Join Our Team</h2>
          <p style={{ fontSize: "1.5rem", lineHeight: "1.2", fontFamily:"cursive" }} className="mb-8 text-black-100">
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
