"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Bike, 
  ArrowLeft, 
  UploadCloud, 
  Check, 
  Home,
  Calendar,
  Users,
  Settings,
  LogOut
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function AddBikePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("add-bike")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    brand: "",
    model: "",
    year: "",
    cc: "",
    condition: "excellent",
    fuelType: "",
    mileage: "",
    insurance: true,
    features: {
      abs: false,
      bluetooth: false,
      usbCharger: false,
      diskBrake: false,
      digitalMeter: false
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [name]: checked
      }
    }))
  }

  const handleInsuranceChange = (value: string) => {
    setFormData(prev => ({ ...prev, insurance: value === 'yes' }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/vendor-dashboard")
    }, 1500)
  }

  const handleLogout = () => {
    // Implement logout logic here
    router.push('/signin')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-md">
        <div className="flex items-center justify-center h-20 border-b">
          <Bike className="h-8 w-8 text-primary mr-2" />
          <span className="font-bold text-xl text-black">BikeRent Seller</span>
        </div>
        
        <nav className="flex flex-col flex-1 pt-6 pb-8 px-4 space-y-1">
          <Link href="/vendor-dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm text-gray-800 hover:bg-gray-100">
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link href="/vendor-dashboard/bikes" className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm text-gray-800 hover:bg-gray-100">
            <Bike className="h-5 w-5" />
            <span>My Bikes</span>
          </Link>
          
          <Link href="/vendor-dashboard/bookings" className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm text-gray-800 hover:bg-gray-100">
            <Calendar className="h-5 w-5" />
            <span>Bookings</span>
          </Link>
          
          <Link href="/vendor-dashboard/customers" className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm text-gray-800 hover:bg-gray-100">
            <Users className="h-5 w-5" />
            <span>Customers</span>
          </Link>
          
          <Link href="/vendor-dashboard/settings" className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm text-gray-800 hover:bg-gray-100">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          
          <div className="flex-1"></div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center h-16 px-6 bg-white shadow-sm">
          <Button
            variant="ghost"
            onClick={() => router.push('/vendor-dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-black">Add New Bike</h1>
        </header>
        
        {/* Form Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bike Details Section */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the details of your bike</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Bike Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Royal Enfield Classic 350"
                          className="bg-white text-black"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => handleSelectChange("category", value)}
                        >
                          <SelectTrigger className="bg-white text-black">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cruiser">Cruiser</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="naked">Naked</SelectItem>
                            <SelectItem value="scooter">Scooter</SelectItem>
                            <SelectItem value="adventure">Adventure</SelectItem>
                            <SelectItem value="offroad">Off-Road</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          placeholder="e.g. Royal Enfield"
                          className="bg-white text-black"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          name="model"
                          value={formData.model}
                          onChange={handleInputChange}
                          placeholder="e.g. Classic 350"
                          className="bg-white text-black"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          name="year"
                          value={formData.year}
                          onChange={handleInputChange}
                          placeholder="e.g. 2022"
                          className="bg-white text-black"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter a detailed description of your bike"
                        className="min-h-32 bg-white text-black"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                    <CardDescription>Technical details of your bike</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cc">Engine Capacity (CC)</Label>
                        <Input
                          id="cc"
                          name="cc"
                          value={formData.cc}
                          onChange={handleInputChange}
                          placeholder="e.g. 350"
                          type="number"
                          className="bg-white text-black"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="mileage">Mileage (km/l)</Label>
                        <Input
                          id="mileage"
                          name="mileage"
                          value={formData.mileage}
                          onChange={handleInputChange}
                          placeholder="e.g. 35"
                          type="number"
                          className="bg-white text-black"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fuelType">Fuel Type</Label>
                        <Select 
                          value={formData.fuelType} 
                          onValueChange={(value) => handleSelectChange("fuelType", value)}
                        >
                          <SelectTrigger className="bg-white text-black">
                            <SelectValue placeholder="Select Fuel Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="petrol">Petrol</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <RadioGroup 
                        value={formData.condition} 
                        onValueChange={(value) => handleRadioChange("condition", value)} 
                        className="flex flex-wrap space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excellent" id="excellent" />
                          <Label htmlFor="excellent" className="cursor-pointer">Excellent</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="good" id="good" />
                          <Label htmlFor="good" className="cursor-pointer">Good</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fair" id="fair" />
                          <Label htmlFor="fair" className="cursor-pointer">Fair</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Insurance Available</Label>
                      <RadioGroup 
                        value={formData.insurance ? "yes" : "no"} 
                        onValueChange={handleInsuranceChange} 
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="insurance-yes" />
                          <Label htmlFor="insurance-yes" className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="insurance-no" />
                          <Label htmlFor="insurance-no" className="cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Features</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 pt-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="abs" 
                            name="abs"
                            checked={formData.features.abs}
                            onChange={handleFeatureChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="abs" className="cursor-pointer">ABS</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="bluetooth" 
                            name="bluetooth"
                            checked={formData.features.bluetooth}
                            onChange={handleFeatureChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="bluetooth" className="cursor-pointer">Bluetooth</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="usbCharger" 
                            name="usbCharger"
                            checked={formData.features.usbCharger}
                            onChange={handleFeatureChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="usbCharger" className="cursor-pointer">USB Charger</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="diskBrake" 
                            name="diskBrake"
                            checked={formData.features.diskBrake}
                            onChange={handleFeatureChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="diskBrake" className="cursor-pointer">Disk Brake</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="digitalMeter" 
                            name="digitalMeter"
                            checked={formData.features.digitalMeter}
                            onChange={handleFeatureChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="digitalMeter" className="cursor-pointer">Digital Meter</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Price and Image Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rental Price</CardTitle>
                    <CardDescription>Set your rental rate</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Daily Rate (₹)</Label>
                      <Input
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="e.g. 500"
                        type="number"
                        className="bg-white text-black"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                    <CardDescription>Upload images of your bike</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        previewUrl ? 'border-green-400' : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {previewUrl ? (
                        <div className="space-y-3">
                          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={previewUrl} 
                              alt="Bike preview" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="py-8 flex flex-col items-center space-y-2 cursor-pointer"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <UploadCloud className="h-12 w-12 text-gray-400" />
                          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG or JPEG (max. 5MB)</p>
                        </div>
                      )}
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Good photos increase the chances of your bike getting rented. 
                      Upload clear, well-lit photos from multiple angles.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Saving..."
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Add Bike
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
} 