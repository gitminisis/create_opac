import { Input } from '@/components/ui/input'
import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react'
import { Bell, CheckCircle, CircleCheck, Key, Lock, Mail, Save, Shield, User, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { clearCookies, convertXMLToJson, deleteCookie, getCookieValue } from '@/lib/utils'
import axios from 'axios'
import useJSONData from '@/hooks/useJSONData'
import { MWI_RESFUL_RES } from '@/components/common/event-calendar/Constants'
import { toast } from '@/components/ui/use-toast'
import { PASSWORD_MIN_LENGTH } from '@/page/login/Register'
import useConstants from '@/hooks/useConstants'

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

const Security = () => {
	const { message } = useConstants()
	const { records } = useJSONData({ selector: '#xml_record' })
	const [countdown, setCountdown] = useState(4)
	const [changed, setChanged] = useState(false)
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

	useEffect(() => {
		if (!changed) return
		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1)
		}, 1000)

		const redirect = setTimeout(() => {
			window.location.href = '/'
		}, 4000)

		return () => {
			clearInterval(timer)
			clearTimeout(redirect)
		}
	}, [changed])

	const handleSecurityChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target
		setSecurityForm({
			...securityForm,
			[name]: value,
		})
		if (securityErrors[name as keyof SecurityFormErrors]) {
			setSecurityErrors({
				...securityErrors,
				[name]: '',
			})
		}
	}

	const validateSecurityForm = (): boolean => {
		const regex = /^(?=.*[A-Z]).*$/
		let isValid = true
		const newErrors: SecurityFormErrors = {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		}

		if (securityForm.newPassword.length < 8 && regex.test(securityForm.currentPassword)) {
			newErrors.newPassword = `${message.passwordValidation} ${PASSWORD_MIN_LENGTH} characters`
			isValid = false
		}

		if (securityForm.confirmPassword.length < 8 && regex.test(securityForm.currentPassword)) {
			newErrors.confirmPassword = `${message.passwordValidation} ${PASSWORD_MIN_LENGTH} characters`
			isValid = false
		} else if (securityForm.newPassword !== securityForm.confirmPassword) {
			newErrors.confirmPassword = message.passwordsDoNotMatch
			isValid = false
		}

		setSecurityErrors(newErrors)
		return isValid
	}

	const getPatron = () =>
		axios({
			method: 'GET',
			url: getCookieValue('HOME_SESSID') + '?MANIPXMLRECORD&KEY=C_CLIENT_NUMBER&VALUE=' + records[0]?.client_number + '&DATABASE=PATRON&READ=Y',
			headers: { 'Content-Type': 'text/xml' },
			timeout: 300000,
		})

	const patchPatron = () =>
		axios({
			method: 'POST',
			url: getCookieValue('HOME_SESSID') + '?MANIPXMLRECORD&KEY=C_CLIENT_NUMBER&VALUE=' + records[0]?.client_number + '&DATABASE=PATRON',
			headers: { 'Content-Type': 'text/xml' },
			data: `<?xml version="1.0" encoding="UTF-8"?><RECORD><PATRON_PID>${securityForm.newPassword}</PATRON_PID></RECORD>`,
			timeout: 300000,
		})
			.then(() => {
				setSecurityForm({
					currentPassword: '',
					newPassword: '',
					confirmPassword: '',
				})

				const cookies = document.cookie.split(';')
				cookies.forEach((cookie) => {
					const name = cookie.split('=')[0].trim()
					deleteCookie(name)
				})

				setChanged(true)
			})
			.catch((err) => {
				toast({
					title: `Error updating password. Please try again.`,
					duration: 500,
				})
			})

	const handleSecuritySubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault()
		if (!validateSecurityForm()) return

		try {
			const res = await getPatron()
			const conToJson: any = await convertXMLToJson(res.data)
			const jsonObj = conToJson[MWI_RESFUL_RES].record

			if (jsonObj.PATRON_PID !== securityForm.currentPassword) {
				setSecurityErrors({
					currentPassword: 'Current Password is wrong',
					newPassword: '',
					confirmPassword: '',
				})
				return
			}

			await patchPatron()
		} catch (err) {
			console.error('Error:', err)
		}
	}

	return (
		<>
			{changed ? (
				<section className="flex items-center justify-center space-y-6 min-h-[364px]">
					<div className="text-center space-y-4">
						<h1 className="flex justify-center items-center text-2xl font-bold text-black">
							<span className="mr-3">
								<CheckCircle className="mr-3 h-6 w-6 text-black" />
							</span>
							Password Changed Successfully
						</h1>
						<p className="mt-6 text-lg text-black">
							Your password has been updated. Please{' '}
							<a className="font-semibold" href="/">
								log in again
							</a>
							.
						</p>
						<p className="mt-4 text-black">
							Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
						</p>
					</div>
				</section>
			) : (
				<form onSubmit={handleSecuritySubmit} className="space-y-6">
					<div className="space-y-2">
						<label htmlFor="currentPassword" className="text-sm font-medium">
							Current Password
						</label>
						<div className="flex items-center">
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
			)}
		</>
	)
}

export default Security
