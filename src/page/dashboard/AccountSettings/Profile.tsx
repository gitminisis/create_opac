import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Bell, CheckCircle, Key, LoaderCircle, Lock, Mail, Save, Shield, User, UserCog } from 'lucide-react'
import useJSONData from '@/hooks/useJSONData'
import axios from 'axios'
import { deleteCookie, encodeObj, getCookieValue, getSessionID } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import useConstants from '@/hooks/useConstants'

// Define interfaces for form data and errors
interface ProfileFormData {
	firstName: string
	lastName: string
	email: string
	city: string
	address: string
	state: string
	postal_code: string
	country: string
}

interface ProfileFormErrors {
	name: string
	email: string
}

const Profile = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const { message } = useConstants()
	const [countdown, setCountdown] = useState(10)
	const [loading, setLoadting] = useState(false)
	const [profileForm, setProfileForm] = useState<ProfileFormData>({
		firstName: records[0].first_name,
		lastName: records[0].last_name,
		email: records[0].email,
		city: records[0].city,
		address: records[0].street,
		state: records[0].prov_state,
		postal_code: records[0].postal_zip,
		country: records[0].country,
	})
	const [profileErrors, setProfileErrors] = useState<ProfileFormErrors>({
		name: '',
		email: '',
	})
	const [changedEmail, setChangedEmail] = useState(false)

	useEffect(() => {
		if (!changedEmail) return
		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1)
		}, 1000)

		const redirect = setTimeout(() => {
			window.location.href = '/'
		}, 10000)

		return () => {
			clearInterval(timer)
			clearTimeout(redirect)
		}
	}, [changedEmail])

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
			<P_ADDRESS occ="1" op="add">${profileForm.address}</P_ADDRESS>
			<P_CITY>${profileForm.city}</P_CITY>
			<P_PROV_STATE>${profileForm.state}</P_PROV_STATE>
			<P_COUNTRY>${profileForm.country}</P_COUNTRY>
			<P_POST_ZIP_CODE>${profileForm.postal_code}</P_POST_ZIP_CODE>
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

	const submitEmailChange = async () => {
		const currentDate = new Date()
		let HOME_SESSID = getSessionID()
		let is_french = getCookieValue('my_lang') === '145' ? true : false
		const encoded = encodeObj(
			JSON.stringify({
				date: currentDate,
				client_number: records[0].client_number,
				email: profileForm.email,
			})
		)
		if (!validateProfileForm()) return
		setChangedEmail(true)
		return await axios
			.post(
				`${HOME_SESSID}?SAVE_MAIL_FORM&TEMPLATE=[OPAC_EMAIL_TMP]${is_french ? 'EmailChgConfrim_fr.txt' : 'EmailChgConfirm.txt'}&FROM_DEFAULT=noreply@minisisinc.com&TO_DEFAULT=${profileForm.email}&SUBJECT_DEFAULT=${'Email Change Confirmation'}`,
				{
					client_number: records[0].client_number,
					EMAIL_CHG_LANDING_PAGE_URL: `${window.location.protocol}//${window.location.hostname}/reset-email.html`,
					email: profileForm.email,
					encoded,
				},
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			.then(() => {
				const cookies = document.cookie.split(';')
				cookies.forEach((cookie) => {
					const name = cookie.split('=')[0].trim()
					deleteCookie(name)
				})
			})
	}

	return (
		<>
			{changedEmail ? (
				<section className="flex items-center justify-center space-y-6 min-h-[364px]">
					<div className="text-center space-y-4">
						<h1 className="flex justify-center items-center text-2xl font-bold text-black">
							<span className="mr-3">
								<CheckCircle className="mr-3 h-6 w-6 text-black" />
							</span>
							{message.confirmationSent}
						</h1>
						<p className="mt-6 text-lg text-black">
							{message.checkEmail}
							<a className="font-semibold" href="/">
								{message.logIn}
							</a>
							.
						</p>
						<p className="mt-4 text-black">
						{message.redirecting} {countdown} {message.second}{countdown !== 1 ? 's' : ''}...
						</p>
					</div>
				</section>
			) : (
				<>
					<form onSubmit={handleProfileSubmit}>
						<div className="space-y-6">
							<div>
								<label htmlFor="name" className="block text-sm font-medium mb-2 min-h-[40px]">
									{message.fullName}
								</label>
								<div className="flex gap-2">
									<Input
										id="firstName"
										name="firstName"
										placeholder="Enter your first name"
										value={profileForm.firstName}
										onChange={handleProfileChange}
										className="w-1/2"
									/>
									<Input
										id="lastName"
										name="lastName"
										placeholder="Enter your last name"
										value={profileForm.lastName}
										onChange={handleProfileChange}
										className="w-1/2"
									/>
								</div>
								{profileErrors.name && <p className="text-sm text-red-500 mt-1">{profileErrors.name}</p>}
							</div>

							<div>
								<label htmlFor="address" className="block text-sm font-medium mb-2 min-h-[40px]">
									{message.address}
								</label>
								<Input
									id="address"
									name="address"
									placeholder="Enter your address"
									value={profileForm.address}
									onChange={handleProfileChange}
									className="w-full"
								/>
							</div>

							<div className="flex gap-2">
								<div className="w-1/2">
									<label htmlFor="city" className="block text-sm font-medium mb-2 min-h-[40px]">
										{message.city}
									</label>
									<Input
										id="city"
										name="city"
										placeholder="Enter your city"
										value={profileForm.city}
										onChange={handleProfileChange}
										className="w-full"
									/>
								</div>
								<div className="w-1/2">
									<label htmlFor="state" className="block text-sm font-medium mb-2 min-h-[40px]">
										{message.provinceState}
									</label>
									<Input
										id="state"
										name="state"
										placeholder="Enter your state"
										value={profileForm.state}
										onChange={handleProfileChange}
										className="w-full"
									/>
								</div>
							</div>

							<div className="flex gap-2">
								<div className="w-1/2">
									<label htmlFor="postal_code" className="block text-sm font-medium mb-2 min-h-[40px]">
										{message.postalCodeLabel}
									</label>
									<Input
										id="postal_code"
										name="postal_code"
										placeholder="Enter your postal code"
										value={profileForm.postal_code}
										onChange={handleProfileChange}
										className="w-full"
									/>
								</div>
								<div className="w-1/2">
									<label htmlFor="country" className="block text-sm font-medium mb-2 min-h-[40px]">
										{message.country}
									</label>
									<Input
										id="country"
										name="country"
										placeholder="Enter your country"
										value={profileForm.country}
										onChange={handleProfileChange}
										className="w-full"
									/>
								</div>
							</div>
						</div>
						<Button type="submit" className="bg-black hover:bg-gray-800 mt-4">
							{loading ? (
								<>
									<LoaderCircle />
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4 " />
									{message.save}
								</>
							)}
						</Button>
					</form>
					<div className="space-y-6">
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">
								{message.email}
							</label>
							<div className="flex items-center">
								<Input
									id="email"
									name="email"
									placeholder="Enter your email"
									value={profileForm.email}
									onChange={handleProfileChange}
								/>
							</div>
							<p className="text-sm text-gray-500">{message.notificationNote}</p>
							{profileErrors.email && <p className="text-sm text-red-500">{profileErrors.email}</p>}
						</div>

						<Button className="bg-black hover:bg-gray-800" onClick={submitEmailChange}>
							<Save className="mr-2 h-4 w-4" />
							{message.save}
						</Button>
					</div>
				</>
			)}
		</>
	)
}

export default Profile
