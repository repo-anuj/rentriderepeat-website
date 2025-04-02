"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, AlertCircle, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type FormStage = 'personal' | 'business' | 'documents' | 'review';

export default function VendorSignup() {
  const router = useRouter()
  const [stage, setStage] = useState<FormStage>('personal')
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    businessName: "",
    businessType: "",
    gstNumber: "",
    bikeCount: "",
    businessAddress: "",
    description: "",
    panCard: "",
    aadharCard: "",
    businessLicense: "",
    emergencyContact: "",
    bankAccount: "",
    termsAccepted: false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    
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
    
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Enter a valid email address"
    
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required"
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateBusinessInfo = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
    
    if (!formData.businessType) newErrors.businessType = "Please select your business type"
    
    if (!formData.gstNumber.trim()) newErrors.gstNumber = "GST number is required"
    else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) 
      newErrors.gstNumber = "Enter a valid GST number"
    
    if (!formData.bikeCount.trim()) newErrors.bikeCount = "Number of bikes is required"
    else if (isNaN(Number(formData.bikeCount)) || Number(formData.bikeCount) < 1) 
      newErrors.bikeCount = "Enter a valid number"
    
    if (!formData.businessAddress.trim()) newErrors.businessAddress = "Business address is required"
    else if (formData.businessAddress.trim().length < 10) 
      newErrors.businessAddress = "Please provide a complete address"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateDocuments = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.panCard.trim()) newErrors.panCard = "PAN card number is required"
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard)) 
      newErrors.panCard = "Enter a valid PAN card number"
    
    if (!formData.aadharCard.trim()) newErrors.aadharCard = "Aadhar card number is required"
    else if (!/^\d{12}$/.test(formData.aadharCard)) 
      newErrors.aadharCard = "Enter a valid 12-digit Aadhar number"
    
    if (!formData.businessLicense.trim()) newErrors.businessLicense = "Business license number is required"
    
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required"
    else if (!/^\d{10}$/.test(formData.emergencyContact)) 
      newErrors.emergencyContact = "Enter a valid 10-digit emergency contact number"

    if (!formData.bankAccount.trim()) newErrors.bankAccount = "Bank account details are required"
    
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
        if (isValid) setStage('business')
        break
      case 'business':
        isValid = validateBusinessInfo()
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
      case 'business':
        setStage('personal')
        break
      case 'documents':
        setStage('business')
        break
      case 'review':
        setStage('documents')
        break
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateFinalSubmission()) return
    
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      router.push("/products")
    }, 1500)
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
    business: 50,
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
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your Mobile Number"
                className={`w-full bg-white text-black ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>
          </div>
        )
      
      case 'business':
        return (
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter your Business Name"
                className={`w-full bg-white text-black ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-black">Business Type</p>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="businessType"
                    value="individual"
                    checked={formData.businessType === 'individual'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#ffc700]"
                  />
                  <span className="text-black">Individual</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio" 
                    name="businessType"
                    value="partnership"
                    checked={formData.businessType === 'partnership'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#ffc700]"
                  />
                  <span className="text-black">Partnership</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="businessType"
                    value="company"
                    checked={formData.businessType === 'company'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#ffc700]"
                  />
                  <span className="text-black">Company</span>
                </label>
              </div>
              {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
            </div>

            <div>
              <Input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Enter your GST Number"
                className={`w-full bg-white text-black ${errors.gstNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>}
            </div>

            <div>
              <Input
                type="number"
                name="bikeCount"
                value={formData.bikeCount}
                onChange={handleChange}
                placeholder="Number of Bikes for Rent"
                min="1"
                className={`w-full bg-white text-black ${errors.bikeCount ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.bikeCount && <p className="text-red-500 text-xs mt-1">{errors.bikeCount}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-black">Business Address</p>
              <Input
                type="text"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                placeholder="Enter your business address"
                className={`w-full bg-white text-black ${errors.businessAddress ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-black">Business Description</p>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your business (optional)"
                className="w-full bg-white text-black border-gray-300"
              />
            </div>
          </div>
        )
      
      case 'documents':
        return (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-black">PAN Card Number</p>
              <Input
                type="text"
                name="panCard"
                value={formData.panCard}
                onChange={handleChange}
                placeholder="Enter your PAN Card Number"
                className={`w-full bg-white text-black ${errors.panCard ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.panCard && <p className="text-red-500 text-xs mt-1">{errors.panCard}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-black">Aadhar Card Number</p>
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
              <p className="mb-2 text-sm text-black">Business License Number</p>
              <Input
                type="text"
                name="businessLicense"
                value={formData.businessLicense}
                onChange={handleChange}
                placeholder="Enter your Business License Number"
                className={`w-full bg-white text-black ${errors.businessLicense ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.businessLicense && <p className="text-red-500 text-xs mt-1">{errors.businessLicense}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-black">Emergency Contact Number</p>
              <Input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Enter Emergency Contact Number"
                className={`w-full bg-white text-black ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm text-black">Bank Account Details</p>
              <Input
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                placeholder="Enter your Bank Account Details"
                className={`w-full bg-white text-black ${errors.bankAccount ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.bankAccount && <p className="text-red-500 text-xs mt-1">{errors.bankAccount}</p>}
              <p className="text-xs text-gray-600 mt-1">This will be used for rental payments</p>
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
                  <p className="text-black"><span className="font-medium">Email:</span> {formData.email}</p>
                  <p className="text-black"><span className="font-medium">Mobile:</span> {formData.mobile}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Business Information</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-black"><span className="font-medium">Business Name:</span> {formData.businessName}</p>
                  <p className="text-black"><span className="font-medium">Business Type:</span> {formData.businessType.charAt(0).toUpperCase() + formData.businessType.slice(1)}</p>
                  <p className="text-black"><span className="font-medium">GST Number:</span> {formData.gstNumber}</p>
                  <p className="text-black"><span className="font-medium">Number of Bikes:</span> {formData.bikeCount}</p>
                  <p className="text-black"><span className="font-medium">Business Address:</span> {formData.businessAddress}</p>
                  {formData.description && (
                    <p className="text-black"><span className="font-medium">Description:</span> {formData.description}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Documents & Financial Information</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-black"><span className="font-medium">PAN Card:</span> {formData.panCard}</p>
                  <p className="text-black"><span className="font-medium">Aadhar Card:</span> {formData.aadharCard}</p>
                  <p className="text-black"><span className="font-medium">Business License:</span> {formData.businessLicense}</p>
                  <p className="text-black"><span className="font-medium">Emergency Contact:</span> {formData.emergencyContact}</p>
                  <p className="text-black"><span className="font-medium">Bank Account:</span> {formData.bankAccount}</p>
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
                    <Link href="#" className="text-primary font-medium hover:underline ml-1">Seller Terms & Conditions</Link> and 
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
      case 'business': return 'Business Details';
      case 'documents': return 'Documents & Financial Information';
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
            <div className="relative">
              <Image
                src="/Galaxy-A12-localhost.png"
                alt="Phone with smiley face"
                width={400}
                height={400}
                priority
                className="max-w-full"
              />
              <div className="absolute top-0 right-0 bg-white/90 p-3 rounded-full shadow-md">
                <Store className="h-12 w-12 text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-100 md:order-2 order-1"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl text-black font-bold">Register as a Bike Seller</h1>
              <p className="text-gray-700 mt-2">Join our platform and start renting out your bikes</p>
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
                        Register as Seller
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