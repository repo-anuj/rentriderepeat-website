"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Search, Filter, Star, Bike, ChevronDown } from "lucide-react"

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])

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
        staggerChildren: 0.1,
      },
    },
  }

  const bikes = [
    {
      id: 1,
      name: "Royal Enfield Classic 350",
      category: "Cruiser",
      price: 1500,
      rating: 4.8,
      features: ["Comfortable Seat", "Powerful Engine", "Vintage Design", "Fuel Efficient"],
      image:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Bajaj Pulsar NS200",
      category: "Sports",
      price: 1200,
      rating: 4.6,
      features: ["Sporty Design", "Powerful Engine", "Disc Brakes", "Digital Console"],
      image:
        "https://images.unsplash.com/photo-1609778269131-b74448db6d3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "KTM Duke 390",
      category: "Sports",
      price: 2000,
      rating: 4.9,
      features: ["Aggressive Design", "Powerful Engine", "Advanced ABS", "LED Lights"],
      image:
        "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "TVS Apache RR 310",
      category: "Sports",
      price: 1800,
      rating: 4.7,
      features: ["Racing Design", "Powerful Engine", "Dual Channel ABS", "Slipper Clutch"],
      image:
        "https://images.unsplash.com/photo-1635073902132-a35c64035146?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Honda CB350",
      category: "Cruiser",
      price: 1400,
      rating: 4.5,
      features: ["Retro Design", "Smooth Engine", "LED Lights", "Digital-Analog Console"],
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      name: "Yamaha MT-15",
      category: "Naked",
      price: 1300,
      rating: 4.4,
      features: ["Aggressive Styling", "Powerful Engine", "LED Headlamp", "Digital Console"],
      image:
        "https://images.unsplash.com/photo-1611241443322-78b19f75ea6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      name: "Suzuki Gixxer SF",
      category: "Sports",
      price: 1250,
      rating: 4.3,
      features: ["Sporty Design", "Smooth Engine", "LED Lights", "Split Seats"],
      image:
        "https://images.unsplash.com/photo-1622185135505-2d795003994a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 8,
      name: "Royal Enfield Himalayan",
      category: "Adventure",
      price: 1600,
      rating: 4.7,
      features: ["Off-Road Capability", "Long Travel Suspension", "Luggage Mounts", "Digital Compass"],
      image:
        "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ]

  const categories = [
    { name: "All", value: "all" },
    { name: "Cruiser", value: "cruiser" },
    { name: "Sports", value: "sports" },
    { name: "Naked", value: "naked" },
    { name: "Adventure", value: "adventure" },
  ]

  const filteredBikes = bikes.filter(
    (bike) =>
      (!selectedCategory || selectedCategory === "all" || bike.category === selectedCategory) &&
      bike.price >= priceRange[0] &&
      bike.price <= priceRange[1],
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Our Motorcycles</h1>
            <p className="text-lg text-gray-600">
              Explore our wide selection of premium Indian motorcycles for rent
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input type="text" placeholder="Search for motorcycles..." className="w-full pr-10 py-6 text-lg" />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/4 space-y-8"
            >
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" /> Filters
                </h3>

                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-3">Bike Type</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.value} className="flex items-center">
                          <input
                            type="radio"
                            id={category.value}
                            name="category"
                            checked={selectedCategory === category.value}
                            onChange={() => setSelectedCategory(category.value)}
                            className="h-4 w-4 text-primary focus:ring-primary"
                          />
                          <label htmlFor={category.value} className="ml-2 text-gray-700">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">Price Range (₹/day)</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h4 className="font-medium mb-3">Availability</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="available-now" className="h-4 w-4 text-primary focus:ring-primary" />
                        <label htmlFor="available-now" className="ml-2 text-gray-700">
                          Available Now
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-black">Apply Filters</Button>
                </div>
              </div>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                <p className="text-gray-700 mb-4">
                  Our team is here to help you find the perfect motorcycle for your adventure.
                </p>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">{filteredBikes.length} motorcycles found</p>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-700">Sort by:</span>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:ring-primary focus:border-primary">
                      <option>Popularity</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Rating</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredBikes.map((bike) => (
                  <motion.div
                    key={bike.id}
                    variants={fadeIn}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                  >
                    <Link href={`/products/${bike.id}`}>
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={bike.image || "/placeholder.svg"}
                          alt={bike.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 bg-primary text-black text-sm font-bold px-2 py-1 rounded">
                          ₹{bike.price}/day
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-lg text-black font-bold">{bike.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-primary mr-1" />
                            <span className="text-sm font-medium">{bike.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{bike.category}</p>
                        <p className="text-gray-700 text-sm mb-4">{bike.features.join(", ")}</p>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-black">View Details</Button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {filteredBikes.length === 0 && (
                <div className="text-center py-12">
                  <Bike className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No motorcycles found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters to find what you're looking for.</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory(null)
                      setPriceRange([0, 2000])
                    }}
                    className="bg-primary hover:bg-primary/90 text-black"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Can't Find What You're Looking For?</h2>
            <p className="text-lg text-black/80 mb-8">
              Contact us with your specific motorcycle requirements and we'll help you find the perfect ride.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login">
                <Button className="bg-black hover:bg-black/90 text-white font-medium px-8 py-6 text-lg h-auto">
                  Rent Now
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
