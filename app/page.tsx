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
      title: "Premium Motorcycles",
      description: "High-quality Indian motorcycles for all terrains and preferences.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Safety Guaranteed",
      description: "All motorcycles are regularly maintained and safety-checked.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Flexible Rentals",
      description: "Hourly, daily, or weekly rental options to suit your needs.",
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "Multiple Locations",
      description: "Convenient pickup and drop-off points across India.",
    },
  ]

  const popularBikes = [
    {
      id: 1,
      name: "Royal Enfield Classic 350",
      category: "Cruiser",
      price: 1500,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Bajaj Pulsar NS200",
      category: "Sports",
      price: 1200,
      rating: 4.6,
      image:
        "https://5.imimg.com/data5/SELLER/Default/2022/9/OZ/JU/RL/58085673/bajaj-pulsar-ns200-bike.jpg",
    },
    {
      id: 3,
      name: "KTM Duke 390",
      category: "Sports",
      price: 2000,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "TVS Apache RR 310",
      category: "Sports",
      price: 1800,
      rating: 4.7,
      image:
        "https://bd.gaadicdn.com/processedimages/tvs/tvs-akula-310/640X309/tvs-akula-3105e874b3aa30e0.jpg",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "BikeRent made our family vacation in Goa so much more enjoyable. The motorcycles were in excellent condition and the service was outstanding.",
    },
    {
      name: "Amit Patel",
      location: "Delhi",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "As a motorcycle enthusiast, I appreciate the quality of motorcycles they offer. The rental process was smooth and hassle-free.",
    },
    {
      name: "Priya Sharma",
      location: "Bangalore",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "I rented a Royal Enfield for a week-long trip to Ladakh and it was the perfect companion for the journey. Will definitely use BikeRent again!",
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
                Explore India on Two Wheels
              </h1>
              <p className="text-lg text-gray-600 md:pr-10">
                Premium motorcycle rentals for every adventure. Choose from our wide selection of high-quality Indian motorcycles and start
                your journey today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90 text-black font-medium px-8 py-6 text-lg h-auto">
                    Browse Motorcycles
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
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Premium Motorcycle Rental"
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
              We offer the best motorcycle rental experience with premium Indian motorcycles and exceptional service.
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
              Our Popular Motorcycles
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              Discover our most popular motorcycles for your next adventure
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
                        ₹{bike.price}
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
                View All Motorcycles <ArrowRight className="ml-2 h-4 w-4" />
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
              Renting a motorcycle with us is quick and easy
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Bike className="h-12 w-12 text-primary" />,
                title: "Choose Your Motorcycle",
                description: "Browse our selection of premium Indian motorcycles and choose the one that suits your needs.",
              },
              {
                icon: <Calendar className="h-12 w-12 text-primary" />,
                title: "Book Your Rental",
                description: "Select your rental dates and complete the booking process online.",
              },
              {
                icon: <MapPin className="h-12 w-12 text-primary" />,
                title: "Enjoy Your Ride",
                description: "Pick up your motorcycle at the designated location and start your adventure across India.",
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
            <p className="text-lg text-black/80 mb-8">Book your motorcycle today and explore India on two wheels.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button className="bg-black hover:bg-black/90 text-white font-medium px-8 py-6 text-lg h-auto">
                  Browse Motorcycles
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
            <p className="text-gray-600">We work with the best motorcycle brands in India</p>
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
                {i === 1 && (
                  <div className="h-12 w-32 bg-gray-300 rounded-md flex items-center justify-center">
                    <span className="text-gray-600 font-medium">Royal Enfield</span>
                  </div>
                )}
                {i === 2 && (
                  <div className="h-12 w-32 bg-gray-300 rounded-md flex items-center justify-center">
                    <span className="text-gray-600 font-medium">Bajaj</span>
                  </div>
                )}
                {i === 3 && (
                  <div className="h-12 w-32 bg-gray-300 rounded-md flex items-center justify-center">
                    <span className="text-gray-600 font-medium">KTM</span>
                  </div>
                )}
                {i === 4 && (
                  <div className="h-12 w-32 bg-gray-300 rounded-md flex items-center justify-center">
                    <span className="text-gray-600 font-medium">TVS</span>
                  </div>
                )}
                {i === 5 && (
                  <div className="h-12 w-32 bg-gray-300 rounded-md flex items-center justify-center">
                    <span className="text-gray-600 font-medium">Honda</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
