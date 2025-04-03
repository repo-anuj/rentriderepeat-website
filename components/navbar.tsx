"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Menu, X, Bike, Store, User, LogOut, Settings, ChevronDown, ShoppingBag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster, toast } from "sonner"

type UserData = {
  _id: string;
  name: string;
  email: string;
  role: string;
}

type VendorData = {
  _id: string;
  businessName: string;
  isVerified: boolean;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [vendorData, setVendorData] = useState<VendorData | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => pathname === path

  // Check if user is logged in on component mount and fetch user data from MongoDB
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setIsLoggedIn(false)
          setIsLoading(false)
          return
        }
        
        // First try to get basic user data from localStorage
        const storedUser = localStorage.getItem('user')
        let userFromStorage = null
        
        if (storedUser) {
          try {
            userFromStorage = JSON.parse(storedUser)
            // Set user data from storage temporarily while we fetch from server
            setUserData(userFromStorage)
            setIsLoggedIn(true)
          } catch (error) {
            console.error('Error parsing user data from storage:', error)
          }
        }
        
        // Fetch fresh user data from MongoDB via API
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.success) {
            setUserData(data.user)
            if (data.vendor) {
              setVendorData(data.vendor)
              // Update vendor data in localStorage
              localStorage.setItem('vendor', JSON.stringify(data.vendor))
            }
            // Update user data in localStorage to keep it fresh
            localStorage.setItem('user', JSON.stringify(data.user))
            setIsLoggedIn(true)
          } else {
            // Token invalid or user not found
            handleLogout()
          }
        } else {
          // API call failed, fallback to localStorage data
          if (!userFromStorage) {
            handleLogout()
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        // Don't log out on error - use localStorage data as fallback
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      // Call logout API (server-side logout)
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Client-side logout (clear localStorage)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('vendor')
      
      // Update state
      setIsLoggedIn(false)
      setUserData(null)
      setVendorData(null)
      setIsLoading(false)
      
      // Show success message
      toast.success('Logged out successfully')
      
      // Redirect to home page
      router.push('/')
    }
  }

  // Get navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { name: "Home", path: "/" },
      { name: "Our Bikes", path: "/products" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ]
    
    if (userData?.role === 'vendor') {
      return [
        ...baseItems,
        { name: "Dashboard", path: "/vendor-dashboard" }
      ]
    }
    
    return baseItems
  }

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <Toaster position="top-center" />
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="flex items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center">
            <Bike className="h-8 w-8 text-primary mr-2" />
            <span className="font-bold text-primary text-xl">BikeRent</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {getNavItems().map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`relative ${isActive(item.path) ? "text-primary font-medium" : "text-gray-700 hover:text-gray-900"}`}
            >
              {item.name}
              {isActive(item.path) && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Input type="text" placeholder="Search bikes" className="w-64 pr-10 rounded-md border-gray-300" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Auth state-based buttons */}
          {isLoading ? (
            <Skeleton className="h-10 w-32" />
          ) : isLoggedIn ? (
            <>
              {/* For regular users, show a bookings button */}
              {userData?.role !== 'vendor' && (
                <Link href="/bookings">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    My Bookings
                  </Button>
                </Link>
              )}
              
              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-1">{userData?.name?.split(' ')[0] || 'User'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  {userData?.role === 'vendor' && (
                    <Link href="/vendor-dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Vendor Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90 text-black">Rent Now</Button>
              </Link>
              <Link href="/vendor-signup">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 flex items-center">
                  <Store className="h-4 w-4 mr-2" />
                  Register as Seller
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-2 space-y-3 bg-white border-t border-gray-200">
              {getNavItems().map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`block py-2 ${isActive(item.path) ? "text-primary font-medium" : "text-gray-700"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isLoading ? (
                <div className="py-2 border-t border-gray-100">
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : isLoggedIn ? (
                <>
                  <div className="py-2 border-t border-gray-100">
                    <div className="flex items-center py-2">
                      <User className="h-5 w-5 mr-2 text-gray-600" />
                      <span className="font-medium">{userData?.name || 'User'}</span>
                      {userData?.role === 'vendor' && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Vendor
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 pl-7 mt-1">
                      <Link href="/profile" className="block py-1 text-gray-600" onClick={() => setIsMenuOpen(false)}>
                        Profile
                      </Link>
                      <Link href="/settings" className="block py-1 text-gray-600" onClick={() => setIsMenuOpen(false)}>
                        Settings
                      </Link>
                      {userData?.role === 'vendor' && (
                        <Link href="/vendor-dashboard" className="block py-1 text-gray-600" onClick={() => setIsMenuOpen(false)}>
                          Vendor Dashboard
                        </Link>
                      )}
                      {userData?.role !== 'vendor' && (
                        <Link href="/bookings" className="block py-1 text-gray-600" onClick={() => setIsMenuOpen(false)}>
                          My Bookings
                        </Link>
                      )}
                      <button 
                        className="block py-1 text-red-600 w-full text-left"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="pt-2 border-t border-gray-100">
                    <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                  <div className="pt-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-black">Rent Now</Button>
                    </Link>
                  </div>
                  <div className="pt-2">
                    <Link href="/vendor-signup" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 flex items-center justify-center">
                        <Store className="h-4 w-4 mr-2" />
                        Register as Seller
                      </Button>
                    </Link>
                  </div>
                </>
              )}
              
              <div className="relative mt-4">
                <Input type="text" placeholder="Search bikes" className="w-full pr-10 rounded-md border-gray-300" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
