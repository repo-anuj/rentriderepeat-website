"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Bike, 
  Settings,
  Save, 
  Upload, 
  Home,
  Calendar,
  Users,
  LogOut,
  User,
  CreditCard,
  Building,
  Shield,
  Bell
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  
  // Profile data
  const [profileData, setProfileData] = useState({
    name: "Bike Vendor",
    email: "vendor@example.com",
    phone: "9876543210",
    address: "123 Bike Street, Mumbai, Maharashtra 400001",
    avatar: null
  })
  
  // Business data
  const [businessData, setBusinessData] = useState({
    businessName: "Speed Wheels",
    gstNumber: "22AAAAA0000A1Z5",
    panNumber: "ABCTY1234D",
    businessAddress: "123 Bike Street, Mumbai, Maharashtra 400001",
    bankName: "State Bank of India",
    accountNumber: "XXXX XXXX XXXX 1234",
    ifscCode: "SBIN0001234"
  })
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailBooking: true,
    emailMarketing: false,
    smsBooking: true,
    smsMarketing: false,
    pushBooking: true,
    pushMarketing: false
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBusinessData(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // Show success message
    }, 1000)
  }

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
          
          <Link href="/vendor-dashboard/settings" className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${activeTab ? "bg-primary/10 text-black font-medium" : "text-gray-800 hover:bg-gray-100"}`}>
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
          <h1 className="text-xl font-bold text-black">Settings</h1>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="profile" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList className="bg-white">
              <TabsTrigger value="profile" className="data-[state=active]:text-black">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="business" className="data-[state=active]:text-black">
                <Building className="h-4 w-4 mr-2" />
                Business
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:text-black">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:text-black">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:text-black">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileData.avatar || ''} alt={profileData.name} />
                        <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                          {getInitials(profileData.name)}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            className="bg-white text-black"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="bg-white text-black"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            className="bg-white text-black"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          className="bg-white text-black"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Business Tab */}
            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Update your business and tax details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={businessData.businessName}
                        onChange={handleBusinessChange}
                        className="bg-white text-black"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        name="gstNumber"
                        value={businessData.gstNumber}
                        onChange={handleBusinessChange}
                        className="bg-white text-black"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Number</Label>
                      <Input
                        id="panNumber"
                        name="panNumber"
                        value={businessData.panNumber}
                        onChange={handleBusinessChange}
                        className="bg-white text-black"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Textarea
                      id="businessAddress"
                      name="businessAddress"
                      value={businessData.businessAddress}
                      onChange={handleBusinessChange}
                      className="bg-white text-black"
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>
                    Update your banking details for receiving payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={businessData.bankName}
                        onChange={handleBusinessChange}
                        className="bg-white text-black"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={businessData.accountNumber}
                        onChange={handleBusinessChange}
                        className="bg-white text-black"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        name="ifscCode"
                        value={businessData.ifscCode}
                        onChange={handleBusinessChange}
                        className="bg-white text-black"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Booking Updates</Label>
                          <p className="text-sm text-gray-500">Receive notifications when a customer books your bike</p>
                        </div>
                        <Switch 
                          checked={notifications.emailBooking}
                          onCheckedChange={(checked) => handleNotificationChange('emailBooking', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Marketing Updates</Label>
                          <p className="text-sm text-gray-500">Receive promotional emails and newsletters</p>
                        </div>
                        <Switch 
                          checked={notifications.emailMarketing}
                          onCheckedChange={(checked) => handleNotificationChange('emailMarketing', checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">SMS Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Booking Updates</Label>
                          <p className="text-sm text-gray-500">Receive text messages when a customer books your bike</p>
                        </div>
                        <Switch 
                          checked={notifications.smsBooking}
                          onCheckedChange={(checked) => handleNotificationChange('smsBooking', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Marketing Updates</Label>
                          <p className="text-sm text-gray-500">Receive promotional text messages</p>
                        </div>
                        <Switch 
                          checked={notifications.smsMarketing}
                          onCheckedChange={(checked) => handleNotificationChange('smsMarketing', checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Booking Updates</Label>
                          <p className="text-sm text-gray-500">Receive push notifications when a customer books your bike</p>
                        </div>
                        <Switch 
                          checked={notifications.pushBooking}
                          onCheckedChange={(checked) => handleNotificationChange('pushBooking', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Marketing Updates</Label>
                          <p className="text-sm text-gray-500">Receive promotional push notifications</p>
                        </div>
                        <Switch 
                          checked={notifications.pushMarketing}
                          onCheckedChange={(checked) => handleNotificationChange('pushMarketing', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="bg-white text-black"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="bg-white text-black"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="bg-white text-black"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require a verification code when logging in</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Delete Account</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Warning: This action cannot be undone. All your data, including bikes, bookings, and customer information will be permanently deleted.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="destructive"
                  >
                    Delete Account
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
} 