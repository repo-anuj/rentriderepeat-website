"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { Toaster, toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignIn() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed')
      }

      // Store token and user data in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      if (data.vendor) {
        localStorage.setItem('vendor', JSON.stringify(data.vendor))
      }

      // Show success message
      toast.success('Sign in successful!')

      // Redirect based on user role
      setTimeout(() => {
        if (data.user.role === 'vendor') {
          router.push('/vendor-dashboard')
        } else {
          router.push('/products')
        }
      }, 1000)
    } catch (error: any) {
      console.error('Sign in error:', error)
      setError(error.message || 'Invalid email or password')
      setIsLoading(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <Image
              src="/Galaxy-A12-localhost.png"
              alt="Phone with smiley face"
              width={400}
              height={400}
              priority
              className="max-w-full"
            />
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-100 max-w-md mx-auto md:mx-0"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl text-black font-bold">Welcome Back!</h1>
              <p className="text-gray-600 mt-2">Sign in to your BikeRent account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your Email"
                  className="w-full bg-white"
                  required
                />

                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your Password"
                  className="w-full bg-white"
                  required
                />

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <label htmlFor="remember" className="ml-2 text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Link href="#" className="text-primary font-medium hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#ffc700] hover:bg-[#e6b400] text-black font-medium py-6"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>
                  Don't have an account?{" "}
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    Register as User
                  </Link>
                  {" or "}
                  <Link href="/vendor-signup" className="text-primary font-medium hover:underline">
                    Register as Vendor
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}