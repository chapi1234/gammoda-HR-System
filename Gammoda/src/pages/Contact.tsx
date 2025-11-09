import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import SEO from "../components/SEO";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { siteConfig } from "../config/siteConfig";
import { toast } from "sonner";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await emailjs.send(
        "service_lzka8js", // from EmailJS
        "template_3y1mtta", // from EmailJS
        {
          from_name: formData.from_name,
          from_email: formData.from_email,
          subject: formData.subject,
          message: formData.message,
        },
        "jh27s20mFp_qHZi4W" // from EmailJS
      );

      console.log("Email sent successfully:", result.text);
      toast.success("Message sent successfully! We'll get back to you soon.");

      setFormData({ from_name: "", from_email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <SEO title="Contact Us" description={`Get in touch with ${siteConfig.companyName}.`} />
      <motion.section
        style={{ background: "var(--hero-gradient)" }}
        className="relative py-20 lg:py-32 flex items-center"
        initial={{ opacity: 0, y: 50 }}   // initial entrance
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {/* Title with vertical floating motion */}
            <motion.h1
              style={{
                fontSize: "3rem",
                lineHeight: "1.2",
                fontFamily: "sanserif",
              }}
              className="mb-6 text-gray-900"
              animate={{
                y: [0, -10, 0, 10, 0], // gentle vertical float
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2, // start after initial entrance
              }}
            >
              Contact Us
            </motion.h1>

            {/* Description with horizontal floating motion */}
            <motion.p
              style={{
                fontSize: "1.5rem",
                lineHeight: "1.2",
                fontFamily: "sanserif",
              }}
              className="mb-8 text-gray-600 text-lg"
              animate={{
                x: [0, 10, 0, -10, 0], // side-to-side float
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            >
              Have questions or want to learn more about our work? We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 style={{ fontSize: "2rem", lineHeight: "1.2", fontFamily:"sanserif" }} className="mb-6 text-gray-900">Get in Touch</h2>
              <p style={{ fontSize: "1rem", lineHeight: "1.2", fontFamily:"sanserif" }} className="mb-8 text-gray-600">
                Whether you're interested in partnering with us, joining our team, or learning
                more about our projects, we're here to help.
              </p>

              <div className="space-y-6">
                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-gray-900">Office Address</h3>
                      <p className="text-gray-600">{siteConfig.address}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-gray-900">Phone</h3>
                      <a href={`tel:${siteConfig.phone}`} className="text-blue-600 hover:underline">
                        {siteConfig.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-gray-900">Email</h3>
                      <a href={`mailto:${siteConfig.email}`} className="text-blue-600 hover:underline">
                        {siteConfig.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <h3 style={{ fontSize: "1.5rem", lineHeight: "1.2", fontFamily:"sanserif" }} className="mb-4 text-gray-900">Office Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h2 className="mb-6 text-gray-900">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="from_name"
                        type="text"
                        required
                        value={formData.from_name}
                        onChange={handleChange}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="from_email"
                        type="email"
                        required
                        value={formData.from_email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                      />
                    </div>

                    <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
