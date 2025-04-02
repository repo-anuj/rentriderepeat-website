"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { ArrowRight, Star, Calendar, Clock, Shield, ChevronRight, Check } from "lucide-react"
import { Bike, Zap, RotateCw, Cog, Droplet, Weight, Ruler, Activity, Disc, CheckCircle, Calendar as CalendarIcon, CreditCard, FileText, Map, MapPin, Mountain, Users } from "lucide-react"

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [selectedDate, setSelectedDate] = useState<string>("")
  const [rentalDuration, setRentalDuration] = useState<number>(1)

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
      description:
        "The Royal Enfield Classic 350 is a timeless motorcycle that combines vintage aesthetics with modern performance. Its iconic design and comfortable riding position make it perfect for long rides through the diverse landscapes of India.",
      specifications: {
        engine: "349cc, Single Cylinder, 4 Stroke",
        power: "20.2 bhp @ 6100 rpm",
        torque: "27 Nm @ 4000 rpm",
        transmission: "5-Speed",
        fuelCapacity: "13 liters",
        weight: "195 kg",
        seatHeight: "805 mm",
        suspension: "Telescopic front, Twin shock absorbers rear",
        brakes: "Disc front, Drum rear",
      },
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
      description:
        "The Bajaj Pulsar NS200 is a performance-oriented motorcycle designed for thrill-seekers. With its aggressive styling and powerful engine, it offers an exhilarating riding experience on Indian roads.",
      specifications: {
        engine: "199.5cc, Single Cylinder, Liquid Cooled",
        power: "24.5 bhp @ 9750 rpm",
        torque: "18.5 Nm @ 8000 rpm",
        transmission: "6-Speed",
        fuelCapacity: "12 liters",
        weight: "156 kg",
        seatHeight: "805 mm",
        suspension: "Telescopic front, Monoshock rear",
        brakes: "Disc front and rear",
      },
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
      description:
        "The KTM Duke 390 is a high-performance naked motorcycle that delivers exceptional power and handling. Its lightweight chassis and powerful engine make it ideal for both city riding and highway cruising in India.",
      specifications: {
        engine: "373.2cc, Single Cylinder, Liquid Cooled",
        power: "43 bhp @ 9000 rpm",
        torque: "37 Nm @ 7000 rpm",
        transmission: "6-Speed",
        fuelCapacity: "13.4 liters",
        weight: "167 kg",
        seatHeight: "830 mm",
        suspension: "WP USD front, WP Monoshock rear",
        brakes: "Disc front and rear with ABS",
      },
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
      description:
        "The TVS Apache RR 310 is a fully-faired sports motorcycle with track-inspired design and performance. Its aerodynamic styling and advanced features make it a favorite among Indian sport bike enthusiasts.",
      specifications: {
        engine: "312.2cc, Single Cylinder, Liquid Cooled",
        power: "34 bhp @ 9700 rpm",
        torque: "27.3 Nm @ 7700 rpm",
        transmission: "6-Speed",
        fuelCapacity: "11 liters",
        weight: "174 kg",
        seatHeight: "810 mm",
        suspension: "USD front, Monoshock rear",
        brakes: "Disc front and rear with dual-channel ABS",
      },
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
      description:
        "The Honda CB350 is a modern classic motorcycle with a retro design and refined performance. Its smooth engine and comfortable riding position make it perfect for cruising through the streets of Indian cities.",
      specifications: {
        engine: "348.36cc, Single Cylinder, Air Cooled",
        power: "21 bhp @ 5500 rpm",
        torque: "30 Nm @ 3000 rpm",
        transmission: "5-Speed",
        fuelCapacity: "15 liters",
        weight: "181 kg",
        seatHeight: "800 mm",
        suspension: "Telescopic front, Twin shock absorbers rear",
        brakes: "Disc front and rear with dual-channel ABS",
      },
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
      description:
        "The Yamaha MT-15 is a naked streetfighter with aggressive styling and nimble handling. Its compact size and responsive engine make it perfect for navigating through congested Indian city traffic.",
      specifications: {
        engine: "155cc, Single Cylinder, Liquid Cooled",
        power: "18.5 bhp @ 10000 rpm",
        torque: "13.9 Nm @ 8500 rpm",
        transmission: "6-Speed",
        fuelCapacity: "10 liters",
        weight: "138 kg",
        seatHeight: "810 mm",
        suspension: "Telescopic front, Monoshock rear",
        brakes: "Disc front and rear with single-channel ABS",
      },
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
      description:
        "The Suzuki Gixxer SF is a fully-faired sports motorcycle with a sleek design and balanced performance. It offers a comfortable riding position while maintaining sporty characteristics for Indian roads.",
      specifications: {
        engine: "155cc, Single Cylinder, Air Cooled",
        power: "13.6 bhp @ 8000 rpm",
        torque: "13.8 Nm @ 6000 rpm",
        transmission: "5-Speed",
        fuelCapacity: "12 liters",
        weight: "148 kg",
        seatHeight: "795 mm",
        suspension: "Telescopic front, Monoshock rear",
        brakes: "Disc front and rear with ABS",
      },
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
      description:
        "The Royal Enfield Himalayan is a purpose-built adventure motorcycle designed to tackle the challenging terrains of India. From the Himalayan mountains to the coastal roads, this motorcycle is built for adventure.",
      specifications: {
        engine: "411cc, Single Cylinder, Air Cooled",
        power: "24.3 bhp @ 6500 rpm",
        torque: "32 Nm @ 4250 rpm",
        transmission: "5-Speed",
        fuelCapacity: "15 liters",
        weight: "199 kg",
        seatHeight: "800 mm",
        suspension: "Telescopic front, Monoshock rear",
        brakes: "Disc front and rear with dual-channel ABS",
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
                  ₹{bike.price}
                  <span className="text-sm font-normal text-gray-600">/day</span>
                </p>
              </div>

              <h2 className="text-2xl font-bold mb-4">About the {bike.name}</h2>
              <p className="text-gray-700 mb-6">{bike.description}</p>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {bike.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
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
                    <span>₹{(bike.price * rentalDuration).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Insurance</span>
                    <span>₹5.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{(bike.price * rentalDuration + 5).toFixed(2)}</span>
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
                  <CalendarIcon className="h-5 w-5 text-primary mr-2" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start">
              <Bike className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Engine</p>
                <p className="text-gray-600">{bike.specifications.engine}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Zap className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Power</p>
                <p className="text-gray-600">{bike.specifications.power}</p>
              </div>
            </div>
            <div className="flex items-start">
              <RotateCw className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Torque</p>
                <p className="text-gray-600">{bike.specifications.torque}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Cog className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Transmission</p>
                <p className="text-gray-600">{bike.specifications.transmission}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Droplet className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Fuel Capacity</p>
                <p className="text-gray-600">{bike.specifications.fuelCapacity}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Weight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Weight</p>
                <p className="text-gray-600">{bike.specifications.weight}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Ruler className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Seat Height</p>
                <p className="text-gray-600">{bike.specifications.seatHeight}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Activity className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Suspension</p>
                <p className="text-gray-600">{bike.specifications.suspension}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Disc className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Brakes</p>
                <p className="text-gray-600">{bike.specifications.brakes}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
            {bike.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Rental Information */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Rental Information</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Minimum Rental Period</p>
                <p className="text-gray-600">1 day</p>
              </div>
            </div>
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Security Deposit</p>
                <p className="text-gray-600">₹5,000 (refundable)</p>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Required Documents</p>
                <p className="text-gray-600">Valid Driving License, Aadhar Card, and Security Deposit</p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Insurance</p>
                <p className="text-gray-600">Included in rental price</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended For */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Recommended For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start">
              <Map className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Road Trips</p>
                <p className="text-gray-600">Perfect for exploring the scenic routes of India</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">City Exploration</p>
                <p className="text-gray-600">Navigate through busy Indian city streets with ease</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mountain className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Adventure Riding</p>
                <p className="text-gray-600">Take on challenging terrains across India</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Group Rides</p>
                <p className="text-gray-600">Enjoy the camaraderie of group motorcycle tours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">Ready to Ride?</h2>
              <p className="text-lg text-black/80 mb-8">
                Book this motorcycle today and start your Indian adventure on two wheels.
              </p>
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
