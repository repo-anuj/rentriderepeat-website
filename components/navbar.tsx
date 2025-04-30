"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Menu, X, Bike, Store, User, LogOut, Settings, ChevronDown, ShoppingBag, CheckCircle, AlertCircle } from "lucide-react"
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
import { useAuth } from "@/context/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type UserData = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified?: boolean;
}

type VendorData = {
  _id: string;
  businessName: string;
  isVerified: boolean;
  documentStatus?: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Use the auth context instead of local state
  const { user, vendor, loading, logout } = useAuth()

  // Check if user is logged in
  const isLoggedIn = !!user

  // For type safety, cast the user and vendor to our types
  const userData = user as UserData | null
  const vendorData = vendor as VendorData | null

  const isActive = (path: string) => pathname === path

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
      toast.error('Failed to logout. Please try again.')
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
          {loading ? (
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

              {/* User dropdown with verification status */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-1">{userData?.name?.split(' ')[0] || 'User'}</span>

                    {/* Show verification badge for all users */}
                    {userData?.isVerified ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified Account</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="h-4 w-4 text-amber-500 ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Email not verified</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{userData?.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{userData?.email}</span>

                    {/* Show role badge */}
                    <div className="mt-2">
                      {userData?.role === 'vendor' && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Vendor
                        </Badge>
                      )}
                      {userData?.role === 'admin' && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          Admin
                        </Badge>
                      )}
                      {userData?.role === 'user' && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          User
                        </Badge>
                      )}

                      {/* Show verification status */}
                      {userData?.isVerified ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-2">
                          Unverified
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>

                  {/* Show vendor info if applicable */}
                  {userData?.role === 'vendor' && vendorData && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 text-sm">
                        <p className="font-medium text-gray-700">{vendorData.businessName}</p>
                        <div className="flex items-center mt-1">
                          {vendorData.isVerified ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified Vendor
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending Verification
                            </Badge>
                          )}
                        </div>
                        {vendorData.documentStatus && (
                          <p className="text-xs text-gray-500 mt-1">
                            Documents: {vendorData.documentStatus.replace('_', ' ')}
                          </p>
                        )}
                      </div>
                    </>
                  )}

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
                  {userData?.role === 'admin' && (
                    <Link href="/admin/dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
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

              {loading ? (
                <div className="py-2 border-t border-gray-100">
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : isLoggedIn ? (
                <>
                  <div className="py-2 border-t border-gray-100">
                    {/* User info section */}
                    <div className="flex items-center py-2">
                      <User className="h-5 w-5 mr-2 text-gray-600" />
                      <span className="font-medium">{userData?.name || 'User'}</span>

                      {/* Verification status icon */}
                      {userData?.isVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500 ml-2" />
                      )}

                      {/* Role badge */}
                      {userData?.role === 'vendor' && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                          Vendor
                        </Badge>
                      )}
                      {userData?.role === 'admin' && (
                        <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200">
                          Admin
                        </Badge>
                      )}
                    </div>

                    {/* Email display */}
                    <div className="pl-7 text-sm text-gray-500 mb-2">
                      {userData?.email}
                    </div>

                    {/* Vendor info if applicable */}
                    {userData?.role === 'vendor' && vendorData && (
                      <div className="pl-7 mb-3 mt-2 border-t border-gray-100 pt-2">
                        <div className="font-medium text-gray-700">{vendorData.businessName}</div>
                        <div className="flex items-center mt-1">
                          {vendorData.isVerified ? (
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified Vendor
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending Verification
                            </Badge>
                          )}
                        </div>
                        {vendorData.documentStatus && (
                          <div className="text-xs text-gray-500 mt-1">
                            Documents: {vendorData.documentStatus.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation links */}
                    <div className="space-y-2 pl-7 mt-1 border-t border-gray-100 pt-2">
                      <Link href="/profile" className="block py-1 text-gray-600" onClick={() => setIsMenuOpen(false)}>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </div>
                      </Link>
                      <Link href="/settings" className="block py-1 text-gray-600" onClick={() => setIsMenuOpen(false)}>
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </div>
                      </Link>
                      {userData?.role === 'vendor' && (
                        <Link href="/vendor-dashboard" className="block py-1 text-gray-600" onClick={() => setIsMenuOpen(false)}>
                          <div className="flex items-center">
                            <Store className="h-4 w-4 mr-2" />
                            Vendor Dashboard
                          </div>
                        </Link>
                      )}
                      {userData?.role === 'admin' && (
                        <Link href="/admin/dashboard" className="block py-1 text-gray-600" onClick={() => setIsMenuOpen(false)}>
                          <div className="flex items-center">
                            <Store className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </div>
                        </Link>
                      )}
                      {userData?.role !== 'vendor' && (
                        <Link href="/bookings" className="block py-1 text-gray-600" onClick={() => setIsMenuOpen(false)}>
                          <div className="flex items-center">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            My Bookings
                          </div>
                        </Link>
                      )}
                      <button
                        className="block py-1 text-red-600 w-full text-left"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </div>
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
