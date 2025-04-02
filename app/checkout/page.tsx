"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { ArrowRight, CreditCard, ChevronRight, Info, Lock } from "lucide-react"

export default function Checkout() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const id = Number(searchParams.get("id") || "1")
  const date = searchParams.get("date") || ""
  const days = Number(searchParams.get("days") || "1")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      router.push("/success")
    }, 1500)
  }

  const bikes = [
    {
      id: 1,
      name: "Mountain Explorer Pro",
      category: "Mountain Bike",
      price: 25,
      image:
        "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "City Cruiser Deluxe",
      category: "City Bike",
      price: 18,
      image:
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Road Master Elite",
      category: "Road Bike",
      price: 30,
      image:
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "Electric Glide 3000",
      category: "Electric Bike",
      price: 35,
      image:
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
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

  const subtotal = bike.price * days
  const insuranceFee = 5
  const total = subtotal + insuranceFee

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/products" className="hover:text-primary">
                Bikes
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href={`/products/${bike.id}`} className="hover:text-primary">
                {bike.name}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900 font-medium">Checkout</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Booking</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-1 order-2 md:order-2"
            >
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="flex items-start mb-4">
                  <div className="relative h-20 w-20 rounded overflow-hidden flex-shrink-0">
                    <Image src={bike.image || "/placeholder.svg"} alt={bike.name} fill className="object-cover" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold">{bike.name}</h3>
                    <p className="text-gray-600 text-sm">{bike.category}</p>
                    <p className="text-primary font-medium">${bike.price}/day</p>
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-4 my-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rental Period:</span>
                    <span>
                      {days} {days === 1 ? "day" : "days"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span>{date ? new Date(date).toLocaleDateString() : "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span>
                      {date
                        ? new Date(new Date(date).setDate(new Date(date).getDate() + days)).toLocaleDateString()
                        : "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Insurance Fee:</span>
                    <span>${insuranceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Your credit card will be charged ${total.toFixed(2)} for this rental. Cancellations are free up to
                      24 hours before the rental start date.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                  <Lock className="h-4 w-4" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </motion.div>

            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 order-1 md:order-1"
            >
              <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">
                          Full Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (123) 456-7890"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold mb-4">Billing Address</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <label htmlFor="address" className="block text-sm font-medium">
                          Street Address
                        </label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="123 Main St"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="city" className="block text-sm font-medium">
                          City
                        </label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="zipCode" className="block text-sm font-medium">
                          ZIP Code
                        </label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="10001"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <label htmlFor="cardNumber" className="block text-sm font-medium">
                          Card Number
                        </label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="cardName" className="block text-sm font-medium">
                          Name on Card
                        </label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="expiry" className="block text-sm font-medium">
                            Expiry Date
                          </label>
                          <Input
                            id="expiry"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="cvv" className="block text-sm font-medium">
                            CVV
                          </label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary/90 text-black font-medium py-6 text-lg h-auto"
                    >
                      {isLoading ? "Processing..." : "Complete Booking"}
                      {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      By completing this booking, you agree to our{" "}
                      <Link href="#" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

