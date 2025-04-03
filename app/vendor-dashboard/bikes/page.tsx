"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  Bike, 
  PlusCircle, 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  MoreHorizontal,
  Home,
  Calendar,
  Users,
  Settings,
  LogOut,
  AlertCircle,
  Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define bike interface
interface Bike {
  _id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  year: number;
  dailyRate: number;
  availabilityStatus: string;
  images: Array<{url: string, caption?: string}>;
  engineCapacity?: number;
  description?: string;
  features?: any;
  averageRating?: number;
  totalBookings?: number;
}

// Default bike image if none is provided
const defaultBikeImage = "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

export default function BikesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("bikes")
  
  // State for bikes data
  const [bikes, setBikes] = useState<Bike[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState<string | null>(null)
  
  // Fetch bikes from API
  useEffect(() => {
    const fetchBikes = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          router.push('/signin')
          return
        }
        
        const response = await fetch('/api/vendor/bikes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch bikes')
        }
        
        const data = await response.json()
        setBikes(data.data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to fetch bikes')
        console.error('Error fetching bikes:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBikes()
  }, [])
  
  // Handle delete bike
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bike?')) {
      return
    }
    
    setIsDeleteLoading(id)
    
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/signin')
        return
      }
      
      const response = await fetch(`/api/vendor/bikes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete bike')
      }
      
      // Remove the deleted bike from state
      setBikes(bikes.filter(bike => bike._id !== id))
      alert('Bike deleted successfully')
    } catch (err: any) {
      alert(err.message || 'Error deleting bike')
      console.error('Error deleting bike:', err)
    } finally {
      setIsDeleteLoading(null)
    }
  }

  const filteredBikes = bikes.filter((bike) => {
    // Filter by search query
    const matchesSearch = bike.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || 
      (bike.availabilityStatus?.toLowerCase() === statusFilter.toLowerCase())
    
    // Filter by category
    const matchesCategory = categoryFilter === "all" || 
      (bike.category?.toLowerCase() === categoryFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesCategory
  })

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
          
          <Link href="/vendor-dashboard/bikes" className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${activeTab === "bikes" ? "bg-primary/10 text-black font-medium" : "text-gray-800 hover:bg-gray-100"}`}>
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
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow-sm">
          <h1 className="text-xl font-bold text-black">My Bikes</h1>
          
          <Button 
            onClick={() => router.push('/vendor-dashboard/add-bike')}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add New Bike
          </Button>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search bikes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white text-black pl-9"
                  />
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full md:w-36 bg-white text-black">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={categoryFilter} 
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-full md:w-36 bg-white text-black">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="cruiser">Cruiser</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="naked">Naked</SelectItem>
                      <SelectItem value="street">Street</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 text-primary mx-auto animate-spin mb-4" />
              <p className="text-gray-600">Loading your bikes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Error loading bikes</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBikes.map((bike) => (
                  <Card key={bike._id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      <img 
                        src={bike.images?.[0]?.url || defaultBikeImage} 
                        alt={bike.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          // If image fails to load, use default
                          (e.target as HTMLImageElement).src = defaultBikeImage;
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/vendor-dashboard/bikes/edit/${bike._id}`)}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(bike._id)} 
                              className="text-red-500"
                              disabled={isDeleteLoading === bike._id}
                            >
                              {isDeleteLoading === bike._id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (!bike.availabilityStatus || bike.availabilityStatus === 'Available') 
                            ? 'bg-green-100 text-green-800' 
                            : bike.availabilityStatus === 'Rented' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bike.availabilityStatus || 'Available'}
                        </span>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{bike.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {bike.category} • {bike.brand} {bike.model} • ₹{bike.dailyRate}/day
                      </p>
                      
                      <div className="flex justify-between items-center pt-2 border-t mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Year</p>
                          <p className="font-medium">{bike.year || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Engine</p>
                          <p className="font-medium">{bike.engineCapacity || 'N/A'} cc</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Rating</p>
                          <p className="font-medium">{bike.averageRating || 'New'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredBikes.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Bike className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No bikes found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or add a new bike to your inventory.</p>
                  <Button
                    onClick={() => router.push('/vendor-dashboard/add-bike')}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add New Bike
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
} 