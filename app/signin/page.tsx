"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignIn() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      router.push("/products")
    }, 1500)
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
                    Register now
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