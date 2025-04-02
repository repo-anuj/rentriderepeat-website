"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Bike, Shield, Clock, MapPin, Star, Calendar } from "lucide-react"

export default function Home() {
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

  const features = [
    {
      icon: <Bike className="h-10 w-10 text-primary" />,
      title: "Premium Bikes",
      description: "High-quality bikes for all terrains and preferences.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Safety Guaranteed",
      description: "All bikes are regularly maintained and safety-checked.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Flexible Rentals",
      description: "Hourly, daily, or weekly rental options to suit your needs.",
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "Multiple Locations",
      description: "Convenient pickup and drop-off points across the city.",
    },
  ]

  const popularBikes = [
    {
      id: 1,
      name: "Mountain Explorer Pro",
      category: "Mountain Bike",
      price: 25,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "City Cruiser Deluxe",
      category: "City Bike",
      price: 18,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Road Master Elite",
      category: "Road Bike",
      price: 30,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "Electric Glide 3000",
      category: "Electric Bike",
      price: 35,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "BikeRent made our family vacation so much more enjoyable. The bikes were in excellent condition and the service was outstanding.",
    },
    {
      name: "Michael Chen",
      location: "San Francisco",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "As a cycling enthusiast, I appreciate the quality of bikes they offer. The rental process was smooth and hassle-free.",
    },
    {
      name: "Emily Rodriguez",
      location: "Chicago",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "I rented an electric bike for a week and it was the perfect way to explore the city. Will definitely use BikeRent again!",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <h1 className="text-4xl md:text-5xl text-black lg:text-6xl font-bold leading-tight">
                Explore the World on Two Wheels
              </h1>
              <p className="text-lg text-gray-600 md:pr-10">
                Premium bike rentals for every adventure. Choose from our wide selection of high-quality bikes and start
                your journey today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90 text-black font-medium px-8 py-6 text-lg h-auto">
                    Browse Bikes
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="font-medium px-8 py-6 text-lg h-auto">
                    Rent Now <ArrowRight className="ml-2 h-5 w-5" />
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
                src="https://images.unsplash.com/photo-1571333250630-f0230c320b6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Premium Bike Rental"
                width={600}
                height={500}
                className="rounded-lg shadow-xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl text-black md:text-4xl font-bold mb-4">
              Why Choose BikeRent
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              We offer the best bike rental experience with premium bikes and exceptional service.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:border-primary transition-colors duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Bikes Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl text-black md:text-4xl font-bold mb-4">
              Our Popular Bikes
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              Discover our most popular bikes for your next adventure
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {popularBikes.map((bike, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link href={`/products/${bike.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={bike.image || "/placeholder.svg"}
                      alt={bike.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{bike.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-primary mr-1" />
                        <span className="text-sm font-medium">{bike.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{bike.category}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold">
                        ${bike.price}
                        <span className="text-sm font-normal text-gray-600">/day</span>
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary border-primary hover:bg-primary hover:text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/products">
              <Button variant="outline" className="font-medium">
                View All Bikes <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl text-black md:text-4xl font-bold mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              Renting a bike with us is quick and easy
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Bike className="h-12 w-12 text-primary" />,
                title: "Choose Your Bike",
                description: "Browse our selection of premium bikes and choose the one that suits your needs.",
              },
              {
                icon: <Calendar className="h-12 w-12 text-primary" />,
                title: "Book Your Rental",
                description: "Select your rental dates and complete the booking process online.",
              },
              {
                icon: <MapPin className="h-12 w-12 text-primary" />,
                title: "Enjoy Your Ride",
                description: "Pick up your bike at the designated location and start your adventure.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center"
              >
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                <div className="mt-6">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-black font-bold">
                    {index + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl text-black md:text-4xl font-bold mb-4">
              What Our Customers Say
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              Don't just take our word for it. Here's what our customers have to say about their experience.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-primary" />
                  ))}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Ready for Your Next Adventure?</h2>
            <p className="text-lg text-black/80 mb-8">Book your bike today and explore the world on two wheels.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button className="bg-black hover:bg-black/90 text-white font-medium px-8 py-6 text-lg h-auto">
                  Browse Bikes
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="bg-white text-black border-black hover:bg-gray-100 font-medium px-8 py-6 text-lg h-auto"
                >
                  Rent Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl text-black font-bold mb-2">Our Trusted Partners</h2>
            <p className="text-gray-600">We work with the best brands in the cycling industry</p>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <div className="h-12 w-32 bg-gray-300 rounded-md flex items-center justify-center">
                  <span className="text-gray-600 font-medium">Brand {i}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

