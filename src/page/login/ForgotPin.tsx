import Layout from '@/components/layouts'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PASSWORD_MIN_LENGTH } from './Register'
import { Button } from '@/components/ui/button'
import { CircleCheck } from 'lucide-react'
import useConstants from '@/hooks/useConstants'
import axios from 'axios'
import Spinner from '@/components/common/event-calendar/Spinner'

type ResetFormData = {
	PATRON_ID: string
}

const EMAIL_CONFIRM_CODE = '267'
const CLIENT_LOGIN_ERROR = 'client-login-error'

const ResetPin = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			PATRON_ID: '',
		},
	})
	const [status, setStatus] = useState<string>('')
	const [loading, setLoading] = useState(false)
	const { message } = useConstants()

	const onSubmit = async (data: ResetFormData) => {
		setLoading(true)
		const formData = new FormData()
		formData.append('PATRON_ID', data.PATRON_ID)
		// Application name is not the matter, it need to use m2l extention at the site profile and follow the m2l extention's default databsae
		// m2l extention's config is at the parameter database.
		axios
			.post(
				`/scripts/mwimain.dll?emailpassword&application=UNION_VIEW&language=144&from=noreply@minisisinc.com&SUBJECT=${message.forgotpasswordEmailTitle}`,
				formData
			)
			.then((res) => {
				const parser = new DOMParser()
				const doc = parser.parseFromString(res.data, 'text/html')
				const element = (doc.getElementById('MWI-error') as HTMLInputElement) || (doc.getElementById('root') as HTMLInputElement)
				const value = element?.value ?? element?.getAttribute('data-id')
				setStatus(value)
				setLoading(false)
			})
	}

	return (
		<Layout>
			<img
				src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
				alt=""
				className="h-64 w-full object-cover"
			/>
			{loading && (
				<div className="flex h-full items-center justify-center">
					<Spinner height={'h-full'} spinHeight={'h-20'} spinWidth={'w-20'} background={'bg-white'} />
				</div>
			)}
			{status === EMAIL_CONFIRM_CODE ? (
				<div className="min-h-[35vh] flex flex-col items-center justify-center p-8 text-center">
					<div className={'m-5'}>
						<CircleCheck className="w-16 h-16 text-green-500" />
					</div>
					<h1 className="landing-page-title">{message.verificationSent}</h1>
					<div className={'text-xl m-4'}>{message.checkEmailInstructions}</div>
				</div>
			) : (
				<div className={'min-h-[460px] flex  justify-center items-center mb-4'}>
					<form onSubmit={handleSubmit(onSubmit)} className="bg-gray-200 p-5 rounded-md w-5/6 flex flex-col justify-center items-center">
						<div className="landing-page-title"> {message.forgotPassword}</div>
						<div className={'text-xl m-4 max-w-[560px]'}>{message.forgottenPasswordInstructions}</div>

						<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4">
							<div className="flex-1">
								<label className="font-semibold">
									{message.cardNumber} <span className="text-red-500">*</span>
								</label>
								<input
									disabled={loading}
									{...register('PATRON_ID', {
										required: `${message.cardNumberRequired}`,
										minLength: {
											value: PASSWORD_MIN_LENGTH,
											message: `${message.cardNumberRequired}`,
										},
									})}
									className={`p-2 w-full mt-1 border ${errors.PATRON_ID ? 'border-red-500' : 'border-gray-300'}`}
								/>
								{(status === '200' || status === CLIENT_LOGIN_ERROR) && <p className="text-red-500">{message.unknownPatronName}</p>}
							</div>
						</div>
						<div className={'w-[272px] flex justify-evenly'}>
							<Button className={'mt-5 w-[100px]'} disabled={loading}>
								{message.submit}
							</Button>
							<a
								href="/"
								onClick={(e) => {
									e.preventDefault()
									window.location.href = '/'
								}}>
								<Button className={'mt-5 w-[100px]'}>{message.cancel}</Button>
							</a>
						</div>
					</form>
				</div>
			)}
		</Layout>
	)
}

export default ResetPin
