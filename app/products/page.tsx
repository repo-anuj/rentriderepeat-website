"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Search, Filter, Star, Bike, ChevronDown, Loader2, Check } from "lucide-react"

interface BikeData {
  id: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  price: number;
  rating: number;
  features: string[];
  image?: string;
  images?: Array<{url: string, caption?: string}>;
  description?: string;
}

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [searchQuery, setSearchQuery] = useState("") 
  const [bikes, setBikes] = useState<BikeData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }
  
  // Fetch bikes from API
  useEffect(() => {
    const fetchBikes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "all") {
          params.append('category', selectedCategory);
        }
        params.append('minPrice', priceRange[0].toString());
        params.append('maxPrice', priceRange[1].toString());
        
        const response = await fetch(`/api/products?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch bikes');
        }
        
        const data = await response.json();
        setBikes(data.data || []);
      } catch (err: any) {
        console.error('Error fetching bikes:', err);
        setError(err.message || 'Failed to fetch bikes');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBikes();
  }, [selectedCategory, priceRange]);

  const categories = [
    { name: "All", value: "all" },
    { name: "Cruiser", value: "cruiser" },
    { name: "Sports", value: "sports" },
    { name: "Naked", value: "naked" },
    { name: "Adventure", value: "adventure" },
    { name: "Touring", value: "touring" },
    { name: "Street", value: "street" },
    { name: "Off Road", value: "offroad" }
  ]

  const filteredBikes = bikes.filter(
    (bike) => {
      // Filter by search query if provided
      if (searchQuery && !bike.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    }
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Our Motorcycles</h1>
            <p className="text-lg text-gray-600">
              Explore our wide selection of premium Indian motorcycles for rent
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input 
                type="text" 
                placeholder="Search for motorcycles..." 
                className="w-full pr-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/4 space-y-8"
            >
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" /> Filters
                </h3>

                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-3">Bike Type</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.value} className="flex items-center">
                          <input
                            type="radio"
                            id={category.value}
                            name="category"
                            checked={selectedCategory === category.value}
                            onChange={() => setSelectedCategory(category.value)}
                            className="h-4 w-4 text-primary focus:ring-primary"
                          />
                          <label htmlFor={category.value} className="ml-2 text-gray-700">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">Price Range (₹/day)</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500">
                  Showing <span className="font-medium text-black">{filteredBikes.length}</span> bikes
                </p>
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500">Sort by:</span>
                  <div className="relative">
                    <select className="pl-3 pr-8 py-2 appearance-none border border-gray-200 rounded-md bg-white text-gray-700 text-sm">
                      <option>Featured</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Rating</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 w-full col-span-3">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="text-gray-500">Loading bikes...</p>
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="flex flex-col items-center justify-center py-20 w-full col-span-3">
                  <div className="bg-red-50 p-6 rounded-lg text-center max-w-md">
                    <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Bikes</h3>
                    <p className="text-red-600">{error}</p>
                    <Button 
                      className="mt-4" 
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Bikes Grid */}
              {!isLoading && !error && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredBikes.length > 0 ? filteredBikes.map((bike) => (
                    <motion.div
                      key={bike.id}
                      variants={fadeIn}
                      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative">
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={bike.images && bike.images.length > 0 ? bike.images[0].url : 
                              "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                            alt={bike.name} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                        <span className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-primary font-medium rounded-full text-sm px-3 py-1">
                          ₹{bike.price}/day
                        </span>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center text-amber-500 mb-2">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm ml-1">{bike.rating} ({Math.floor(Math.random() * 100) + 10} reviews)</span>
                        </div>

                        <h3 className="text-xl font-bold">{bike.name}</h3>
                        <p className="text-gray-500 mb-4">{bike.category} {bike.brand && bike.model ? `• ${bike.brand} ${bike.model}` : ''}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {(bike.features || []).slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center text-xs font-medium bg-gray-50 px-2 py-1 rounded-md"
                            >
                              <Check className="h-3 w-3 mr-1 text-primary" />
                              {feature}
                            </span>
                          ))}
                        </div>

                        <Link href={`/products/${bike.id}`}>
                          <Button className="w-full">View Details</Button>
                        </Link>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-3 flex flex-col items-center justify-center py-12">
                      <Bike className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No bikes found</h3>
                      <p className="text-gray-500">Try adjusting your filters or search query</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
