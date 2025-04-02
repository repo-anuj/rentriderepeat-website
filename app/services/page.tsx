"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle,
  Smartphone,
  Globe,
  PenTool,
  BarChart,
  Code,
  Database,
  Cloud,
  ShoppingCart,
} from "lucide-react"

export default function Services() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const services = [
    {
      icon: <Smartphone className="h-12 w-12 text-primary" />,
      title: "Mobile App Development",
      description:
        "Custom mobile applications for iOS and Android platforms that engage users and drive business growth.",
      features: [
        "Native and cross-platform development",
        "User-centered design approach",
        "Seamless integration with existing systems",
        "Ongoing support and maintenance",
      ],
    },
    {
      icon: <Globe className="h-12 w-12 text-primary" />,
      title: "Web Development",
      description:
        "Responsive, high-performance websites and web applications that deliver exceptional user experiences.",
      features: [
        "Custom website development",
        "E-commerce solutions",
        "Content management systems",
        "Progressive web applications",
      ],
    },
    {
      icon: <PenTool className="h-12 w-12 text-primary" />,
      title: "UI/UX Design",
      description: "User-centered design that enhances user experience, engagement, and conversion rates.",
      features: [
        "User research and testing",
        "Wireframing and prototyping",
        "Visual design and branding",
        "Interaction design",
      ],
    },
    {
      icon: <BarChart className="h-12 w-12 text-primary" />,
      title: "Digital Marketing",
      description: "Strategic marketing solutions to grow your online presence and reach your target audience.",
      features: [
        "Search engine optimization (SEO)",
        "Social media marketing",
        "Pay-per-click advertising",
        "Email marketing campaigns",
      ],
    },
    {
      icon: <Code className="h-12 w-12 text-primary" />,
      title: "Custom Software Development",
      description:
        "Tailored software solutions designed to address your specific business challenges and requirements.",
      features: [
        "Enterprise software development",
        "SaaS application development",
        "API development and integration",
        "Legacy system modernization",
      ],
    },
    {
      icon: <Database className="h-12 w-12 text-primary" />,
      title: "Data Analytics",
      description: "Transform your data into actionable insights that drive informed business decisions.",
      features: [
        "Data visualization and reporting",
        "Predictive analytics",
        "Business intelligence solutions",
        "Big data processing",
      ],
    },
    {
      icon: <Cloud className="h-12 w-12 text-primary" />,
      title: "Cloud Solutions",
      description: "Scalable, secure cloud infrastructure and migration services to optimize your operations.",
      features: [
        "Cloud migration strategies",
        "Infrastructure as a Service (IaaS)",
        "Platform as a Service (PaaS)",
        "Cloud security and compliance",
      ],
    },
    {
      icon: <ShoppingCart className="h-12 w-12 text-primary" />,
      title: "E-Commerce Solutions",
      description: "End-to-end e-commerce development to help you sell products and services online effectively.",
      features: [
        "Custom e-commerce platforms",
        "Shopping cart development",
        "Payment gateway integration",
        "Inventory management systems",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">Our Services</h1>
              <p className="text-lg text-gray-600">
                Comprehensive digital solutions tailored to your business needs. We help you navigate the digital
                landscape with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login">
                  <Button className="bg-primary hover:bg-primary/90 text-black font-medium">Get Started</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="font-medium">
                    Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <Image
                src="/Service.svg"
                alt="Our Services"
                width={600}
                height={500}
                className="rounded-lg shadow-xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              What We Offer
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              We provide a wide range of digital services to help your business thrive in the digital age.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.slice(0, 6).map((service, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:border-primary transition-colors duration-300"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              Our Process
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              We follow a structured approach to ensure successful project delivery and client satisfaction.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Image
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Our process"
                width={600}
                height={450}
                className="rounded-lg shadow-lg"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              {[
                {
                  number: "01",
                  title: "Discovery & Planning",
                  description:
                    "We start by understanding your business, goals, and requirements to develop a strategic plan.",
                },
                {
                  number: "02",
                  title: "Design & Development",
                  description:
                    "Our team creates designs and develops solutions based on the approved plan and specifications.",
                },
                {
                  number: "03",
                  title: "Testing & Quality Assurance",
                  description: "We thoroughly test all deliverables to ensure they meet our high standards of quality.",
                },
                {
                  number: "04",
                  title: "Deployment & Support",
                  description:
                    "We deploy the solution and provide ongoing support and maintenance to ensure continued success.",
                },
              ].map((step, index) => (
                <motion.div key={index} variants={fadeIn} className="flex">
                  <div className="mr-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-black font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              Specialized Solutions
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              Additional services tailored to specific industry needs and challenges.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {services.slice(6, 8).map((service, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:border-primary transition-colors duration-300"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              Industries We Serve
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              We have experience working with clients across various industries.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
          >
            {[
              { name: "Healthcare", icon: "🏥" },
              { name: "Finance", icon: "💰" },
              { name: "Education", icon: "🎓" },
              { name: "Retail", icon: "🛍️" },
              { name: "Technology", icon: "💻" },
              { name: "Manufacturing", icon: "🏭" },
            ].map((industry, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 text-center hover:border-primary transition-colors duration-300"
              >
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="font-bold">{industry.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Ready to Get Started?</h2>
            <p className="text-lg text-black/80 mb-8">
              Contact us today to discuss your project and how we can help you achieve your digital goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login">
                <Button className="bg-black hover:bg-black/90 text-white font-medium px-8 py-6 text-lg h-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="bg-white text-black border-black hover:bg-gray-100 font-medium px-8 py-6 text-lg h-auto"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

