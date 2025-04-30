import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/AuthContext"
import { BikeProvider } from "@/context/BikeContext"
import { BookingProvider } from "@/context/BookingContext"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BikeRent - Premium Bike Rental Service",
  description: "Rent high-quality bikes for your adventures",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <BikeProvider>
            <BookingProvider>
              <ThemeProvider attribute="class" defaultTheme="light">
                <Navbar />
                <main>{children}</main>
                <Toaster position="top-center" />
                <footer className="bg-gray-100 py-8 border-t">
                  <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div>
                        <h3 className="font-bold text-lg mb-4">BikeRent</h3>
                        <p className="text-gray-600">Your trusted partner for premium bike rentals and adventures.</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                          <li>
                            <a href="/" className="text-gray-600 hover:text-primary">
                              Home
                            </a>
                          </li>
                          <li>
                            <a href="/about" className="text-gray-600 hover:text-primary">
                              About Us
                            </a>
                          </li>
                          <li>
                            <a href="/products" className="text-gray-600 hover:text-primary">
                              Our Bikes
                            </a>
                          </li>
                          <li>
                            <a href="/contact" className="text-gray-600 hover:text-primary">
                              Contact
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-4">Bike Categories</h3>
                        <ul className="space-y-2">
                          <li>
                            <a href="/products" className="text-gray-600 hover:text-primary">
                              Mountain Bikes
                            </a>
                          </li>
                          <li>
                            <a href="/products" className="text-gray-600 hover:text-primary">
                              Road Bikes
                            </a>
                          </li>
                          <li>
                            <a href="/products" className="text-gray-600 hover:text-primary">
                              Electric Bikes
                            </a>
                          </li>
                          <li>
                            <a href="/products" className="text-gray-600 hover:text-primary">
                              City Bikes
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-4">Contact Us</h3>
                        <address className="not-italic text-gray-600">
                          <p>123 Bike Street</p>
                          <p>Cycle City, CC 12345</p>
                          <p className="mt-2">Email: info@bikerent.com</p>
                          <p>Phone: +1 (123) 456-7890</p>
                        </address>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
                      <p>&copy; {new Date().getFullYear()} BikeRent. All rights reserved.</p>
                    </div>
                  </div>
                </footer>
              </ThemeProvider>
            </BookingProvider>
          </BikeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'