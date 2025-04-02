"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { ArrowRight, Star, Calendar, Clock, Shield, ChevronRight, Check } from "lucide-react"

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [selectedDate, setSelectedDate] = useState<string>("")
  const [rentalDuration, setRentalDuration] = useState<number>(1)

  const bikes = [
    {
      id: 1,
      name: "Mountain Explorer Pro",
      category: "Mountain Bike",
      price: 25,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description:
        "The Mountain Explorer Pro is a high-performance mountain bike designed for challenging terrains and thrilling adventures. With its durable frame, responsive suspension, and reliable braking system, this bike offers exceptional control and stability on rough trails.",
      features: [
        "Lightweight aluminum frame",
        "Front and rear suspension",
        "Hydraulic disc brakes",
        "27-speed Shimano gears",
        "Tubeless-ready wheels",
        "Adjustable seat post",
      ],
      specifications: {
        frame: "Aluminum Alloy",
        fork: "RockShox XC 30",
        gears: "Shimano Deore, 27-speed",
        brakes: "Shimano Hydraulic Disc",
        wheels: "29-inch tubeless-ready",
        weight: "12.5 kg",
      },
    },
    {
      id: 2,
      name: "City Cruiser Deluxe",
      category: "City Bike",
      price: 18,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description:
        "The City Cruiser Deluxe is a comfortable and stylish bike perfect for urban exploration and daily commuting. Its upright riding position, smooth-rolling tires, and practical features make it ideal for navigating city streets with ease and elegance.",
      features: [
        "Step-through frame design",
        "7-speed internal hub gears",
        "Front basket included",
        "Integrated LED lights",
        "Comfortable gel saddle",
        "Full fenders and chain guard",
      ],
      specifications: {
        frame: "Steel frame",
        fork: "Rigid steel fork",
        gears: "Shimano Nexus 7-speed",
        brakes: "V-brakes",
        wheels: "700c with puncture protection",
        weight: "14 kg",
      },
    },
    {
      id: 3,
      name: "Road Master Elite",
      category: "Road Bike",
      price: 30,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description:
        "The Road Master Elite is a high-performance road bike designed for speed enthusiasts and serious cyclists. Its aerodynamic design, lightweight carbon frame, and precision components deliver an exceptional riding experience on paved roads and smooth surfaces.",
      features: [
        "Full carbon fiber frame",
        "Carbon fork with tapered steerer",
        "22-speed Shimano Ultegra groupset",
        "Hydraulic disc brakes",
        "Aero carbon wheelset",
        "Internal cable routing",
      ],
      specifications: {
        frame: "Carbon Fiber",
        fork: "Carbon Fiber",
        gears: "Shimano Ultegra, 22-speed",
        brakes: "Shimano Ultegra Hydraulic Disc",
        wheels: "Carbon clincher, 700c",
        weight: "8.2 kg",
      },
    },
    {
      id: 4,
      name: "Electric Glide 3000",
      category: "Electric Bike",
      price: 35,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description:
        "The Electric Glide 3000 is a premium electric bike that combines power, comfort, and style. With its powerful motor, long-lasting battery, and thoughtful design, this e-bike makes cycling effortless and enjoyable, whether you're commuting, touring, or just riding for pleasure.",
      features: [
        "500W brushless hub motor",
        "Removable 48V 14Ah battery",
        "Range of up to 80 miles",
        "Integrated LCD display",
        "5 levels of pedal assist",
        "Front suspension fork",
      ],
      specifications: {
        frame: "Aluminum Alloy",
        fork: "Suspension fork with lockout",
        gears: "Shimano 8-speed",
        brakes: "Hydraulic disc brakes",
        wheels: "27.5-inch with puncture protection",
        weight: "22 kg (including battery)",
      },
    },
  ]

  const bike = bikes.find((b) => b.id === id)

  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bike not found</h1>
          <p className="mb-6">The bike you're looking for doesn't exist or has been removed.</p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90 text-black">Browse All Bikes</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleRentNow = () => {
    if (!selectedDate) {
      alert("Please select a rental date")
      return
    }

    // Navigate to checkout with bike details
    router.push(`/checkout?id=${bike.id}&date=${selectedDate}&days=${rentalDuration}`)
  }

  const relatedBikes = bikes.filter((b) => b.category === bike.category && b.id !== bike.id).slice(0, 3)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/products" className="hover:text-primary">
              Bikes
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">{bike.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="relative h-[400px] rounded-lg overflow-hidden mb-4">
                <Image src={bike.image || "/placeholder.svg"} alt={bike.name} fill className="object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="relative h-24 rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-colors"
                  >
                    <Image
                      src={bike.image || "/placeholder.svg"}
                      alt={`${bike.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                    {bike.category}
                  </span>
                  <div className="flex items-center ml-4">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="ml-1 text-sm font-medium">{bike.rating} (120 reviews)</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{bike.name}</h1>
                <p className="text-2xl font-bold text-primary mt-2">
                  ${bike.price}
                  <span className="text-sm font-normal text-gray-600">/day</span>
                </p>
              </div>

              <p className="text-gray-700">{bike.description}</p>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {bike.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-b border-gray-200 py-6 space-y-4">
                <h3 className="text-lg font-bold">Book Your Rental</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rental-date" className="block text-sm font-medium mb-1">
                      Rental Start Date
                    </label>
                    <Input
                      id="rental-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="rental-duration" className="block text-sm font-medium mb-1">
                      Duration (Days)
                    </label>
                    <select
                      id="rental-duration"
                      value={rentalDuration}
                      onChange={(e) => setRentalDuration(Number(e.target.value))}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 14, 30].map((days) => (
                        <option key={days} value={days}>
                          {days} {days === 1 ? "day" : "days"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>
                      Bike Rental ({rentalDuration} {rentalDuration === 1 ? "day" : "days"})
                    </span>
                    <span>${(bike.price * rentalDuration).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Insurance</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${(bike.price * rentalDuration + 5).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleRentNow}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-medium py-6 text-lg h-auto"
                >
                  Rent Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Free cancellation up to 24h before</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Insurance included</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">24/7 customer support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Specifications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(bike.specifications).map(([key, value]) => (
              <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-gray-500 mb-1 capitalize">{key}</h3>
                <p className="font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Bikes */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Similar Bikes You Might Like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedBikes.map((relatedBike) => (
              <motion.div
                key={relatedBike.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <Link href={`/products/${relatedBike.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={relatedBike.image || "/placeholder.svg"}
                      alt={relatedBike.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-black text-sm font-bold px-2 py-1 rounded">
                      ${relatedBike.price}/day
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold">{relatedBike.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-primary mr-1" />
                        <span className="text-sm font-medium">{relatedBike.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{relatedBike.category}</p>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-black">View Details</Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">Need Help Choosing?</h2>
              <p className="text-black/80">Our team is here to help you find the perfect bike for your adventure.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/contact">
                <Button className="bg-black hover:bg-black/90 text-white">Contact Us</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="bg-white text-black border-black hover:bg-gray-100">
                  Browse More Bikes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

