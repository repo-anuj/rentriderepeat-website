"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Search, Menu, X, Bike, Store } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="flex items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center">
            <Bike className="h-8 w-8 text-primary mr-2" />
            <span className="font-bold text-primary text-xl">BikeRent</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { name: "Home", path: "/" },
            { name: "Our Bikes", path: "/products" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
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

          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90 text-black">Rent Now</Button>
          </Link>
          
          <Link href="/vendor-signup">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 flex items-center">
              <Store className="h-4 w-4 mr-2" />
              Register as Seller
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-2 space-y-3 bg-white border-t border-gray-200">
            {[
              { name: "Home", path: "/" },
              { name: "Our Bikes", path: "/products" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`block py-2 ${isActive(item.path) ? "text-primary font-medium" : "text-gray-700"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100">
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
            <div className="relative mt-4">
              <Input type="text" placeholder="Search bikes" className="w-full pr-10 rounded-md border-gray-300" />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}

