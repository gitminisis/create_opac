import Layout from '@/components/layouts'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import useConstants from '@/hooks/useConstants'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { CircleCheck } from 'lucide-react'
import useJSONData from '@/hooks/useJSONData'
import Spinner from '@/components/common/event-calendar/Spinner'

type ClientFormData = {
	C_TITLE: string
	C_NAME_FIRST: string
	C_NAME_LAST: string
	C_EMAIL: string
	C_STREET: string
	C_CITY: string
	C_PROV_STATE: string
	C_POSTAL_ZIP: string
	C_COUNTRY: string
	C_RES_PURPOSE: string
	C_RES_SUBJECTS: string
	PATRON_PID: string
	PATRON_PID_RE: string
	recaptcha: string
}

export const PASSWORD_MIN_LENGTH = 8

const Register = () => {
	const [loading, setLoading] = useState(false)
	const { records } = useJSONData({ selector: '#xml_record' })
	const conf = useConstants().config
	const [recaptchaToken, setRecaptchaToken] = useState<string>('')
	const { message } = useConstants()
	const [status, setStatus] = useState(0)
	const [userData, setUserData] = useState<ClientFormData>({
		C_TITLE: '',
		C_NAME_FIRST: '',
		C_NAME_LAST: '',
		C_EMAIL: '',
		C_STREET: '',
		C_CITY: '',
		C_PROV_STATE: '',
		C_POSTAL_ZIP: '',
		C_COUNTRY: '',
		C_RES_PURPOSE: '',
		C_RES_SUBJECTS: '',
		PATRON_PID: '',
		PATRON_PID_RE: '',
		recaptcha: '',
	})
	const {
		register,
		handleSubmit,
		watch,
		trigger,
		formState: { errors },
	} = useForm({
		defaultValues: {
			C_TITLE: '',
			C_NAME_FIRST: '',
			C_NAME_LAST: '',
			C_EMAIL: '',
			PATRON_PID: '',
			PATRON_PID_RE: '',
			C_STREET: '',
			C_CITY: '',
			C_PROV_STATE: '',
			C_POSTAL_ZIP: '',
			C_COUNTRY: '',
			C_RES_PURPOSE: '',
			C_RES_SUBJECTS: '',
			recaptcha: '',
		},
	})
	const [currentStep, setCurrentStep] = useState(1)
	const [isSaveRecordSent, setIsSaveRecordSent] = useState(false)
	const sendSkipRecord = async () => {
		try {
			await axios.post(`${records[0].skip_n_stop_record}`)
			console.log('SKIPRECORD sent to clean up resources')
		} catch (error) {
			console.error('Error sending SKIPRECORD:', error)
		}
	}

	useEffect(() => {
		const handleBeforeUnload = (event: { preventDefault: () => void; returnValue: string }) => {
			if (!isSaveRecordSent) {
				sendSkipRecord()
				event.preventDefault()
				event.returnValue = ''
			}
		}
		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [isSaveRecordSent])

	const getStepFields = (step: number) => {
		switch (step) {
			case 1:
				return ['C_EMAIL', 'C_NAME_FIRST', 'C_NAME_LAST', 'PATRON_PID', 'PATRON_PID_RE'] as const
			case 2:
				return ['C_STREET', 'C_CITY', 'C_PROV_STATE', 'C_POSTAL_ZIP', 'C_COUNTRY'] as const
			case 3:
				return ['C_RES_PURPOSE', 'C_RES_SUBJECTS'] as const
			default:
				return []
		}
	}

	const onSubmit = async (data: ClientFormData) => {
		setUserData(data)
		setLoading(true)
		const formData = new FormData()
		formData.append('C_EMAIL', data.C_EMAIL)
		formData.append('C_NAME_FIRST', data.C_NAME_FIRST)
		formData.append('C_NAME_LAST', data.C_NAME_LAST)
		formData.append('PATRON_PID', data.PATRON_PID)
		formData.append('C_STREET', data.C_STREET)
		formData.append('C_CITY', data.C_CITY)
		formData.append('C_PROV_STATE', data.C_PROV_STATE)
		formData.append('C_POSTAL_ZIP', data.C_POSTAL_ZIP)
		formData.append('C_COUNTRY', data.C_COUNTRY)
		formData.append('C_RES_PURPOSE', data.C_RES_PURPOSE)
		formData.append('C_RES_SUBJECTS', data.C_RES_SUBJECTS)

		// MWI client registration database profile's return html form is not working , Richard also don't know
		// So I put dummy at the return url option. if the mwi return the dummy url that means , registration is succefully done. DON 2024 1025
		return await axios
			.post(`${records[0].save_n_stop_record}&CLOSE=Y&RETURN_URL=dummy`, formData)
			.then((res) => {
				setLoading(false)
				const regex = /window\.location\s*=\s*['"]([^'"]+)['"]/i
				const match = res.data.match(regex)
				if (match && match[1].includes('dummy')) {
					setIsSaveRecordSent(true)
					setStatus(200)
					return
				}
				setStatus(300)
			})
			.catch((error) => {
				throw error
			})
	}

	const handleNextStep = async () => {
		const stepFields = getStepFields(currentStep)
		const stepValidation = await trigger(stepFields as any)

		if (stepValidation) {
			setCurrentStep((prev) => prev + 1)
		}
	}

	const handlePrevStep = () => {
		setCurrentStep((prev) => prev - 1)
	}

	const onCaptchaChange = (token: any) => {
		setRecaptchaToken(token ?? '')
	}

	const showRegStatus = () => {
		return (
			<form onSubmit={handleSubmit(onSubmit)} className="bg-gray-200 p-5 rounded-md w-5/6">
				<Tabs value={`step${currentStep}`}>
					{/* Tabs List */}
					<TabsList className="bg-gray-400 p-5 min-h-[300px] md:min-h-[70px] flex flex-wrap justify-evenly mb-6 w-full text-white">
						{[
							{
								value: 'step1',
								label: `${message.stepLabel} 1: ${message.yourDetailLabel}`,
							},
							{
								value: 'step2',
								label: `${message.stepLabel} 2: ${message.currentAddressLabel}`,
							},
							{
								value: 'step3',
								label: `${message.stepLabel} 3: ${message.surveyLabel}`,
							},
							{
								value: 'step4',
								label: `${message.stepLabel} 4: ${message.confirmation}`,
							},
						].map((tab, idx) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className={`md:w-[190px] px-4 py-2 rounded-md w-full md:w-auto ${
									currentStep > idx + 1 ? 'bg-primary' : 'bg-gray-700'
								}`}
								onClick={() => {
									setRecaptchaToken('')
									setLoading(false)
									setStatus(0)
									currentStep >= idx + 1 && setCurrentStep(idx + 1)
								}}>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>

					{/* Step 1: Your Detail */}
					<TabsContent value="step1" className="p-6 bg-white shadow-md rounded-md">
						<label className="font-semibold">
							{message.email}
							<span className="text-red-500">* </span>
						</label>
						<input
							{...register('C_EMAIL', {
								required: ' ',
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
									message: `${message.validEmailAddress}`,
								},
							})}
							className={`p-2 w-full mt-1 border ${errors.C_EMAIL ? 'border-red-500' : 'border-gray-300'}`}
						/>
						{errors.C_EMAIL && <p className="text-red-500">{errors.C_EMAIL.message}</p>}

						<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4">
							<div className="flex-1">
								<label className="font-semibold">
									{message.password}
									<span className="text-red-500">*</span>
								</label>
								<input
									type="password"
									{...register('PATRON_PID', {
										required: ' ',
										minLength: {
											value: PASSWORD_MIN_LENGTH,
											message: `${message.passwordValidation} ${PASSWORD_MIN_LENGTH} characters`,
										},
										pattern: {
											value: /^(?=.*[A-Z]).*$/, // Regex to ensure at least one uppercase letter
											message: `${message.passwordValidation}`,
										},
									})}
									className={`p-2 w-full mt-1 border ${errors.PATRON_PID ? 'border-red-500' : 'border-gray-300'}`}
								/>
								<p>({message.passwordValidation})</p>
								{errors.PATRON_PID && <p className="text-red-500">{errors.PATRON_PID.message}</p>}
							</div>

							<div className="flex-1">
								<label className="font-semibold">
									{message.confirmPasswordLabel} <span className="text-red-500">*</span>
								</label>
								<input
									type="password"
									{...register('PATRON_PID_RE', {
										required: ' ',
										validate: (value) => value === watch('PATRON_PID') || `${message.passwordsDoNotMatch}`,
									})}
									className={`p-2 w-full mt-1 border ${errors.PATRON_PID_RE ? 'border-red-500' : 'border-gray-300'}`}
								/>
								{errors.PATRON_PID_RE && <p className="text-red-500">{errors.PATRON_PID_RE.message}</p>}
							</div>
						</div>

						<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4">
							<div className="flex-1">
								<label className="font-semibold">
									{message.firstName} <span className="text-red-500">*</span>
								</label>
								<input
									{...register('C_NAME_FIRST', {
										required: ' ',
									})}
									className={`p-2 w-full mt-1 border ${errors.C_NAME_FIRST ? 'border-red-500' : 'border-gray-300'}`}
								/>
							</div>

							<div className="flex-1">
								<label className="font-semibold">
									{message.lastName} <span className="text-red-500">*</span>
								</label>
								<input
									{...register('C_NAME_LAST', {
										required: ' ',
									})}
									className={`p-2 w-full mt-1 border ${errors.C_NAME_LAST ? 'border-red-500' : 'border-gray-300'}`}
								/>
							</div>
						</div>
					</TabsContent>

					{/* Step 2: Current Address */}
					<TabsContent value="step2" className="p-6 bg-white shadow-md rounded-md">
						<label className="font-semibold">
							{message.address} <span className="text-red-500">*</span>
						</label>
						<input
							{...register('C_STREET', {
								required: ' ',
							})}
							className={`p-2 w-full mt-1 border ${errors.C_STREET ? 'border-red-500' : 'border-gray-300'}`}
						/>
						<div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 mt-4">
							<div className="sm:col-span-1">
								<label className="font-semibold">
									{message.city} <span className="text-red-500">*</span>
								</label>
								<input
									{...register('C_CITY', {
										required: ' ',
									})}
									className={`p-2 w-full mt-1 border ${errors.C_CITY ? 'border-red-500' : 'border-gray-300'}`}
								/>
							</div>

							<div className="sm:col-span-1">
								<label className="font-semibold">
									{message.provinceState} <span className="text-red-500">*</span>
								</label>
								<input
									{...register('C_PROV_STATE', {
										required: ' ',
									})}
									className={`p-2 w-full mt-1 border ${errors.C_PROV_STATE ? 'border-red-500' : 'border-gray-300'}`}
								/>
							</div>

							<div className="sm:col-span-1">
								<label className="font-semibold">
									{message.postalCodeLabel} <span className="text-red-500">*</span>
								</label>
								<input
									{...register('C_POSTAL_ZIP', {
										required: ' ',
									})}
									className={`p-2 w-full mt-1 border ${errors.C_POSTAL_ZIP ? 'border-red-500' : 'border-gray-300'}`}
								/>
								{errors.C_POSTAL_ZIP && <p className="text-red-500">{errors.C_POSTAL_ZIP.message}</p>}
							</div>

							<div className="sm:col-span-1">
								<label className="font-semibold">
									{message.country} <span className="text-red-500">*</span>
								</label>
								<input
									{...register('C_COUNTRY', {
										required: ' ',
									})}
									className={`p-2 w-full mt-1 border ${errors.C_COUNTRY ? 'border-red-500' : 'border-gray-300'}`}
								/>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="step3" className="p-6 bg-white shadow-md rounded-md">
						<div className="flex flex-col space-y-2">
							<label className="font-semibold">What is the main reason for wishing to visit?</label>
							<div className="flex flex-col space-y-2">
								<label className="inline-flex items-center">
									<input
										type="radio"
										{...register('C_RES_PURPOSE')}
										value="Personal leisure/recreation"
										className="form-checkbox h-5 w-5 text-blue-600"
									/>
									<span className="ml-2">Personal leisure/recreation</span>
								</label>
							</div>
							<div className="flex flex-col space-y-2">
								<label className="inline-flex items-center">
									<input
										type="radio"
										{...register('C_RES_PURPOSE')}
										value="Non-leisure personal or family business"
										className="form-checkbox h-5 w-5 text-blue-600"
									/>
									<span className="ml-2">Non-leisure personal or family business</span>
								</label>
							</div>
						</div>
					</TabsContent>

					{/* Step 4: Confirmation */}
					<TabsContent value="step4" className="p-6 bg-white shadow-md rounded-md w-full mx-auto">
						<div className={'flex justify-center'}>
							<div>
								<h2 className="text-lg font-semibold text-center mb-4">{message.confirmation}</h2>
								<p className="text-center mb-6">{message.reviewDetails}</p>
								<ul className="list-disc pl-5 space-y-2">
									<li>
										<strong>{message.email}:</strong> {watch('C_EMAIL')}
									</li>
									<li>
										<strong>{message.fullName}:</strong> {`${watch('C_NAME_FIRST')} ${watch('C_NAME_LAST')}`}
									</li>
									<li>
										<strong>{message.address}</strong> {watch('C_STREET')}
									</li>
									<li>
										<strong>{message.city}:</strong> {watch('C_CITY')}
									</li>
									<li>
										<strong>{message.provinceState}:</strong> {watch('C_PROV_STATE')}
									</li>
									<li>
										<strong>{message.country}:</strong> {watch('C_COUNTRY')}
									</li>
									<li>
										<strong>{message.purpose}:</strong> {watch('C_RES_PURPOSE')}
									</li>
								</ul>
								<div className="flex justify-center scale-75 sm:scale-90 mr-[210px] sm:mr-[0px]">
									<ReCAPTCHA
										sitekey={process.env.REACT_APP_RSVP_RECAPTCHA || import.meta.env.VITE_REACT_APP_RECAPTCHA}
										onChange={onCaptchaChange}
									/>
								</div>
								{status === 300 && <p className="text-red-500 text-center mt-2">{message.emailAlreadyRegistered}</p>}
							</div>
						</div>
					</TabsContent>
					{/* Navigation Buttons */}
					<div className="p-4 flex justify-evenly">
						{currentStep > 1 && (
							<button type="button" onClick={handlePrevStep} className="w-[100px] bg-primary text-white px-4 py-2 rounded-md">
								{message.previous}
							</button>
						)}
						<button
							type={currentStep === 4 ? 'submit' : 'button'}
							onClick={currentStep < 4 ? handleNextStep : undefined}
							disabled={currentStep === 4 && !recaptchaToken ? true : false}
							className={`w-[100px] text-white px-4 py-2 rounded-md 
							${currentStep === 4 && !recaptchaToken ? 'bg-gray-400' : 'bg-primary'}
							${currentStep === 4 && !recaptchaToken ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
							{currentStep === 4 ? `${message.submit}` : `${message.next}`}
						</button>
					</div>
				</Tabs>
			</form>
		)
	}

	return (
		<Layout>
			<img
				src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
				alt=""
				className="h-64 w-full object-cover"
			/>
			{status === 200 ? (
				<div className="min-h-[35vh] flex flex-col items-center justify-center p-8 text-center">
					<div className={'m-5'}>
						<CircleCheck className="w-16 h-16 text-green-500" />
					</div>
					<h1 className="landing-page-title">{message.verificationSent}</h1>
					<div className="landing-page-title">'{userData.C_EMAIL}'</div>
					<div className={'text-xl m-4'}>{message.checkEmailInstructions}</div>
					<Button className={'mt-4'}>
						<a href="/">{message.home}</a>
					</Button>
				</div>
			) : (
				<>
					<div className={'flex flex-col justify-center items-center p-7'}>
						<div className={' text-2xl font-extrabold'}>{message.signUpUserAccount}</div>
						<div className={'text-lg'}>{message.fillAllFields}</div>
					</div>
					<div className={'min-h-[460px] w-full flex justify-center items-center mb-4 relative'}>
						{loading && (
							<div className=" h-full w-full  absolute ">
								<Spinner height={'h-full'} spinHeight={'h-20'} spinWidth={'w-20'} background={'bg-gray-400 bg-opacity-30'} />
							</div>
						)}

						{showRegStatus()}
					</div>
				</>
			)}
		</Layout>
	)
}

export default Register
