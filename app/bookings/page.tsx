"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useBookings } from "@/context/BookingContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"
import { Calendar, Clock, MapPin, Bike, CreditCard, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const { 
    bookings, 
    loading: bookingsLoading, 
    pagination, 
    getUserBookings, 
    updateBookingStatus 
  } = useBookings()
  
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  
  // Fetch bookings when component mounts or when tab changes
  useEffect(() => {
    if (user) {
      getUserBookings(currentPage, activeTab !== "all" ? activeTab : "")
    }
  }, [user, activeTab, currentPage])
  
  const handleCancelBooking = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, "cancelled")
      toast.success("Booking cancelled successfully")
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast.error("Failed to cancel booking")
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
  
  const loading = authLoading || bookingsLoading
  
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
          <p className="mb-4">You need to be signed in to view your bookings.</p>
          <Button asChild>
            <a href="/signin">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <Button asChild variant="outline">
            <Link href="/products">Browse Bikes</Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <Select 
            value={currentPage.toString()} 
            onValueChange={(value) => setCurrentPage(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Page" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  Page {i + 1} of {pagination?.totalPages || 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <TabsContent value="all" className="mt-0">
          {renderBookingsList()}
        </TabsContent>
        <TabsContent value="pending" className="mt-0">
          {renderBookingsList()}
        </TabsContent>
        <TabsContent value="confirmed" className="mt-0">
          {renderBookingsList()}
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          {renderBookingsList()}
        </TabsContent>
        <TabsContent value="cancelled" className="mt-0">
          {renderBookingsList()}
        </TabsContent>
      </Tabs>
      
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center px-4">
              Page {currentPage} of {pagination.totalPages}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
  
  function renderBookingsList() {
    if (bookings.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 mb-6">You don't have any {activeTab !== "all" ? activeTab : ""} bookings yet.</p>
          <Button asChild>
            <Link href="/products">Browse Bikes</Link>
          </Button>
        </div>
      )
    }
    
    return (
      <div className="space-y-6">
        {bookings.map((booking) => (
          <Card key={booking._id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Bike Image */}
              <div className="md:w-1/4 bg-gray-100">
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
              
              {/* Booking Details */}
              <div className="md:w-3/4 p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h3 className="text-xl font-bold">
                      {booking.bike?.name || "Bike"} {booking.bike?.brand && `- ${booking.bike.brand}`} {booking.bike?.model && `${booking.bike.model}`}
                    </h3>
                    <p className="text-gray-500 mt-1">Booking ID: {booking._id}</p>
                  </div>
                  
                  <div className="mt-2 md:mt-0 flex items-center">
                    {getStatusIcon(booking.status)}
                    <span className="ml-2">{getStatusBadge(booking.status)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Duration: {booking.duration} days</span>
                    </div>
                    
                    {booking.pickupLocation && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{booking.pickupLocation}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Total Amount: ₹{booking.totalAmount}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <span className="ml-6">Base Amount: ₹{booking.baseAmount}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <span className="ml-6">GST (18%): ₹{booking.gstAmount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link href={`/bookings/${booking._id}`}>View Details</Link>
                  </Button>
                  
                  {booking.status === "pending" && (
                    <Button 
                      variant="outline" 
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Make Payment
                    </Button>
                  )}
                  
                  {(booking.status === "pending" || booking.status === "confirmed") && (
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                  
                  {booking.status === "completed" && (
                    <Button 
                      variant="outline" 
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      Write Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }
}
