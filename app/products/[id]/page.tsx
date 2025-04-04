"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { ArrowRight, Star, Clock, Shield, ChevronRight, Loader2 } from "lucide-react"
import { Bike, Zap, RotateCw, Cog, Droplet, Weight, Ruler, Activity, Disc, CheckCircle, Calendar as CalendarIcon, CreditCard, FileText, Map, MapPin, Mountain, Users } from "lucide-react"

interface BikeDetail {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  price: number;
  securityDeposit: number;
  rating: number;
  features: string[];
  images: Array<{url: string, caption?: string}>;
  description: string;
  engineCapacity: number;
  year: number;
  fuelType: string;
  mileage: number;
  condition: string;
  specifications: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    fuelCapacity: string;
    weight: string;
    mileage: string;
    seatHeight: string;
  };
  availabilityStatus?: string;
}

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [rentalDuration, setRentalDuration] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bike, setBike] = useState<BikeDetail | null>(null)
  const [currentImage, setCurrentImage] = useState<number>(0)

  // Fetch bike details from API
  useEffect(() => {
    const fetchBikeDetails = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        if (!id) {
          throw new Error('No bike ID provided')
        }
        
        const response = await fetch(`/api/products/${id}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch bike details')
        }
        
        const data = await response.json()
        setBike(data.data)
      } catch (err: any) {
        console.error('Error fetching bike details:', err)
        setError(err.message || 'An error occurred while fetching bike details')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBikeDetails()
  }, [id])

  // Calculate total price
  const totalPrice = bike?.price ? bike.price * rentalDuration : 0
  
  // Handle booking
  const handleBooking = () => {
    if (!selectedDate) {
      alert('Please select a date')
      return
    }
    
    // Store booking details to localStorage for checkout
    const bookingDetails = {
      bikeId: id,
      bikeName: bike?.name,
      startDate: selectedDate,
      duration: rentalDuration,
      totalPrice: totalPrice,
      securityDeposit: bike?.securityDeposit || 0
    }
    
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails))
    
    // Navigate to checkout
    router.push('/checkout')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-gray-600">Loading bike details...</p>
      </div>
    )
  }

  if (error || !bike) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20">
        <div className="bg-red-50 p-8 rounded-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-red-600 mb-6">{error || 'Bike not found'}</p>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <Link href="/products" className="hover:text-primary">Motorcycles</Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <span className="text-gray-900">{bike.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video relative">
              <img
                src={bike.images && bike.images.length > 0 ? bike.images[currentImage].url : "/placeholder.jpg"}
                alt={bike.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {bike.images && bike.images.length > 0 && (
              <div className="flex overflow-x-auto space-x-2 pb-2">
                {bike.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`w-24 h-16 rounded-md overflow-hidden cursor-pointer flex-shrink-0 ${
                      currentImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setCurrentImage(index)}
                  >
                    <img
                      src={image.url}
                      alt={image.caption || `Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold">{bike.name}</h1>
            <div className="flex items-center mt-2 mb-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(bike.rating) ? "fill-current" : ""}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {bike.rating} ({Math.floor(Math.random() * 100) + 10} reviews)
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
                {bike.category}
              </span>
              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800">
                {bike.condition} Condition
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-800">
                {bike.year}
              </span>
            </div>

            <p className="text-3xl font-bold text-primary mt-6">₹{bike.price}/day</p>
            <p className="text-sm text-gray-500 mb-6">Security Deposit: ₹{bike.securityDeposit}</p>

            <p className="text-gray-700 mb-6">{bike.description}</p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {bike.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Booking */}
            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-bold mb-4">Book This Bike</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <Input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (Days)</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRentalDuration(Math.max(1, rentalDuration - 1))}
                      disabled={rentalDuration <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{rentalDuration}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRentalDuration(rentalDuration + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Price per day</span>
                    <span>₹{bike.price}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>Duration</span>
                    <span>{rentalDuration} days</span>
                  </div>
                  <div className="flex justify-between mt-2 font-bold">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4" onClick={handleBooking}>
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Bike Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Zap className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Engine</h3>
              </div>
              <p className="text-gray-700">{bike.specifications.engine}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Activity className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Power</h3>
              </div>
              <p className="text-gray-700">{bike.specifications.power}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <RotateCw className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Transmission</h3>
              </div>
              <p className="text-gray-700">{bike.specifications.transmission}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Droplet className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Fuel Capacity</h3>
              </div>
              <p className="text-gray-700">{bike.specifications.fuelCapacity}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Weight className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Weight</h3>
              </div>
              <p className="text-gray-700">{bike.specifications.weight}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Ruler className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Seat Height</h3>
              </div>
              <p className="text-gray-700">{bike.specifications.seatHeight}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Cog className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Mileage</h3>
              </div>
              <p className="text-gray-700">{bike.specifications.mileage}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Disc className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Brakes</h3>
              </div>
              <p className="text-gray-700">Disc (Front & Rear)</p>
            </div>
          </div>
        </div>

        {/* Rental Process */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Rental Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 bg-primary/10 text-primary rounded-full mb-4">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">1. Book Online</h3>
              <p className="text-gray-600 text-sm">Select your dates and duration</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 bg-primary/10 text-primary rounded-full mb-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">2. Pay Deposit</h3>
              <p className="text-gray-600 text-sm">Secure your booking with a refundable deposit</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 bg-primary/10 text-primary rounded-full mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">3. Documentation</h3>
              <p className="text-gray-600 text-sm">Bring your ID and driving license</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 bg-primary/10 text-primary rounded-full mb-4">
                <Bike className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">4. Ride & Enjoy</h3>
              <p className="text-gray-600 text-sm">Pick up your bike and start your adventure</p>
            </div>
          </div>
        </div>

        {/* Related Bikes */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Similar Bikes</h2>
            <Link href="/products" className="text-primary flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Placeholder for similar bikes - in production, you would fetch similar bikes from API */}
            <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="aspect-video bg-gray-100"></div>
              <div className="p-4">
                <h3 className="font-bold">Similar bikes will appear here</h3>
                <p className="text-gray-500 text-sm">Based on category and features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
