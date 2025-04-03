"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
  LogOut,
  X,
  Loader2,
  ImageIcon
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
  const [imageLoading, setImageLoading] = useState(false)
  
  // Image upload state
  const [images, setImages] = useState<ImageData[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  interface BikeFormData {
    name: string
    category: string
    brand: string
    model: string
    year: string
    description: string
    cc: string
    fuelType: string
    mileage: string
    condition: string
    price: string
    insurance: boolean
    features: string[]
  }

  interface ImageData {
    url: string
    caption?: string
    base64Data?: string
  }

  const [formData, setFormData] = useState<BikeFormData>({
    name: "",
    category: "",
    brand: "",
    model: "",
    year: "",
    description: "",
    cc: "",
    fuelType: "Petrol",
    mileage: "",
    condition: "Excellent",
    price: "",
    insurance: true,
    features: []
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

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    if (checked) {
      setFormData({ 
        ...formData, 
        features: [...formData.features, feature] 
      })
    } else {
      setFormData({ 
        ...formData, 
        features: formData.features.filter((f: string) => f !== feature) 
      })
    }
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

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setImageLoading(true);
    
    try {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }
      
      // Read file as base64
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        if (!event.target?.result) {
          setImageLoading(false);
          return;
        }
        
        const base64Data = event.target.result as string;
        const token = localStorage.getItem('token');
        
        if (!token) {
          alert('Authentication required. Please log in again.');
          setImageLoading(false);
          return;
        }
        
        // Upload image to server
        const formData = new FormData();
        formData.append('image', base64Data);
        formData.append('caption', file.name);
        
        const response = await fetch('/api/vendor/images', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to upload image');
        }
        
        // Add image to state
        setImages(prev => [...prev, {
          url: data.data.url,
          caption: data.data.caption,
          base64Data: base64Data
        }]);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Failed to upload image');
    } finally {
      setImageLoading(false);
    }
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.')
      }
      
      // Prepare the bike data
      const bikePayload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        description: formData.description,
        engineCapacity: formData.cc,
        fuelType: formData.fuelType,
        mileage: formData.mileage,
        condition: formData.condition,
        dailyRate: formData.price,
        securityDeposit: parseInt(formData.price) * 2, // Example calculation for deposit
        insuranceAvailable: formData.insurance,
        features: Array.isArray(formData.features) ? formData.features : [],
        images: images.map(img => ({
          url: img.url,
          caption: img.caption || '',
          base64Data: img.base64Data
        }))
      }
      
      // Send the request to the API
      const response = await fetch('/api/vendor/bikes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bikePayload)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add bike')
      }
      
      // Show success message
      alert('Bike added successfully!')
      
      // Redirect to bikes page
      router.push('/vendor-dashboard/bikes')
    } catch (error: any) {
      console.error('Error adding bike:', error)
      alert(error.message || 'An error occurred while adding the bike')
    } finally {
      setIsLoading(false)
    }
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
                    
                    {/* Image Upload Section */}
                    <div className="space-y-4">
                      <Label>Bike Images</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          ref={fileInputRef}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={imageLoading}
                          className="mx-auto"
                        >
                          {imageLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <UploadCloud className="h-4 w-4 mr-2" />
                              Upload Images
                            </>
                          )}
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                          You can upload multiple images. Max 5MB each.
                        </p>
                      </div>
                      
                      {images.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Uploaded Images:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((image, index) => (
                              <div key={index} className="relative rounded-lg overflow-hidden border h-24">
                                <img 
                                  src={image.base64Data} 
                                  alt={image.caption || `Image ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-3 w-3 text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Features</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 pt-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="abs" 
                            name="abs"
                            checked={Array.isArray(formData.features) ? formData.features.includes('ABS') : false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, features: [...formData.features, 'ABS'] })
                              } else {
                                setFormData({ 
                                  ...formData, 
                                  features: formData.features.filter((f: string) => f !== 'ABS') 
                                })
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="abs" className="cursor-pointer">ABS</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="bluetooth" 
                            name="bluetooth"
                            checked={formData.features.includes('bluetooth')}
                            onChange={handleFileChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="bluetooth" className="cursor-pointer">Bluetooth</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="usbCharger" 
                            name="usbCharger"
                            checked={formData.features.includes('usbCharger')}
                            onChange={handleFileChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="usbCharger" className="cursor-pointer">USB Charger</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="diskBrake" 
                            name="diskBrake"
                            checked={formData.features.includes('diskBrake')}
                            onChange={handleFileChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="diskBrake" className="cursor-pointer">Disk Brake</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="digitalMeter" 
                            name="digitalMeter"
                            checked={formData.features.includes('digitalMeter')}
                            onChange={handleFileChange}
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