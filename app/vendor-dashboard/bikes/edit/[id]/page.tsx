"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, UploadCloud, X, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

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
  availabilityStatus: string
}

interface ImageData {
  url: string
  caption?: string
  base64Data?: string
}

export default function EditBikePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [images, setImages] = useState<ImageData[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
    insurance: false,
    features: [],
    availabilityStatus: "Available"
  })

  // Fetch bike data
  useEffect(() => {
    const fetchBikeDetails = async () => {
      setIsFetching(true)
      setError(null)
      
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          router.push('/signin')
          return
        }
        
        const response = await fetch(`/api/vendor/bikes/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch bike details')
        }
        
        const data = await response.json()
        const bike = data.data
        
        if (!bike) {
          throw new Error('Bike not found')
        }
        
        // Update form data with bike details
        setFormData({
          name: bike.name || "",
          category: bike.category || "",
          brand: bike.brand || "",
          model: bike.model || "",
          year: bike.year?.toString() || "",
          description: bike.description || "",
          cc: bike.engineCapacity?.toString() || "",
          fuelType: bike.fuelType || "Petrol",
          mileage: bike.mileage?.toString() || "",
          condition: bike.condition || "Excellent",
          price: bike.dailyRate?.toString() || "",
          insurance: bike.insuranceAvailable || false,
          features: Array.isArray(bike.features) ? bike.features : [],
          availabilityStatus: bike.availabilityStatus || "Available"
        })
        
        // Set existing images if any
        if (bike.images && Array.isArray(bike.images)) {
          setImages(bike.images.map((img: ImageData) => ({
            url: img.url,
            caption: img.caption || ''
          })))
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching bike details')
        console.error('Error fetching bike:', err)
      } finally {
        setIsFetching(false)
      }
    }
    
    fetchBikeDetails()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }
  
  const handleFeatureChange = (feature: string, checked: boolean) => {
    const features = formData.features
    
    if (checked && !features.includes(feature)) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, feature]
      }))
    } else if (!checked && features.includes(feature)) {
      setFormData((prev) => ({
        ...prev,
        features: prev.features.filter((f) => f !== feature)
      }))
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
        availabilityStatus: formData.availabilityStatus,
        images: images.map(img => ({
          url: img.url,
          caption: img.caption || '',
          base64Data: img.base64Data
        }))
      }
      
      // Send the request to the API
      const response = await fetch(`/api/vendor/bikes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bikePayload)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update bike')
      }
      
      // Show success message
      alert('Bike updated successfully!')
      
      // Redirect to bikes page
      router.push('/vendor-dashboard/bikes')
    } catch (error: any) {
      console.error('Error updating bike:', error)
      alert(error.message || 'An error occurred while updating the bike')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-gray-600">Loading bike details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/vendor-dashboard/bikes')}>
            Back to Bikes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Bike</CardTitle>
          <CardDescription>Update information about your bike</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Bike Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter bike name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    placeholder="e.g. Honda, Yamaha"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="e.g. CBR 250R, MT-15"
                    value={formData.model}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    placeholder="e.g. 2022"
                    min="1970"
                    max={new Date().getFullYear().toString()}
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cruiser">Cruiser</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Naked">Naked</SelectItem>
                      <SelectItem value="Street">Street</SelectItem>
                      <SelectItem value="Adventure">Adventure</SelectItem>
                      <SelectItem value="Touring">Touring</SelectItem>
                      <SelectItem value="Scooter">Scooter</SelectItem>
                      <SelectItem value="Dual Sport">Dual Sport</SelectItem>
                      <SelectItem value="Off Road">Off Road</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Technical Specifications */}
              <div className="space-y-4">
                <h3 className="font-semibold">Technical Specifications</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="cc">Engine Capacity (CC)</Label>
                  <Input
                    id="cc"
                    name="cc"
                    type="number"
                    placeholder="e.g. 150, 250, 350"
                    value={formData.cc}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select 
                    value={formData.fuelType}
                    onValueChange={(value) => handleSelectChange('fuelType', value)}
                  >
                    <SelectTrigger id="fuelType">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage (kmpl)</Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    type="number"
                    placeholder="e.g. 40"
                    value={formData.mileage}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select 
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange('condition', value)}
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your bike, its features, and condition"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            
            {/* Pricing and Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Pricing and Insurance</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Daily Rental Rate (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="Daily rental price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox 
                    id="insurance" 
                    checked={formData.insurance}
                    onCheckedChange={(checked) => handleCheckboxChange('insurance', checked as boolean)}
                  />
                  <label
                    htmlFor="insurance"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Insurance Available
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Availability Status</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="availabilityStatus">Status</Label>
                  <Select 
                    value={formData.availabilityStatus}
                    onValueChange={(value) => handleSelectChange('availabilityStatus', value)}
                  >
                    <SelectTrigger id="availabilityStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Rented">Rented</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Image Upload Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Bike Images</h3>
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
                  <p className="text-sm font-medium mb-2">Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden border h-24">
                        {image.base64Data ? (
                          <img 
                            src={image.base64Data} 
                            alt={image.caption || `Image ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : image.url ? (
                          <div className="flex items-center justify-center w-full h-full bg-gray-100">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        ) : null}
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
            
            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'ABS', 'Disc Brakes', 'LED Lights', 'Digital Dashboard', 'Bluetooth',
                  'USB Charger', 'Helmet', 'Riding Gear', 'GPS', 'Phone Mount'
                ].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`feature-${feature}`} 
                      checked={formData.features.includes(feature)}
                      onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                    />
                    <label
                      htmlFor={`feature-${feature}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/vendor-dashboard/bikes')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Bike'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
