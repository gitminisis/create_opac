import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react'
import AccountSettingsLayout from '@/components/layouts/accountsettings'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Bell, Key, Lock, Mail, Save, Shield, User, UserCog } from 'lucide-react'
import type { JSX } from 'react/jsx-runtime' // Import JSX to fix the undeclared variable error
import useJSONData from '@/hooks/useJSONData'
import Profile from './Profile'
import Security from './Security'

export default function AccountSettings(): JSX.Element {
	const [activeTab, setActiveTab] = useState<string>('profile')

	return (
		<AccountSettingsLayout>
			<div className="container mx-auto p-4 md:p-6">
				<div className="flex items-center mb-6">
					<UserCog className="h-6 w-6 mr-2" />
					<h1 className="text-2xl font-bold">Account Settings</h1>
				</div>

				<Card className="border-0 shadow-md">
					<CardHeader className="bg-black text-white rounded-t-lg">
						<CardTitle>Manage Your Account</CardTitle>
						<CardDescription className="text-gray-300">Update your account preferences and security settings</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
							<TabsList className="grid grid-cols-2 w-full bg-gray-100">
								<TabsTrigger value="profile" className="flex items-center gap-2">
									<User className="h-4 w-4" />
									<span className="hidden sm:inline">Profile</span>
								</TabsTrigger>
								<TabsTrigger value="security" className="flex items-center gap-2">
									<Shield className="h-4 w-4" />
									<span className="hidden sm:inline">Security</span>
								</TabsTrigger>
								{/* <TabsTrigger value="notifications" className="flex items-center gap-2">
									<Bell className="h-4 w-4" />
									<span className="hidden sm:inline">Notifications</span>
								</TabsTrigger> */}
							</TabsList>

							<TabsContent value="profile" className="p-4 md:p-6">
								<Profile />
							</TabsContent>

							<TabsContent value="security" className="p-4 md:p-6">
								<Security />
							</TabsContent>

							{/* <TabsContent value="notifications" className="p-4 md:p-6">
								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-medium">Email Notifications</h3>
											<p className="text-sm text-gray-500">Receive email updates about your account activity</p>
										</div>
										<Switch id="email-notifications" defaultChecked />
									</div>
									<Separator />
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-medium">New Resources</h3>
											<p className="text-sm text-gray-500">Get notified when new library resources are available</p>
										</div>
										<Switch id="resource-notifications" defaultChecked />
									</div>
									<Separator />
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-medium">System Updates</h3>
											<p className="text-sm text-gray-500">Receive notifications about system maintenance and updates</p>
										</div>
										<Switch id="system-notifications" />
									</div>
									<Button className="bg-black hover:bg-gray-800">
										<Save className="mr-2 h-4 w-4" />
										Save Preferences
									</Button>
								</div>
							</TabsContent> */}
						</Tabs>
					</CardContent>
					<CardFooter className="bg-gray-50 border-t p-4 flex justify-end items-center rounded-b-lg">
						<Button variant="outline" className="border-black text-black hover:bg-gray-100" onClick={() => (window.location.href = '/')}>
							Cancel
						</Button>
					</CardFooter>
				</Card>
			</div>
		</AccountSettingsLayout>
	)
}
