"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle, Calendar, MapPin, ArrowRight, Download, Bike } from "lucide-react"

export default function Success() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const bookingDetails = {
    bookingId: "BK" + Math.floor(100000 + Math.random() * 900000),
    bike: "Mountain Explorer Pro",
    startDate: new Date().toLocaleDateString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString(),
    location: "123 Bike Street, Cycle City",
    totalPaid: "$80.00",
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-primary p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-black">Booking Confirmed!</h1>
            <p className="text-black/80 mt-2">Your bike rental has been successfully booked.</p>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-6 text-center">
              <p className="text-gray-600">Booking Reference</p>
              <h2 className="text-2xl font-bold">{bookingDetails.bookingId}</h2>
              <p className="text-sm text-gray-500 mt-1">A confirmation email has been sent to your email address.</p>
            </div>

            <div className="border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Booking Details</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Bike className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="text-gray-600 text-sm">Bike</p>
                    <p className="font-medium">{bookingDetails.bike}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="text-gray-600 text-sm">Rental Period</p>
                    <p className="font-medium">
                      {bookingDetails.startDate} to {bookingDetails.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="text-gray-600 text-sm">Pickup Location</p>
                    <p className="font-medium">{bookingDetails.location}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-bold">Total Paid:</span>
                    <span className="font-bold">{bookingDetails.totalPaid}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">What's Next?</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Bring your ID and the credit card used for booking when picking up your bike.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Arrive at the pickup location 15 minutes before your scheduled time.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Our staff will provide safety equipment and instructions before you ride.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-black">
                <Download className="mr-2 h-4 w-4" /> Download Receipt
              </Button>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Return to Home <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto mt-8 text-center"
        >
          <h3 className="text-xl font-bold mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your booking, please contact our customer support.
          </p>
          <Link href="/contact">
            <Button variant="outline">Contact Support</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

