"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Bike, 
  PlusCircle, 
  DollarSign, 
  Users, 
  BarChart3, 
  Calendar, 
  Settings, 
  Home,
  LogOut,
  Star,
  ShoppingBag
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

// Sample data for charts
const salesData = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 1800 },
  { name: 'Mar', total: 2200 },
  { name: 'Apr', total: 2400 },
  { name: 'May', total: 2900 },
  { name: 'Jun', total: 3100 },
  { name: 'Jul', total: 3500 },
];

const bikeUsageData = [
  { name: 'Royal Enfield', usage: 85 },
  { name: 'Honda CBR', usage: 72 },
  { name: 'Bajaj Pulsar', usage: 65 },
  { name: 'Yamaha MT', usage: 58 },
  { name: 'KTM Duke', usage: 45 },
];

// Sample bike data
const bikeData = [
  {
    id: 1,
    name: 'Royal Enfield Classic 350',
    category: 'Cruiser',
    price: 35,
    rating: 4.8,
    status: 'Available',
    img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 2,
    name: 'Honda CBR 250R',
    category: 'Sports',
    price: 45,
    rating: 4.5,
    status: 'Rented',
    img: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 3,
    name: 'Bajaj Pulsar NS200',
    category: 'Sports',
    price: 30,
    rating: 4.3,
    status: 'Available',
    img: 'https://images.unsplash.com/photo-1609778269131-b74448db6d3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 4,
    name: 'Yamaha MT-15',
    category: 'Naked',
    price: 40,
    rating: 4.7,
    status: 'Maintenance',
    img: 'https://images.unsplash.com/photo-1635073902132-a35c64035146?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
];

// Recent booking data
const recentBookings = [
  { 
    id: 'B001', 
    customer: 'Rahul Sharma', 
    bike: 'Royal Enfield Classic 350', 
    startDate: '2023-06-10', 
    endDate: '2023-06-12', 
    amount: 105 
  },
  { 
    id: 'B002', 
    customer: 'Priya Patel', 
    bike: 'Honda CBR 250R', 
    startDate: '2023-06-12', 
    endDate: '2023-06-15', 
    amount: 135 
  },
  { 
    id: 'B003', 
    customer: 'Aditya Singh', 
    bike: 'Bajaj Pulsar NS200', 
    startDate: '2023-06-14', 
    endDate: '2023-06-16', 
    amount: 90 
  },
];

export default function VendorDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

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
          <Link href="/vendor-dashboard" className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${activeTab === "overview" ? "bg-primary/10 text-black font-medium" : "text-gray-800 hover:bg-gray-100"}`}>
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
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow-sm">
          <div className="flex items-center md:hidden">
            <Bike className="h-8 w-8 text-primary mr-2" />
            <span className="font-bold text-lg">BikeRent</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="hidden md:block font-medium text-black">Welcome, Bike Vendor!</span>
            <Button 
              onClick={() => router.push('/vendor-dashboard/add-bike')}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add New Bike
            </Button>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <h3 className="text-2xl font-bold">₹24,780</h3>
                      <p className="text-xs text-green-500 mt-1">+12% from last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                      <h3 className="text-2xl font-bold">43</h3>
                      <p className="text-xs text-green-500 mt-1">+8% from last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Bike className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Bikes</p>
                      <h3 className="text-2xl font-bold">12</h3>
                      <p className="text-xs text-green-500 mt-1">+2 from last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                      <h3 className="text-2xl font-bold">4.8/5</h3>
                      <p className="text-xs text-green-500 mt-1">+0.2 from last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <Tabs defaultValue="sales" className="space-y-4">
              <TabsList>
                <TabsTrigger value="sales">Sales Overview</TabsTrigger>
                <TabsTrigger value="bikes">Bike Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sales" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>Your revenue growth over time</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={salesData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="total" stroke="#ffc700" fill="#ffc700" fillOpacity={0.2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bikes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Most Rented Bikes</CardTitle>
                    <CardDescription>Performance of your bikes</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={bikeUsageData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="usage" fill="#ffc700" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Bikes Overview and Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Bikes</CardTitle>
                    <CardDescription>Manage your bike inventory</CardDescription>
                  </div>
                  <Button 
                    onClick={() => router.push('/vendor-dashboard/bikes')} 
                    variant="outline"
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bikeData.slice(0, 3).map((bike) => (
                      <div key={bike.id} className="flex items-center space-x-4 border-b pb-4">
                        <div className="h-14 w-14 rounded-md bg-gray-200 overflow-hidden">
                          <img src={bike.img} alt={bike.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{bike.name}</p>
                          <p className="text-xs text-gray-500">{bike.category} · ₹{bike.price}/day</p>
                        </div>
                        <div>
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
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest bike rentals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="border-b pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">{booking.customer}</p>
                            <p className="text-xs text-gray-500">{booking.bike}</p>
                          </div>
                          <p className="text-sm font-bold">₹{booking.amount}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-500">
                            {booking.startDate} to {booking.endDate}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 