"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
  LogOut
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

// Sample bike data
const bikes = [
  {
    id: 1,
    name: 'Royal Enfield Classic 350',
    category: 'Cruiser',
    price: 35,
    rating: 4.8,
    status: 'Available',
    bookings: 15,
    revenue: 8750,
    img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 2,
    name: 'Honda CBR 250R',
    category: 'Sports',
    price: 45,
    rating: 4.5,
    status: 'Rented',
    bookings: 10,
    revenue: 6300,
    img: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 3,
    name: 'Bajaj Pulsar NS200',
    category: 'Sports',
    price: 30,
    rating: 4.3,
    status: 'Available',
    bookings: 8,
    revenue: 3600,
    img: 'https://images.unsplash.com/photo-1609778269131-b74448db6d3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 4,
    name: 'Yamaha MT-15',
    category: 'Naked',
    price: 40,
    rating: 4.7,
    status: 'Maintenance',
    bookings: 6,
    revenue: 3120,
    img: 'https://images.unsplash.com/photo-1635073902132-a35c64035146?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 5,
    name: 'KTM Duke 200',
    category: 'Street',
    price: 50,
    rating: 4.6,
    status: 'Available',
    bookings: 12,
    revenue: 7200,
    img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
];

export default function BikesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("bikes")

  const handleDelete = (id: number) => {
    // In a real app, you would delete the bike with an API call
    alert(`Delete bike with ID: ${id}`)
  }

  const filteredBikes = bikes.filter((bike) => {
    // Filter by search query
    const matchesSearch = bike.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || bike.status.toLowerCase() === statusFilter.toLowerCase()
    
    // Filter by category
    const matchesCategory = categoryFilter === "all" || bike.category.toLowerCase() === categoryFilter.toLowerCase()
    
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBikes.map((bike) => (
              <Card key={bike.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img 
                    src={bike.img} 
                    alt={bike.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/vendor-dashboard/bikes/edit/${bike.id}`)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(bike.id)} className="text-red-500">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      bike.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : bike.status === 'Rented' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bike.status}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{bike.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{bike.category} • ₹{bike.price}/day</p>
                  
                  <div className="flex justify-between items-center pt-2 border-t mt-2">
                    <div>
                      <p className="text-xs text-gray-500">Bookings</p>
                      <p className="font-medium">{bike.bookings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="font-medium">₹{bike.revenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rating</p>
                      <p className="font-medium">{bike.rating}/5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredBikes.length === 0 && (
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
        </main>
      </div>
    </div>
  )
} 