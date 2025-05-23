"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

type FormStage = 'personal' | 'contact' | 'documents' | 'review';

export default function Login() {
  const router = useRouter()
  const [stage, setStage] = useState<FormStage>('personal')
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    mobile: "",
    alternatePhone: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    address: "",
    aadharCard: "",
    drivingLicense: "",
    emergencyContact: "",
    aadharCardImage: "",
    drivingLicenseImage: "",
    termsAccepted: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target

    // Handle file uploads
    if (type === 'file' && files && files.length > 0) {
      const file = files[0]

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [name]: "File size should be less than 5MB"
        }))
        return
      }

      // Read file as base64
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          setFormData(prev => ({
            ...prev,
            [name]: reader.result
          }))
        }
      }
      reader.readAsDataURL(file)
    } else {
      // Handle regular inputs
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validatePersonalInfo = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    else if (formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters"

    if (!formData.dob) newErrors.dob = "Date of birth is required"
    else {
      const dobDate = new Date(formData.dob)
      const today = new Date()
      const age = today.getFullYear() - dobDate.getFullYear()
      if (age < 18) newErrors.dob = "You must be at least 18 years old"
    }

    if (!formData.gender) newErrors.gender = "Please select your gender"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateContactInfo = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required"
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number"

    if (formData.alternatePhone && !/^\d{10}$/.test(formData.alternatePhone))
      newErrors.alternatePhone = "Enter a valid 10-digit phone number"

    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Enter a valid email address"

    if (!formData.password.trim()) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"

    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password"
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

    if (!formData.location.trim()) newErrors.location = "Location is required"

    if (!formData.address.trim()) newErrors.address = "Address is required"
    else if (formData.address.trim().length < 10) newErrors.address = "Please provide a complete address"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateDocuments = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.aadharCard.trim()) newErrors.aadharCard = "Aadhar card number is required"
    else if (!/^\d{12}$/.test(formData.aadharCard)) newErrors.aadharCard = "Enter a valid 12-digit Aadhar number"

    if (!formData.drivingLicense.trim()) newErrors.drivingLicense = "Driving license number is required"
    else if (formData.drivingLicense.trim().length < 8) newErrors.drivingLicense = "Enter a valid driving license number"

    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required"
    else if (!/^\d{10}$/.test(formData.emergencyContact))
      newErrors.emergencyContact = "Enter a valid 10-digit emergency contact number"

    // Validate image uploads
    if (!formData.aadharCardImage) newErrors.aadharCardImage = "Please upload a photo of your Aadhar card"
    if (!formData.drivingLicenseImage) newErrors.drivingLicenseImage = "Please upload a photo of your driving license"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateFinalSubmission = () => {
    if (!formData.termsAccepted) {
      setErrors({ termsAccepted: "You must accept the terms and conditions" })
      return false
    }
    return true
  }

  const handleNext = () => {
    let isValid = false

    switch(stage) {
      case 'personal':
        isValid = validatePersonalInfo()
        if (isValid) setStage('contact')
        break
      case 'contact':
        isValid = validateContactInfo()
        if (isValid) setStage('documents')
        break
      case 'documents':
        isValid = validateDocuments()
        if (isValid) setStage('review')
        break
    }
  }

  const handleBack = () => {
    switch(stage) {
      case 'contact':
        setStage('personal')
        break
      case 'documents':
        setStage('contact')
        break
      case 'review':
        setStage('documents')
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateFinalSubmission()) return

    setIsLoading(true)

    try {
      // Format data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        dob: formData.dob,
        gender: formData.gender,
        mobile: formData.mobile,
        alternatePhone: formData.alternatePhone || undefined,
        location: formData.location,
        address: formData.address,
        aadharCard: formData.aadharCard,
        drivingLicense: formData.drivingLicense,
        emergencyContact: formData.emergencyContact,
        aadharCardImage: formData.aadharCardImage,
        drivingLicenseImage: formData.drivingLicenseImage
      }

      // API call to register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Show success message
      toast.success('Registration successful! Welcome to BikeRent.')

      // Store token in localStorage if available
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token)
      }

      // Redirect to products page after a short delay
      setTimeout(() => {
        router.push("/products")
      }, 1500)
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
      setIsLoading(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.4 },
    }
  }

  const progress = {
    personal: 25,
    contact: 50,
    documents: 75,
    review: 100
  }

  const renderStageContent = () => {
    switch(stage) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your Full Name"
                className={`w-full bg-white text-black ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-black">Date of Birth</p>
              <Input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`w-full bg-white text-black ${errors.dob ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-black">Gender</p>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#ffc700]"
                  />
                  <span className="text-black">Male</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#ffc700]"
                  />
                  <span className="text-black">Female</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#ffc700]"
                  />
                  <span className="text-black">Other</span>
                </label>
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <Input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your Mobile Number"
                className={`w-full bg-white text-black ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <Input
                type="tel"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                placeholder="Enter Alternate Phone (Optional)"
                className={`w-full bg-white text-black ${errors.alternatePhone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.alternatePhone && <p className="text-red-500 text-xs mt-1">{errors.alternatePhone}</p>}
            </div>

            <div>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email"
                className={`w-full bg-white text-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your Password"
                className={`w-full bg-white text-black ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              <p className="text-xs text-gray-600 mt-1">Password must be at least 8 characters</p>
            </div>

            <div>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your Password"
                className={`w-full bg-white text-black ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your City"
                className={`w-full bg-white text-black ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-700">Residential Address</p>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                className={`w-full bg-white text-black ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>
        )

      case 'documents':
        return (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-gray-700">Aadhar Card Number</p>
              <Input
                type="text"
                name="aadharCard"
                value={formData.aadharCard}
                onChange={handleChange}
                placeholder="Enter your 12-digit Aadhar Number"
                className={`w-full bg-white text-black ${errors.aadharCard ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.aadharCard && <p className="text-red-500 text-xs mt-1">{errors.aadharCard}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-700">Aadhar Card Photo</p>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.aadharCardImage ? 'border-red-500' : 'border-gray-300'}`}>
                <Input
                  type="file"
                  name="aadharCardImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  id="aadharCardImage"
                />
                <div
                  onClick={() => document.getElementById('aadharCardImage')?.click()}
                  className="cursor-pointer py-4"
                >
                  {formData.aadharCardImage ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={formData.aadharCardImage as string}
                        alt="Aadhar Card"
                        className="h-32 object-contain mb-2"
                      />
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600 mt-2">Click to upload Aadhar Card photo</p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (max. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
              {errors.aadharCardImage && <p className="text-red-500 text-xs mt-1">{errors.aadharCardImage}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-700">Driving License Number</p>
              <Input
                type="text"
                name="drivingLicense"
                value={formData.drivingLicense}
                onChange={handleChange}
                placeholder="Enter your Driving License Number"
                className={`w-full bg-white text-black ${errors.drivingLicense ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.drivingLicense && <p className="text-red-500 text-xs mt-1">{errors.drivingLicense}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-700">Driving License Photo</p>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.drivingLicenseImage ? 'border-red-500' : 'border-gray-300'}`}>
                <Input
                  type="file"
                  name="drivingLicenseImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  id="drivingLicenseImage"
                />
                <div
                  onClick={() => document.getElementById('drivingLicenseImage')?.click()}
                  className="cursor-pointer py-4"
                >
                  {formData.drivingLicenseImage ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={formData.drivingLicenseImage as string}
                        alt="Driving License"
                        className="h-32 object-contain mb-2"
                      />
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600 mt-2">Click to upload Driving License photo</p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (max. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
              {errors.drivingLicenseImage && <p className="text-red-500 text-xs mt-1">{errors.drivingLicenseImage}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-700">Emergency Contact Number</p>
              <Input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Enter Emergency Contact Number"
                className={`w-full bg-white text-black ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>}
              <p className="text-xs text-gray-600 mt-1">This number will be used in case of emergency</p>
            </div>
          </div>
        )

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <p className="text-sm text-black">
                  Please review all information carefully. You won't be able to edit this information after submission.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Personal Information</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-black"><span className="font-medium">Name:</span> {formData.name}</p>
                  <p className="text-black"><span className="font-medium">Date of Birth:</span> {formData.dob}</p>
                  <p className="text-black"><span className="font-medium">Gender:</span> {formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-1">Contact Information</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-black"><span className="font-medium">Mobile:</span> {formData.mobile}</p>
                  {formData.alternatePhone && <p className="text-black"><span className="font-medium">Alternate Phone:</span> {formData.alternatePhone}</p>}
                  <p className="text-black"><span className="font-medium">Email:</span> {formData.email}</p>
                  <p className="text-black"><span className="font-medium">Password:</span> ••••••••</p>
                  <p className="text-black"><span className="font-medium">City:</span> {formData.location}</p>
                  <p className="text-black"><span className="font-medium">Address:</span> {formData.address}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-1">Documents & Emergency Contact</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-black"><span className="font-medium">Aadhar Card:</span> {formData.aadharCard}</p>
                  <p className="text-black"><span className="font-medium">Driving License:</span> {formData.drivingLicense}</p>
                  <p className="text-black"><span className="font-medium">Emergency Contact:</span> {formData.emergencyContact}</p>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-black text-sm font-medium mb-1">Aadhar Card Image:</p>
                      <img
                        src={formData.aadharCardImage as string}
                        alt="Aadhar Card"
                        className="h-24 object-contain border rounded"
                      />
                    </div>
                    <div>
                      <p className="text-black text-sm font-medium mb-1">Driving License Image:</p>
                      <img
                        src={formData.drivingLicenseImage as string}
                        alt="Driving License"
                        className="h-24 object-contain border rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className={`h-4 w-4 mt-1 text-[#ffc700] ${errors.termsAccepted ? 'border-red-500' : ''}`}
                  />
                  <span className="text-sm text-black">
                    I confirm that all the information provided is accurate and I agree to the
                    <Link href="#" className="text-primary font-medium hover:underline ml-1">Terms & Conditions</Link> and
                    <Link href="#" className="text-primary font-medium hover:underline ml-1">Privacy Policy</Link>
                  </span>
                </label>
                {errors.termsAccepted && <p className="text-red-500 text-xs mt-1">{errors.termsAccepted}</p>}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getStageTitle = () => {
    switch(stage) {
      case 'personal': return 'Personal Information';
      case 'contact': return 'Contact Details';
      case 'documents': return 'Documents & Emergency Contact';
      case 'review': return 'Review & Confirm';
    }
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
            className="flex justify-center md:order-1 order-2"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-100 md:order-2 order-1"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl text-black font-bold">Get Started with BikeRent</h1>
              <p className="text-gray-700 mt-2">Fill out the form below to register</p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mt-4 mb-6">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress[stage]}%` }}
              ></div>
            </div>

            {/* Step indicator */}
            <div className="flex justify-between mb-4">
              <div className="text-sm font-medium text-black">
                Step {Object.keys(progress).indexOf(stage) + 1} of 4
              </div>
              <div className="text-sm font-medium text-black">
                {getStageTitle()}
              </div>
            </div>

            <form onSubmit={stage === 'review' ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeIn}
                >
                  {renderStageContent()}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between pt-4">
                {stage !== 'personal' && (
                  <Button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}

                {stage !== 'personal' ? <div></div> : <div></div>}

                {stage !== 'review' ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center ml-auto bg-[#ffc700] hover:bg-[#e6b400] text-black"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center ml-auto bg-[#ffc700] hover:bg-[#e6b400] text-black font-medium"
                  >
                    {isLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        Register
                        <Check className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="text-center text-sm text-gray-700 pt-2">
                <p>
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary font-medium hover:underline">
                    Sign in
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
