"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Award, Clock, Users, Target, Bike } from "lucide-react"

export default function About() {
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

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "With over 15 years of experience in the cycling industry, Alex leads our company vision and strategy.",
    },
    {
      name: "Samantha Lee",
      role: "Operations Manager",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "Samantha oversees our rental operations and ensures every bike is maintained to the highest standards.",
    },
    {
      name: "David Chen",
      role: "Fleet Manager",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "David manages our bike fleet and ensures all bikes are in perfect condition for our customers.",
    },
    {
      name: "Maria Rodriguez",
      role: "Customer Experience Manager",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "Maria ensures every customer has an exceptional experience from booking to return.",
    },
  ]

  const stats = [
    { value: "10+", label: "Years of Experience", icon: <Clock className="h-8 w-8 text-primary" /> },
    { value: "500+", label: "Premium Bikes", icon: <Bike className="h-8 w-8 text-primary" /> },
    { value: "25+", label: "Team Members", icon: <Users className="h-8 w-8 text-primary" /> },
    { value: "10k+", label: "Happy Customers", icon: <Award className="h-8 w-8 text-primary" /> },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">About BikeRent</h1>
              <p className="text-lg text-gray-600">
                We're passionate about cycling and committed to providing the best bike rental experience for our
                customers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary/90 text-black font-medium">Contact Us</Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="font-medium">
                    Our Bikes <ArrowRight className="ml-2 h-4 w-4" />
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
                src="/white car top view.svg"
                alt="About BikeRent"
                width={600}
                height={500}
                className="rounded-lg shadow-xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-2 md:order-1"
            >
              <Image
                src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Our bike rental shop"
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
              className="space-y-6 order-1 md:order-2"
            >
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
                Our Story
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-gray-600">
                Founded in 2013, BikeRent began with a simple mission: to share our passion for cycling and make quality
                bikes accessible to everyone. What started as a small shop with just 10 bikes has grown into a premier
                bike rental service.
              </motion.p>
              <motion.p variants={fadeIn} className="text-lg text-gray-600">
                Over the years, we've helped thousands of customers explore cities, conquer mountains, and enjoy the
                freedom that comes with cycling. Our commitment to quality, safety, and customer satisfaction has made
                us the preferred choice for bike rentals.
              </motion.p>
              <motion.p variants={fadeIn} className="text-lg text-gray-600">
                Today, we continue to expand our fleet with the latest models and technologies, ensuring our customers
                always have access to the best bikes for their adventures.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              BikeRent by the Numbers
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              We're proud of what we've accomplished and the difference we've made for our customers.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center"
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold mb-2 text-primary">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-100"
            >
              <div className="mb-4">
                <Target className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide high-quality bike rentals that enable people to explore, exercise, and enjoy the freedom of
                cycling in a safe and sustainable way.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Provide well-maintained, premium bikes",
                  "Ensure exceptional customer service",
                  "Promote cycling as a sustainable mode of transportation",
                  "Make cycling accessible to everyone",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-100"
            >
              <div className="mb-4">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading bike rental service known for quality, reliability, and exceptional customer
                experiences, inspiring more people to embrace cycling.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Expand our presence to more locations",
                  "Continuously update our fleet with the latest models",
                  "Implement eco-friendly practices",
                  "Build a community of cycling enthusiasts",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              The passionate people behind BikeRent
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div key={index} variants={fadeIn} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Ready to Start Your Adventure?</h2>
            <p className="text-lg text-black/80 mb-8">
              Browse our selection of premium bikes and book your rental today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button className="bg-black hover:bg-black/90 text-white font-medium px-8 py-6 text-lg h-auto">
                  Browse Bikes
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

