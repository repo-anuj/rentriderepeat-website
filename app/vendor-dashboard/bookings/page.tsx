"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Bike, 
  Calendar,
  Search, 
  Filter, 
  Home,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Download,
  Eye
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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

// Sample booking data
const bookings = [
  { 
    id: 'B001', 
    customer: 'Rahul Sharma', 
    contact: '9876543210',
    bike: 'Royal Enfield Classic 350', 
    startDate: '2023-06-10', 
    endDate: '2023-06-12', 
    amount: 1050,
    status: 'Completed'
  },
  { 
    id: 'B002', 
    customer: 'Priya Patel',
    contact: '8765432109', 
    bike: 'Honda CBR 250R', 
    startDate: '2023-06-15', 
    endDate: '2023-06-18', 
    amount: 1350,
    status: 'Active'
  },
  { 
    id: 'B003', 
    customer: 'Aditya Singh',
    contact: '7654321098', 
    bike: 'Bajaj Pulsar NS200', 
    startDate: '2023-06-20', 
    endDate: '2023-06-22', 
    amount: 900,
    status: 'Upcoming'
  },
  { 
    id: 'B004', 
    customer: 'Divya Gupta',
    contact: '9654321087', 
    bike: 'KTM Duke 200', 
    startDate: '2023-06-18', 
    endDate: '2023-06-19', 
    amount: 500,
    status: 'Cancelled'
  },
  { 
    id: 'B005', 
    customer: 'Rohit Kumar',
    contact: '8543210976', 
    bike: 'Yamaha MT-15', 
    startDate: '2023-06-25', 
    endDate: '2023-06-28', 
    amount: 1200,
    status: 'Upcoming'
  },
  { 
    id: 'B006', 
    customer: 'Ananya Mehta',
    contact: '7432109865', 
    bike: 'Royal Enfield Classic 350', 
    startDate: '2023-06-05', 
    endDate: '2023-06-08', 
    amount: 1050,
    status: 'Completed'
  },
  { 
    id: 'B007', 
    customer: 'Vikram Joshi',
    contact: '9321098754', 
    bike: 'Honda CBR 250R', 
    startDate: '2023-06-12', 
    endDate: '2023-06-14', 
    amount: 900,
    status: 'Completed'
  },
];

export default function BookingsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [activeTab, setActiveTab] = useState("all")

  const handleLogout = () => {
    // Implement logout logic here
    router.push('/signin')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Active':
        return 'bg-blue-100 text-blue-800'
      case 'Upcoming':
        return 'bg-purple-100 text-purple-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredBookings = bookings
    .filter((booking) => {
      // Filter by search query
      const matchesSearch = 
        booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
        booking.bike.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Filter by status (if tab is not 'all')
      const matchesStatus = 
        activeTab === "all" || 
        booking.status.toLowerCase() === activeTab.toLowerCase()
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by start date
      const dateA = new Date(a.startDate).getTime()
      const dateB = new Date(b.startDate).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
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
          
          <Link href="/vendor-dashboard/bookings" className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${activeTab ? "bg-primary/10 text-black font-medium" : "text-gray-800 hover:bg-gray-100"}`}>
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
          <h1 className="text-xl font-bold text-black">Bookings</h1>
          
          <Button 
            onClick={() => {}}
            variant="outline"
            className="hidden sm:flex"
          >
            <Download className="h-4 w-4 mr-2" /> Export
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
                    placeholder="Search bookings by ID, customer, or bike..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white text-black pl-9"
                  />
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="h-10 w-10 bg-white"
                  >
                    {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="bg-white">
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="hidden md:table-cell">Bike</TableHead>
                          <TableHead className="hidden md:table-cell">Dates</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{booking.customer}</p>
                                <p className="text-xs text-gray-500">{booking.contact}</p>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{booking.bike}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <p>{booking.startDate}</p>
                              <p className="text-xs text-gray-500">to {booking.endDate}</p>
                            </TableCell>
                            <TableCell className="text-right">₹{booking.amount}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <span className="sr-only">Open menu</span>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View Details</span>
                                  </DropdownMenuItem>
                                  {booking.status === 'Upcoming' && (
                                    <DropdownMenuItem className="text-red-500">
                                      <span>Cancel Booking</span>
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {filteredBookings.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">No bookings found</h3>
                      <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              {/* Active bookings tab - content is rendered through filtering in the 'all' tab */}
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              {/* Upcoming bookings tab - content is rendered through filtering in the 'all' tab */}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {/* Completed bookings tab - content is rendered through filtering in the 'all' tab */}
            </TabsContent>
            
            <TabsContent value="cancelled" className="space-y-4">
              {/* Cancelled bookings tab - content is rendered through filtering in the 'all' tab */}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
} 