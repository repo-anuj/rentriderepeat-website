"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TestLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResponse(null)
    
    try {
      const res = await axios.post('/api/auth/signin', formData)
      setResponse(res.data)
    } catch (err) {
      console.error('Login test error:', err)
      setError(err.response?.data || err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Test Login Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Login Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">API Information</h2>
            <p className="mb-2">This page tests the direct API call to:</p>
            <code className="block bg-gray-100 p-2 rounded">/api/auth/signin</code>
            
            <p className="mt-4 mb-2">Request Body:</p>
            <pre className="bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify({
                email: "user@example.com",
                password: "password123"
              }, null, 2)}
            </pre>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">API Response</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg border border-gray-200">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-red-700 mb-2">Error</h3>
              <pre className="bg-white p-4 rounded-md overflow-auto text-red-600">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          ) : response ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-green-700 mb-2">Success</h3>
              <pre className="bg-white p-4 rounded-md overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">Submit the form to see the API response</p>
            </div>
          )}
          
          <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-blue-700 mb-2">Debugging Tips</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Check the browser console for detailed error messages</li>
              <li>Verify that the API endpoint is correct</li>
              <li>Make sure the backend server is running</li>
              <li>Check that the request body format matches what the API expects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
