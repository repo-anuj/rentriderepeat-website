"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Bike, 
  Users,
  Search, 
  Home,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  Phone,
  Mail,
  Star
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample customer data
const customers = [
  { 
    id: 1, 
    name: 'Rahul Sharma', 
    email: 'rahul.sharma@example.com',
    phone: '9876543210',
    totalBookings: 5,
    lastBooking: '2023-06-12',
    totalSpent: 5250,
    rating: 4.8,
    avatar: null
  },
  { 
    id: 2, 
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '8765432109',
    totalBookings: 3,
    lastBooking: '2023-06-18',
    totalSpent: 3350,
    rating: 4.5,
    avatar: null
  },
  { 
    id: 3, 
    name: 'Aditya Singh',
    email: 'aditya.singh@example.com',
    phone: '7654321098',
    totalBookings: 2,
    lastBooking: '2023-06-22',
    totalSpent: 1800,
    rating: 4.2,
    avatar: null
  },
  { 
    id: 4, 
    name: 'Divya Gupta',
    email: 'divya.gupta@example.com',
    phone: '9654321087',
    totalBookings: 1,
    lastBooking: '2023-06-19',
    totalSpent: 500,
    rating: 3.9,
    avatar: null
  },
  { 
    id: 5, 
    name: 'Rohit Kumar',
    email: 'rohit.kumar@example.com',
    phone: '8543210976',
    totalBookings: 7,
    lastBooking: '2023-06-28',
    totalSpent: 7200,
    rating: 4.9,
    avatar: null
  },
  { 
    id: 6, 
    name: 'Ananya Mehta',
    email: 'ananya.mehta@example.com',
    phone: '7432109865',
    totalBookings: 4,
    lastBooking: '2023-06-08',
    totalSpent: 3450,
    rating: 4.6,
    avatar: null
  },
  { 
    id: 7, 
    name: 'Vikram Joshi',
    email: 'vikram.joshi@example.com',
    phone: '9321098754',
    totalBookings: 2,
    lastBooking: '2023-06-14',
    totalSpent: 1800,
    rating: 4.3,
    avatar: null
  },
];

export default function CustomersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("lastBooking")
  const [activeTab, setActiveTab] = useState("customers")

  const handleLogout = () => {
    // Implement logout logic here
    router.push('/signin')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
  }

  const sortedCustomers = [...customers]
    .filter(customer => 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'lastBooking':
          return new Date(b.lastBooking).getTime() - new Date(a.lastBooking).getTime()
        case 'totalSpent':
          return b.totalSpent - a.totalSpent
        case 'totalBookings':
          return b.totalBookings - a.totalBookings
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

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
          
          <Link href="/vendor-dashboard/customers" className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${activeTab === "customers" ? "bg-primary/10 text-black font-medium" : "text-gray-800 hover:bg-gray-100"}`}>
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
          <h1 className="text-xl font-bold text-black">Customers</h1>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white text-black pl-9"
                  />
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  <Select 
                    value={sortBy} 
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger className="w-full md:w-44 bg-white text-black">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lastBooking">Last Booking Date</SelectItem>
                      <SelectItem value="totalSpent">Total Spent</SelectItem>
                      <SelectItem value="totalBookings">Total Bookings</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {sortedCustomers.map((customer) => (
              <Card key={customer.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={customer.avatar || ''} alt={customer.name} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{customer.name}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500">
                            <p className="flex items-center">
                              <Mail className="h-3.5 w-3.5 mr-1" />
                              {customer.email}
                            </p>
                            <p className="flex items-center mt-1 sm:mt-0">
                              <Phone className="h-3.5 w-3.5 mr-1" />
                              {customer.phone}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="flex items-center text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm">{customer.rating.toFixed(1)}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500">Total Bookings</p>
                          <p className="font-semibold">{customer.totalBookings}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500">Last Booking</p>
                          <p className="font-semibold">{customer.lastBooking}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md col-span-2">
                          <p className="text-xs text-gray-500">Total Spent</p>
                          <p className="font-semibold">₹{customer.totalSpent}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/vendor-dashboard/customers/${customer.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {sortedCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No customers found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search terms.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 