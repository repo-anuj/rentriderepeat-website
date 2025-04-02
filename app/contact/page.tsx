"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { ArrowRight, Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function Contact() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    alert("Form submitted! In a real application, this would send your message to our team.")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">Contact Us</h1>
              <p className="text-lg text-gray-600">
                Have questions about our bikes or rental process? Get in touch with our team and we'll get back to you
                as soon as possible.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#contact-form">
                  <Button className="bg-primary hover:bg-primary/90 text-black font-medium">Send a Message</Button>
                </a>
                <a href="tel:+11234567890">
                  <Button variant="outline" className="font-medium">
                    Call Us <Phone className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <Image
                src="/joyful boy riding on scooter.svg"
                alt="Contact Us"
                width={600}
                height={500}
                className="rounded-lg shadow-xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              We're here to help and answer any questions you might have about our bike rentals.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <Phone className="h-10 w-10 text-primary" />,
                title: "Phone",
                details: ["+1 (123) 456-7890", "+1 (987) 654-3210"],
                action: {
                  text: "Call us",
                  link: "tel:+11234567890",
                },
              },
              {
                icon: <Mail className="h-10 w-10 text-primary" />,
                title: "Email",
                details: ["info@bikerent.com", "support@bikerent.com"],
                action: {
                  text: "Email us",
                  link: "mailto:info@bikerent.com",
                },
              },
              {
                icon: <MapPin className="h-10 w-10 text-primary" />,
                title: "Location",
                details: ["123 Bike Street", "Cycle City, CC 12345"],
                action: {
                  text: "Get directions",
                  link: "https://maps.google.com",
                },
              },
              {
                icon: <Clock className="h-10 w-10 text-primary" />,
                title: "Business Hours",
                details: ["Monday - Friday: 9AM - 6PM", "Saturday - Sunday: 10AM - 4PM"],
                action: {
                  text: "View hours",
                  link: "#business-hours",
                },
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <div className="space-y-1 mb-4">
                  {item.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">
                      {detail}
                    </p>
                  ))}
                </div>
                <a
                  href={item.action.link}
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  {item.action.text} <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Send Us a Message</h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">What happens next?</h3>
                <ol className="space-y-4">
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-black font-bold mr-3">
                      1
                    </span>
                    <div>
                      <h4 className="font-bold">We'll contact you</h4>
                      <p className="text-gray-600">Our representative will reach out within 24 hours</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-black font-bold mr-3">
                      2
                    </span>
                    <div>
                      <h4 className="font-bold">Discuss your needs</h4>
                      <p className="text-gray-600">We'll help you find the perfect bike for your adventure</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-black font-bold mr-3">
                      3
                    </span>
                    <div>
                      <h4 className="font-bold">Book your rental</h4>
                      <p className="text-gray-600">We'll reserve your bike and prepare it for pickup</p>
                    </div>
                  </li>
                </ol>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-100"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="font-medium">
                      Full Name
                    </label>
                    <Input id="name" type="text" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="font-medium">
                      Email Address
                    </label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="font-medium">
                      Phone Number
                    </label>
                    <Input id="phone" type="tel" placeholder="+1 (123) 456-7890" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="font-medium">
                      Subject
                    </label>
                    <Input id="subject" type="text" placeholder="Bike Rental Inquiry" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your rental needs or questions..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-black font-medium">
                  Send Message <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              Visit Our Rental Locations
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              We have multiple rental locations for your convenience.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-lg overflow-hidden shadow-lg h-[400px] bg-gray-200"
          >
            {/* Placeholder for map - in a real application, you would embed a Google Map or similar here */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold">BikeRent Main Location</h3>
                <p className="text-gray-600">123 Bike Street, Cycle City, CC 12345</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600">
              Find answers to common questions about our bike rentals.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            {[
              {
                question: "What types of bikes do you offer?",
                answer:
                  "We offer a wide range of bikes including mountain bikes, road bikes, city bikes, electric bikes, and hybrid bikes. All our bikes are premium quality and regularly maintained.",
              },
              {
                question: "What is the rental process?",
                answer:
                  "The rental process is simple: browse our selection online, choose your bike, select your rental dates, complete the booking, and pick up your bike at the designated location. You'll need to provide a valid ID and credit card for the security deposit.",
              },
              {
                question: "What are your rental rates?",
                answer:
                  "Our rental rates vary depending on the type of bike and rental duration. We offer hourly, daily, and weekly rates with discounts for longer rentals. Check our bike listings for specific pricing.",
              },
              {
                question: "Do you provide helmets and other accessories?",
                answer:
                  "Yes, we provide helmets free of charge with every rental. We also offer additional accessories such as locks, lights, baskets, and child seats for a small fee.",
              },
              {
                question: "What happens if the bike gets damaged or stolen?",
                answer:
                  "We provide basic insurance with every rental. For minor damages, you may be charged a repair fee. For theft, you'll need to file a police report and may be responsible for the deductible. We offer premium insurance options for additional coverage.",
              },
            ].map((faq, index) => (
              <motion.div key={index} variants={fadeIn} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
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
              <a href="#contact-form">
                <Button
                  variant="outline"
                  className="bg-white text-black border-black hover:bg-gray-100 font-medium px-8 py-6 text-lg h-auto"
                >
                  Contact Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

