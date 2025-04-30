"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useBookings } from "@/context/BookingContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-hot-toast"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Bike, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  Phone,
  Mail,
  User,
  FileText,
  Download
} from "lucide-react"
import Link from "next/link"

export default function BookingDetailPage({ params }) {
  const { id } = params
  const { user, loading: authLoading } = useAuth()
  const { booking, loading: bookingLoading, getBookingById, updateBookingStatus } = useBookings()
  
  const [isLoading, setIsLoading] = useState(false)
  
  // Fetch booking details when component mounts
  useEffect(() => {
    if (user && id) {
      getBookingById(id)
    }
  }, [user, id])
  
  const handleCancelBooking = async () => {
    try {
      setIsLoading(true)
      await updateBookingStatus(id, "cancelled")
      toast.success("Booking cancelled successfully")
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast.error("Failed to cancel booking")
    } finally {
      setIsLoading(false)
    }
  }
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-gray-500" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-IN', options)
  }
  
  const loading = authLoading || bookingLoading
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="mb-4">You need to be signed in to view booking details.</p>
          <Button asChild>
            <a href="/signin">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }
  
  if (!booking) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="mb-4">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link href="/bookings">Back to Bookings</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/bookings">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Booking Details</h1>
          
          <div className="mt-4 md:mt-0 flex items-center">
            {getStatusIcon(booking.status)}
            <span className="ml-2 text-lg">{getStatusBadge(booking.status)}</span>
          </div>
        </div>
        
        <p className="text-gray-500 mt-1">Booking ID: {booking._id}</p>
        <p className="text-gray-500">Created on: {formatDate(booking.createdAt)}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bike Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Bike Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Bike Image */}
              <div className="md:w-1/3 bg-gray-100 rounded-lg overflow-hidden">
                {booking.bike?.images && booking.bike.images.length > 0 ? (
                  <img 
                    src={booking.bike.images[0]} 
                    alt={booking.bike.name} 
                    className="w-full h-full object-cover"
                    style={{ maxHeight: '200px' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full" style={{ minHeight: '200px' }}>
                    <Bike className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Bike Info */}
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold">
                  {booking.bike?.name || "Bike"} {booking.bike?.brand && `- ${booking.bike.brand}`} {booking.bike?.model && `${booking.bike.model}`}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Brand</p>
                    <p className="font-medium">{booking.bike?.brand || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium">{booking.bike?.model || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{booking.bike?.category || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Engine</p>
                    <p className="font-medium">{booking.bike?.engineCapacity || "N/A"}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="mt-1">{booking.bike?.description || "No description available."}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href={`/products/${booking.bike?._id}`}>View Bike Details</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Rental Period</p>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
              </div>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>Duration: {booking.duration} days</span>
              </div>
            </div>
            
            {booking.pickupLocation && (
              <div>
                <p className="text-sm text-gray-500">Pickup Location</p>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{booking.pickupLocation}</span>
                </div>
              </div>
            )}
            
            {booking.dropoffLocation && (
              <div>
                <p className="text-sm text-gray-500">Drop-off Location</p>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{booking.dropoffLocation}</span>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div>
              <p className="text-sm text-gray-500">Payment Details</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Base Amount</span>
                  <span>₹{booking.baseAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{booking.gstAmount}</span>
                </div>
                {booking.securityDeposit > 0 && (
                  <div className="flex justify-between">
                    <span>Security Deposit</span>
                    <span>₹{booking.securityDeposit}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>₹{booking.totalAmount}</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <div className="mt-1">
                {booking.paymentStatus === "paid" ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Paid</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>Pending</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {booking.status === "pending" && (
              <Button className="w-full">Make Payment</Button>
            )}
            
            {(booking.status === "pending" || booking.status === "confirmed") && (
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleCancelBooking}
                disabled={isLoading}
              >
                {isLoading ? "Cancelling..." : "Cancel Booking"}
              </Button>
            )}
            
            {booking.status === "completed" && (
              <Button 
                variant="outline" 
                className="w-full text-green-600 border-green-200 hover:bg-green-50"
              >
                Write Review
              </Button>
            )}
            
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          </CardFooter>
        </Card>
        
        {/* Vendor Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Vendor Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="font-medium">{booking.vendor?.businessName || "N/A"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Contact Person</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{booking.vendor?.user?.name || "N/A"}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Contact Information</p>
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{booking.vendor?.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{booking.vendor?.user?.email || "N/A"}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Business Address</p>
                  <div className="flex items-start mt-1">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-1" />
                    <span>{booking.vendor?.businessAddress || "N/A"}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Verification Status</p>
                  <div className="flex items-center mt-1">
                    {booking.vendor?.isVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span>Verified Vendor</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                        <span>Verification Pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.additionalRequirements && (
              <div>
                <p className="text-sm text-gray-500">Special Requirements</p>
                <p className="mt-1">{booking.additionalRequirements}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-500">Required Documents</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Valid Driving License</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span>ID Proof (Aadhar/PAN/Passport)</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Cancellation Policy</p>
              <p className="mt-1 text-sm">
                Free cancellation up to 24 hours before pickup. After that, a cancellation fee of 50% of the total amount will be charged.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
