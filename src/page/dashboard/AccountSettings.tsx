'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
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

// Define interfaces for form data and errors
interface ProfileFormData {
	firstName: string
	lastName: string
	email: string
}

interface ProfileFormErrors {
	name: string
	email: string
}

interface SecurityFormData {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

interface SecurityFormErrors {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

export default function AccountSettings(): JSX.Element {
	const { records } = useJSONData({ selector: '#xml_record' })
	console.log(records)
	const [activeTab, setActiveTab] = useState<string>('profile')

	// Profile form state
	const [profileForm, setProfileForm] = useState<ProfileFormData>({
		firstName: records[0].first_name,
		lastName: records[0].last_name,
		email: records[0].email,
	})
	const [profileErrors, setProfileErrors] = useState<ProfileFormErrors>({
		name: '',
		email: '',
	})

	// Security form state
	const [securityForm, setSecurityForm] = useState<SecurityFormData>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	})
	const [securityErrors, setSecurityErrors] = useState<SecurityFormErrors>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	})

	// Handle profile form input changes
	const handleProfileChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target
		setProfileForm({
			...profileForm,
			[name]: value,
		})

		// Clear error when user types
		if (profileErrors[name as keyof ProfileFormErrors]) {
			setProfileErrors({
				...profileErrors,
				[name]: '',
			})
		}
	}

	// Handle security form input changes
	const handleSecurityChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target
		setSecurityForm({
			...securityForm,
			[name]: value,
		})

		// Clear error when user types
		if (securityErrors[name as keyof SecurityFormErrors]) {
			setSecurityErrors({
				...securityErrors,
				[name]: '',
			})
		}
	}

	// Validate profile form
	const validateProfileForm = (): boolean => {
		let isValid = true
		const newErrors: ProfileFormErrors = { name: '', email: '' }

		if (profileForm.firstName.trim().length < 2) {
			newErrors.name = 'Name must be at least 2 characters.'
			isValid = false
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(profileForm.email)) {
			newErrors.email = 'Please enter a valid email address.'
			isValid = false
		}

		setProfileErrors(newErrors)
		return isValid
	}

	// Validate security form
	const validateSecurityForm = (): boolean => {
		let isValid = true
		const newErrors: SecurityFormErrors = {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		}

		if (securityForm.currentPassword.length < 8) {
			newErrors.currentPassword = 'Password must be at least 8 characters.'
			isValid = false
		}

		if (securityForm.newPassword.length < 8) {
			newErrors.newPassword = 'Password must be at least 8 characters.'
			isValid = false
		}

		if (securityForm.confirmPassword.length < 8) {
			newErrors.confirmPassword = 'Password must be at least 8 characters.'
			isValid = false
		} else if (securityForm.newPassword !== securityForm.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match.'
			isValid = false
		}

		setSecurityErrors(newErrors)
		return isValid
	}

	// Handle profile form submission
	const handleProfileSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
		if (validateProfileForm()) {
			console.log('Profile form submitted:', profileForm)
			// Submit profile data to server
		}
	}

	// Handle security form submission
	const handleSecuritySubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
		if (validateSecurityForm()) {
			console.log('Security form submitted:', securityForm)
			// Submit security data to server
		}
	}

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
							<TabsList className="grid grid-cols-3 w-full bg-gray-100">
								<TabsTrigger value="profile" className="flex items-center gap-2">
									<User className="h-4 w-4" />
									<span className="hidden sm:inline">Profile</span>
								</TabsTrigger>
								<TabsTrigger value="security" className="flex items-center gap-2">
									<Shield className="h-4 w-4" />
									<span className="hidden sm:inline">Security</span>
								</TabsTrigger>
								<TabsTrigger value="notifications" className="flex items-center gap-2">
									<Bell className="h-4 w-4" />
									<span className="hidden sm:inline">Notifications</span>
								</TabsTrigger>
							</TabsList>

							<TabsContent value="profile" className="p-4 md:p-6">
								<form onSubmit={handleProfileSubmit} className="space-y-6">
									<div className="space-y-2">
										<label htmlFor="name" className="text-sm font-medium">
											Full Name
										</label>
										<div className="flex items-center">
											<User className="mr-2 h-4 w-4 text-gray-500" />
											<Input
												id="name"
												name="name"
												placeholder="Enter your name"
												value={profileForm.firstName}
												onChange={handleProfileChange}
											/>
											<Input
												id="name"
												name="name"
												placeholder="Enter your name"
												value={profileForm.lastName}
												onChange={handleProfileChange}
											/>
										</div>
										{profileErrors.name && <p className="text-sm text-red-500">{profileErrors.name}</p>}
									</div>

									<div className="space-y-2">
										<label htmlFor="email" className="text-sm font-medium">
											Email Address
										</label>
										<div className="flex items-center">
											<Mail className="mr-2 h-4 w-4 text-gray-500" />
											<Input
												id="email"
												name="email"
												placeholder="Enter your email"
												value={profileForm.email}
												onChange={handleProfileChange}
											/>
										</div>
										<p className="text-sm text-gray-500">This email will be used for account notifications.</p>
										{profileErrors.email && <p className="text-sm text-red-500">{profileErrors.email}</p>}
									</div>

									<Button type="submit" className="bg-black hover:bg-gray-800">
										<Save className="mr-2 h-4 w-4" />
										Save Profile
									</Button>
								</form>
							</TabsContent>

							<TabsContent value="security" className="p-4 md:p-6">
								<form onSubmit={handleSecuritySubmit} className="space-y-6">
									<div className="space-y-2">
										<label htmlFor="currentPassword" className="text-sm font-medium">
											Current Password
										</label>
										<div className="flex items-center">
											<Key className="mr-2 h-4 w-4 text-gray-500" />
											<Input
												id="currentPassword"
												name="currentPassword"
												type="password"
												placeholder="Enter current password"
												value={securityForm.currentPassword}
												onChange={handleSecurityChange}
											/>
										</div>
										{securityErrors.currentPassword && <p className="text-sm text-red-500">{securityErrors.currentPassword}</p>}
									</div>

									<div className="space-y-2">
										<label htmlFor="newPassword" className="text-sm font-medium">
											New Password
										</label>
										<div className="flex items-center">
											<Lock className="mr-2 h-4 w-4 text-gray-500" />
											<Input
												id="newPassword"
												name="newPassword"
												type="password"
												placeholder="Enter new password"
												value={securityForm.newPassword}
												onChange={handleSecurityChange}
											/>
										</div>
										{securityErrors.newPassword && <p className="text-sm text-red-500">{securityErrors.newPassword}</p>}
									</div>

									<div className="space-y-2">
										<label htmlFor="confirmPassword" className="text-sm font-medium">
											Confirm Password
										</label>
										<div className="flex items-center">
											<Lock className="mr-2 h-4 w-4 text-gray-500" />
											<Input
												id="confirmPassword"
												name="confirmPassword"
												type="password"
												placeholder="Confirm new password"
												value={securityForm.confirmPassword}
												onChange={handleSecurityChange}
											/>
										</div>
										{securityErrors.confirmPassword && <p className="text-sm text-red-500">{securityErrors.confirmPassword}</p>}
									</div>

									<Button type="submit" className="bg-black hover:bg-gray-800">
										<Save className="mr-2 h-4 w-4" />
										Update Password
									</Button>
								</form>
							</TabsContent>

							<TabsContent value="notifications" className="p-4 md:p-6">
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
							</TabsContent>
						</Tabs>
					</CardContent>
					<CardFooter className="bg-gray-50 border-t p-4 flex justify-between items-center rounded-b-lg">
						<p className="text-sm text-gray-500">Last updated: June 12, 2025</p>
						<Button variant="outline" className="border-black text-black hover:bg-gray-100">
							Cancel
						</Button>
					</CardFooter>
				</Card>
			</div>
		</AccountSettingsLayout>
	)
}
