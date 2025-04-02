"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Bike,
  Map,
  Users,
  Shield,
  Wrench,
  ShoppingBag,
  CheckCircle,
  Search,
  ArrowRight,
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
      icon: <Bike className="h-12 w-12 text-primary" />,
      title: "Motorcycle Rentals",
      description:
        "Choose from our wide selection of premium Indian motorcycles for daily, weekly, or monthly rentals. All motorcycles are regularly maintained and safety-checked.",
      features: [
        "Wide selection of premium Indian motorcycles",
        "Daily, weekly, or monthly rentals available",
        "Regular maintenance and safety checks",
      ],
    },
    {
      icon: <Map className="h-12 w-12 text-primary" />,
      title: "Guided Tours",
      description:
        "Explore the diverse landscapes of India with our experienced guides. We offer guided motorcycle tours to popular destinations like Ladakh, Rajasthan, Kerala, and the Northeast.",
      features: [
        "Experienced guides",
        "Popular destinations like Ladakh, Rajasthan, Kerala, and the Northeast",
        "Scenic routes and breathtaking views",
      ],
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Group Rides",
      description:
        "Join our community of motorcycle enthusiasts for regular group rides to scenic locations around major Indian cities. Perfect for meeting fellow riders and discovering new routes.",
      features: [
        "Regular group rides to scenic locations",
        "Meet fellow riders and discover new routes",
        "Experienced guides and safety support",
      ],
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Motorcycle Insurance",
      description:
        "Comprehensive insurance coverage for your rental period, giving you peace of mind during your journey across India's diverse terrains.",
      features: [
        "Comprehensive insurance coverage",
        "Peace of mind during your journey",
        "Coverage for accidents and damages",
      ],
    },
    {
      icon: <Wrench className="h-12 w-12 text-primary" />,
      title: "Maintenance & Repairs",
      description:
        "Professional motorcycle maintenance and repair services to ensure your ride is always in optimal condition. Available at all our locations across India.",
      features: [
        "Professional maintenance and repair services",
        "Optimal condition for your ride",
        "Available at all our locations across India",
      ],
    },
    {
      icon: <ShoppingBag className="h-12 w-12 text-primary" />,
      title: "Riding Gear & Accessories",
      description:
        "Quality riding gear and accessories for rent or purchase, including helmets, jackets, gloves, and luggage solutions for long rides through India.",
      features: [
        "Quality riding gear and accessories",
        "Rent or purchase options",
        "Helmets, jackets, gloves, and luggage solutions",
      ],
    },
  ]

  const packages = [
    {
      title: "Himalayan Adventure",
      price: 15000,
      duration: "7 days",
      description: "Experience the majestic Himalayas on a thrilling 7-day motorcycle adventure through breathtaking mountain passes and serene valleys.",
      features: [
        "Royal Enfield Himalayan motorcycle",
        "Experienced guide",
        "Accommodation in mountain lodges",
        "Fuel and maintenance",
        "Support vehicle",
        "Safety gear",
      ],
      popular: true,
      image: "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Golden Triangle Tour",
      price: 12000,
      duration: "5 days",
      description: "Explore India's iconic Golden Triangle on motorcycle, visiting the historic cities of Delhi, Agra, and Jaipur with their magnificent architecture and rich culture.",
      features: [
        "Choice of premium motorcycle",
        "Guided tour of Delhi, Agra, and Jaipur",
        "Hotel accommodations",
        "Fuel and maintenance",
        "Monument entry fees",
        "Safety gear",
      ],
      popular: false,
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Coastal Karnataka Ride",
      price: 10000,
      duration: "4 days",
      description: "Ride along the stunning coastline of Karnataka, experiencing pristine beaches, historic temples, and delicious coastal cuisine on this 4-day motorcycle journey.",
      features: [
        "Choice of premium motorcycle",
        "Route map and guidance",
        "Beachside accommodations",
        "Fuel and maintenance",
        "Breakfast included",
        "Safety gear",
      ],
      popular: false,
      image: "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ]

  const testimonials = [
    {
      name: "Rahul Sharma",
      location: "Delhi",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "The Himalayan Adventure tour was the experience of a lifetime. The motorcycles were in excellent condition, and the guides were knowledgeable and friendly. I'll definitely be booking another tour soon!",
    },
    {
      name: "Ananya Patel",
      location: "Mumbai",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "I rented a Royal Enfield for a weekend trip to Lonavala, and the service was outstanding. The motorcycle was well-maintained, and the team was very helpful with route suggestions and tips.",
    },
    {
      name: "Karthik Reddy",
      location: "Bangalore",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "The Coastal Karnataka Ride package was perfect for our group. The routes were scenic, the accommodations were comfortable, and the motorcycles performed flawlessly throughout the journey.",
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
                Discover our comprehensive range of motorcycle rental services and tour packages across India
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
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Motorcycle Rental Services"
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
            <motion.h2 variants={fadeIn} className="text-3xl text-black md:text-4xl font-bold mb-4">
              Our Services
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              We offer a wide range of motorcycle rental services and tour packages to meet your needs
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
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

      {/* Packages Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl text-black md:text-4xl font-bold mb-4">
              Popular Tour Packages
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              Explore India on two wheels with our curated motorcycle tour packages
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:border-primary transition-colors duration-300"
              >
                <div className="mb-4">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    width={400}
                    height={300}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <p className="text-xl font-bold">
                  ₹{pkg.price}
                  <span className="text-sm font-normal text-gray-600">/{pkg.duration}</span>
                </p>
                <ul className="space-y-2">
                  {pkg.features.map((feature, idx) => (
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

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
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
              Don't just take our word for it - hear from our satisfied customers
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:border-primary transition-colors duration-300"
              >
                <div className="mb-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={100}
                    height={100}
                    className="rounded-full shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{testimonial.name}</h3>
                <p className="text-gray-600 mb-4">{testimonial.quote}</p>
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
              Browse our selection of premium Indian motorcycles and book your rental today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login">
                <Button className="bg-black hover:bg-black/90 text-white font-medium px-8 py-6 text-lg h-auto">
                  Browse Motorcycles
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
