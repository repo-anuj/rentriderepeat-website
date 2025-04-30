"use client"

import { useState, useEffect } from "react"
import axios from "axios"

export default function TestPage() {
  const [apiResponse, setApiResponse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/test')
        setApiResponse(response.data)
        setError(null)
      } catch (err) {
        console.error('API test error:', err)
        setError(err.message || 'An error occurred')
        setApiResponse(null)
      } finally {
        setLoading(false)
      }
    }

    testApi()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          <h2 className="text-xl font-bold mb-2">Success</h2>
          <pre className="bg-white p-4 rounded-md overflow-auto">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">API Endpoints</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>Test API: <code className="bg-gray-100 px-2 py-1 rounded">/api/test</code></li>
          <li>Sign In: <code className="bg-gray-100 px-2 py-1 rounded">/api/auth/signin</code></li>
          <li>Register: <code className="bg-gray-100 px-2 py-1 rounded">/api/auth/register</code></li>
          <li>Get User: <code className="bg-gray-100 px-2 py-1 rounded">/api/auth/me</code></li>
        </ul>
      </div>
    </div>
  )
}
