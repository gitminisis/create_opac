import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Bell, Key, LoaderCircle, Lock, Mail, Save, Shield, User, UserCog } from 'lucide-react'
import useJSONData from '@/hooks/useJSONData'
import axios from 'axios'
import { getCookieValue } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

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

const Profile = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const [loading, setLoadting] = useState(false)
	const handleProfileChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target
		setProfileForm({
			...profileForm,
			[name]: value,
		})

		if (profileErrors[name as keyof ProfileFormErrors]) {
			setProfileErrors({
				...profileErrors,
				[name]: '',
			})
		}
	}
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

	// Validate profile form
	const validateProfileForm = (): boolean => {
		const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
		let isValid = true
		const newErrors: ProfileFormErrors = { name: '', email: '' }

		if (profileForm.firstName.trim().length < 2) {
			newErrors.name = 'Name must be at least 2 characters.'
			isValid = false
		}

		if (!regex.test(profileForm.email)) {
			newErrors.email = 'Please enter a valid email address.'
			isValid = false
		}

		setProfileErrors(newErrors)
		return isValid
	}

	const handleProfileSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
		if (!validateProfileForm()) return
		setLoadting(true)
		axios({
			method: 'POST',
			url: getCookieValue('HOME_SESSID') + '?MANIPXMLRECORD&KEY=C_CLIENT_NUMBER&VALUE=' + records[0]?.client_number + '&DATABASE=PATRON',
			headers: { 'Content-Type': 'text/xml' },
			data: `<?xml version="1.0" encoding="UTF-8"?><RECORD><P_FIRST_NAME>${profileForm.firstName}</P_FIRST_NAME>
			<P_LAST_NAME>${profileForm.lastName}</P_LAST_NAME>
			<C_EMAIL>${profileForm.email}</C_EMAIL>
			</RECORD>`,
		})
			.then(() => {
				setLoadting(false)
				window.location.reload()
			})
			.catch(() => {
				setLoadting(false)
				toast({
					title: `Error updating profile. Please try again.`,
					duration: 1000,
				})
			})
	}
	return (
		<form onSubmit={handleProfileSubmit} className="space-y-6">
			<div className="space-y-2">
				<label htmlFor="name" className="text-sm font-medium">
					Full Name
				</label>
				<div className="flex items-center w-full">
					<User className="mr-2 h-4 w-4 text-gray-500" />
					<Input
						className="w-[40%] mr-10"
						id="firstName"
						name="firstName"
						placeholder="Enter your first name"
						value={profileForm.firstName}
						onChange={handleProfileChange}
					/>
					<Input
						className="w-[50%]"
						id="lastName"
						name="lastName"
						placeholder="Enter your last name"
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
					<Input id="email" name="email" placeholder="Enter your email" value={profileForm.email} onChange={handleProfileChange} />
				</div>
				<p className="text-sm text-gray-500">This email will be used for account notifications.</p>
				{profileErrors.email && <p className="text-sm text-red-500">{profileErrors.email}</p>}
			</div>

			<Button type="submit" className="bg-black hover:bg-gray-800">
				{loading ? (
					<>
						<LoaderCircle />
					</>
				) : (
					<>
						<Save className="mr-2 h-4 w-4" />
						Save Profile
					</>
				)}
			</Button>
		</form>
	)
}

export default Profile
