"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-hot-toast"
import { CheckCircle, AlertCircle, User, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { user, vendor, loading, updateProfile } = useAuth()
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    bio: "",
  })
  const [documents, setDocuments] = useState({
    aadharCardImage: "",
    drivingLicenseImage: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form with user data when it loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
        bio: user.bio || "",
      })

      // Fetch user documents
      fetchUserDocuments()
    }
  }, [user])

  // Fetch user documents from the API
  const fetchUserDocuments = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/user/documents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setDocuments({
            aadharCardImage: data.data.aadharCardImage || "",
            drivingLicenseImage: data.data.drivingLicenseImage || "",
          })
        }
      }
    } catch (error) {
      console.error('Error fetching user documents:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Call the updateProfile function from AuthContext
      const success = await updateProfile(profileData)

      if (success) {
        toast.success("Profile updated successfully")
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="mb-4">You need to be signed in to view your profile.</p>
          <Button asChild>
            <a href="/signin">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card>
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={user.profilePicture || ""} alt={user.name} />
              <AvatarFallback className="bg-primary text-xl">
                {user.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant="outline" className={user.role === "vendor" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                user.role === "admin" ? "bg-purple-50 text-purple-700 border-purple-200" :
                                                "bg-gray-50 text-gray-700 border-gray-200"}>
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"}
              </Badge>

              {user.isVerified ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Unverified
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              {user.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{user.address}</span>
                </div>
              )}
              {user.lastLogin && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Last login: {new Date(user.lastLogin).toLocaleString()}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              {user.role === "vendor" && <TabsTrigger value="business">Business Info</TabsTrigger>}
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                      <CardDescription>Update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                          <Input
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">Email</label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleChange}
                            required
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="address" className="text-sm font-medium">Address</label>
                          <Input
                            id="address"
                            name="address"
                            value={profileData.address}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="city" className="text-sm font-medium">City</label>
                          <Input
                            id="city"
                            name="city"
                            value={profileData.city}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="state" className="text-sm font-medium">State</label>
                          <Input
                            id="state"
                            name="state"
                            value={profileData.state}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="pincode" className="text-sm font-medium">Pincode</label>
                          <Input
                            id="pincode"
                            name="pincode"
                            value={profileData.pincode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleChange}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                ) : (
                  <>
                    <CardHeader>
                      <CardTitle>Profile Details</CardTitle>
                      <CardDescription>Your personal information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                          <p className="mt-1">{user.name || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1">{user.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                          <p className="mt-1">{user.phone || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Address</h3>
                          <p className="mt-1">{user.address || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">City</h3>
                          <p className="mt-1">{user.city || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">State</h3>
                          <p className="mt-1">{user.state || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Pincode</h3>
                          <p className="mt-1">{user.pincode || "Not provided"}</p>
                        </div>
                      </div>
                      {user.bio && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                          <p className="mt-1">{user.bio}</p>
                        </div>
                      )}
                    </CardContent>
                  </>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Your Documents</CardTitle>
                  <CardDescription>Your identification and verification documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Aadhar Card</h3>
                      {documents.aadharCardImage ? (
                        <div className="border rounded-md p-2">
                          <img
                            src={documents.aadharCardImage}
                            alt="Aadhar Card"
                            className="max-h-64 mx-auto object-contain"
                          />
                          <div className="mt-2 flex justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(documents.aadharCardImage, '_blank')}
                            >
                              View Full Size
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
                          <p>No Aadhar Card image available</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Driving License</h3>
                      {documents.drivingLicenseImage ? (
                        <div className="border rounded-md p-2">
                          <img
                            src={documents.drivingLicenseImage}
                            alt="Driving License"
                            className="max-h-64 mx-auto object-contain"
                          />
                          <div className="mt-2 flex justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(documents.drivingLicenseImage, '_blank')}
                            >
                              View Full Size
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
                          <p>No Driving License image available</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                        <p className="text-sm text-black">
                          These documents are used for verification purposes only and are stored securely.
                          If you need to update your documents, please contact customer support.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {user.role === "vendor" && (
              <TabsContent value="business">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>Your vendor details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {vendor ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Business Name</h3>
                          <p className="mt-1">{vendor.businessName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Business Address</h3>
                          <p className="mt-1">{vendor.businessAddress || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
                          <div className="mt-1 flex items-center">
                            {vendor.isVerified ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>Verified</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                                <span>Pending Verification</span>
                              </>
                            )}
                          </div>
                        </div>
                        {vendor.documentStatus && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Document Status</h3>
                            <p className="mt-1 capitalize">{vendor.documentStatus.replace('_', ' ')}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>No business information available.</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline">
                      <a href="/vendor-dashboard">Go to Vendor Dashboard</a>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Verification</h3>
                    <div className="mt-1 flex items-center">
                      {user.isVerified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Your email is verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                          <span>Your email is not verified</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Password</h3>
                    <p className="mt-1">••••••••</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                    <p className="mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                    <p className="mt-1">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Unknown"}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 items-stretch sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button asChild variant="outline" className="flex-1">
                    <a href="/settings">Account Settings</a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href="/change-password">Change Password</a>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
