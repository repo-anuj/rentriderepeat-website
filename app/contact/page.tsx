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
                We're here to help you with any questions about our motorcycle rentals in India.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#contact-form">
                  <Button className="bg-primary hover:bg-primary/90 text-black font-medium">Send a Message</Button>
                </a>
                <a href="tel:+919876543210">
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
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Contact BikeRent"
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
                details: ["+91 98765 43210"],
                action: {
                  text: "Call us",
                  link: "tel:+919876543210",
                },
              },
              {
                icon: <Mail className="h-10 w-10 text-primary" />,
                title: "Email",
                details: ["info@bikerent.in"],
                action: {
                  text: "Email us",
                  link: "mailto:info@bikerent.in",
                },
              },
              {
                icon: <MapPin className="h-10 w-10 text-primary" />,
                title: "Location",
                details: ["123 MG Road, Bangalore, Karnataka, 560001, India"],
                action: {
                  text: "Get directions",
                  link: "https://maps.google.com",
                },
              },
              {
                icon: <Clock className="h-10 w-10 text-primary" />,
                title: "Business Hours",
                details: ["Monday - Saturday: 9:00 AM - 8:00 PM", "Sunday: 10:00 AM - 6:00 PM"],
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
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Have questions about our motorcycle rentals or need assistance planning your trip across India? Fill out the form below and our team will get back to you as soon as possible.
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="font-medium">
                      Full Name
                    </label>
                    <Input id="name" type="text" placeholder="Your name" className="mt-1" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="font-medium">
                      Phone Number
                    </label>
                    <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" className="mt-1" />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="subject" className="font-medium">
                    Subject
                  </label>
                  <select id="subject" className="mt-1">
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Information</option>
                    <option value="support">Customer Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership Opportunities</option>
                  </select>
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
                <p className="text-gray-600">123 MG Road, Bangalore, Karnataka, 560001, India</p>
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
                question: "What documents do I need to rent a motorcycle?",
                answer:
                  "To rent a motorcycle, you'll need a valid driving license, Aadhar card or passport, and a security deposit. International customers will need an International Driving Permit along with their original license.",
              },
              {
                question: "What is your cancellation policy?",
                answer:
                  "We offer free cancellation up to 24 hours before your scheduled rental. Cancellations made less than 24 hours in advance may be subject to a cancellation fee of 25% of the total rental amount.",
              },
              {
                question: "Do you provide helmets and safety gear?",
                answer:
                  "Yes, we provide DOT-certified helmets with all our motorcycle rentals at no additional cost. Additional safety gear such as riding jackets, gloves, and knee guards are available for rent at nominal charges.",
              },
              {
                question: "Can I rent a motorcycle for long-distance travel across India?",
                answer:
                  "Absolutely! Many of our customers rent motorcycles for long-distance travel across India. We offer special packages for popular routes like Delhi-Ladakh, Mumbai-Goa, and the Golden Triangle. Contact us for customized itineraries and recommendations.",
              },
              {
                question: "What happens if the motorcycle breaks down during my rental period?",
                answer:
                  "In the unlikely event of a breakdown, we provide 24/7 roadside assistance across India. Simply call our emergency helpline, and we'll arrange for repairs or a replacement motorcycle as quickly as possible, depending on your location.",
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
              Browse our selection of premium Indian motorcycles and book your rental today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button className="bg-black hover:bg-black/90 text-white font-medium px-8 py-6 text-lg h-auto">
                  Browse Motorcycles
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
