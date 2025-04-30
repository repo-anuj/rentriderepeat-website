"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-hot-toast"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function SettingsPage() {
  const { user, loading, updateProfile } = useAuth()
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    smsNotifications: true,
    darkMode: false,
    twoFactorAuth: false,
  })
  
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    
    try {
      // In a real app, you would save these settings to the user's profile
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendVerificationEmail = async () => {
    try {
      // In a real app, you would call an API to send a verification email
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast.success("Verification email sent. Please check your inbox.")
    } catch (error) {
      console.error("Error sending verification email:", error)
      toast.error("Failed to send verification email")
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
          <p className="mb-4">You need to be signed in to view your settings.</p>
          <Button asChild>
            <a href="/signin">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <Tabs defaultValue="preferences">
        <TabsList className="mb-4">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Enable dark mode for the application</p>
                </div>
                <Switch 
                  checked={settings.darkMode} 
                  onCheckedChange={() => handleToggle('darkMode')} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Language</h3>
                  <p className="text-sm text-gray-500">Choose your preferred language</p>
                </div>
                <select className="border rounded p-2">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Currency</h3>
                  <p className="text-sm text-gray-500">Choose your preferred currency</p>
                </div>
                <select className="border rounded p-2">
                  <option value="inr">Indian Rupee (₹)</option>
                  <option value="usd">US Dollar ($)</option>
                  <option value="eur">Euro (€)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive booking updates via email</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications} 
                  onCheckedChange={() => handleToggle('emailNotifications')} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-gray-500">Receive booking updates via SMS</p>
                </div>
                <Switch 
                  checked={settings.smsNotifications} 
                  onCheckedChange={() => handleToggle('smsNotifications')} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                </div>
                <Switch 
                  checked={settings.marketingEmails} 
                  onCheckedChange={() => handleToggle('marketingEmails')} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Notification Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Email Verification</h3>
                <div className="flex items-center mb-4">
                  {user.isVerified ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Your email is verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>Your email is not verified</span>
                    </div>
                  )}
                </div>
                
                {!user.isVerified && (
                  <Button 
                    variant="outline" 
                    onClick={handleSendVerificationEmail}
                  >
                    Send Verification Email
                  </Button>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
                <div className="flex items-center justify-between">
                  <span>{settings.twoFactorAuth ? "Enabled" : "Disabled"}</span>
                  <Switch 
                    checked={settings.twoFactorAuth} 
                    onCheckedChange={() => handleToggle('twoFactorAuth')} 
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Password</h3>
                <p className="text-sm text-gray-500 mb-4">Change your password regularly for better security</p>
                <Button asChild variant="outline">
                  <a href="/change-password">Change Password</a>
                </Button>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Login Sessions</h3>
                <p className="text-sm text-gray-500 mb-4">Manage your active sessions</p>
                <Button variant="outline">Manage Sessions</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Security Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Profile Visibility</h3>
                  <p className="text-sm text-gray-500">Control who can see your profile</p>
                </div>
                <select className="border rounded p-2">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Only Vendors</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Data Sharing</h3>
                  <p className="text-sm text-gray-500">Allow us to use your data for service improvement</p>
                </div>
                <Switch 
                  checked={true} 
                  onCheckedChange={() => {}} 
                />
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Data Export</h3>
                <p className="text-sm text-gray-500 mb-4">Download a copy of your personal data</p>
                <Button variant="outline">Request Data Export</Button>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2 text-red-600">Delete Account</h3>
                <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all associated data</p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Privacy Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
