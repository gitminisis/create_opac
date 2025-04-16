import Layout from '@/components/layouts'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PASSWORD_MIN_LENGTH } from './Register'
import { Button } from '@/components/ui/button'
import { CircleCheck } from 'lucide-react'
import useConstants from '@/hooks/useConstants'
import Spinner from '@/components/common/event-calendar/Spinner'
import axios from 'axios'

type ResetFormData = {
	PATRON_PID: string
	PATRON_PID_RE: string
}

const ResetPin = () => {
	const {
		register,
		handleSubmit,
		watch,
		trigger,
		formState: { errors },
	} = useForm({
		defaultValues: {
			PATRON_PID: '',
			PATRON_PID_RE: '',
		},
	})
	const { message } = useConstants()
	const [loading, setLoading] = useState(false)
	const [parm1Value, setParm1Value] = useState<string | null>('')
	const [status, setStatus] = useState<string>('')

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const parm1 = urlParams.get('parm1')
		setParm1Value(parm1)
	}, [])

	const onSubmit = async (data: ResetFormData) => {
		setLoading(true)
		const formData = new FormData()
		formData.append('PATRON_PID', data.PATRON_PID)
		formData.append('NEW_PATRON_PID', data.PATRON_PID)
		formData.append('PASSCODE', parm1Value ?? '')

		// save_n_stop_record need a return url but react doesn't need it so I add dummy &RETURN_URL=[OPAC]register-confirm.html
		return await axios
			.post(
				`/SCRIPTS/MWIMAIN.DLL?RESETPASSWORD&application=reset_pin&language=144&file=[OPAC]reset_password_confirmation.html`,
				formData
			)
			.then((res) => {
				const parser = new DOMParser()
				const doc = parser.parseFromString(res.data, 'text/html')
				const inputElement = doc.getElementById('MWI-error') as HTMLInputElement
				const value = inputElement?.value
				setStatus(value ?? '200') // if no value, that means success, 200 means password is successfully changed
				setLoading(false)
			})
			.catch((error) => {
				throw error
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
					<Spinner
						height={'h-full'}
						spinHeight={'h-20'}
						spinWidth={'w-20'}
						background={'bg-white'}
					/>
				</div>
			)}
			{status === '200' ? (
				<div className="min-h-[35vh] flex flex-col items-center justify-center p-8 text-center">
					<div className={'m-5'}>
						<CircleCheck className="w-16 h-16" />
					</div>
					<h1 className="landing-page-title">{message.resetPasswordConfirmation}</h1>
					<div className={'text-xl m-4'}>{message.passwordChangeSuccess}</div>
					<Button className={'mt-4'}>
						<a href="/login.html">{message.logIn}</a>
					</Button>
				</div>
			) : (
				<div className={'min-h-[460px] flex  justify-center items-center mb-4'}>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="bg-gray-200 p-5 rounded-md w-5/6 flex flex-col justify-center items-center">
						<div className="landing-page-title"> {message.password}</div>
						<div className={'text-xl m-4 text-center'}>{message.enterNewPassword}</div>
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
								{errors.PATRON_PID && (
									<p className="text-red-500">{errors.PATRON_PID.message}</p>
								)}
							</div>

							<div className="flex-1">
								<label className="font-semibold">
									{message.confirmPasswordLabel}{' '}
									<span className="text-red-500">*</span>
								</label>
								<input
									type="password"
									{...register('PATRON_PID_RE', {
										required: `${message.passwordsDoNotMatch}`,
										validate: (value) =>
											value === watch('PATRON_PID') ||
											`${message.passwordsDoNotMatch}`,
									})}
									className={`p-2 w-full mt-1 border ${errors.PATRON_PID_RE ? 'border-red-500' : 'border-gray-300'}`}
								/>
								{errors.PATRON_PID_RE && (
									<p className="text-red-500">{errors.PATRON_PID_RE.message}</p>
								)}
							</div>
						</div>
						{status === '208' && (
							<p className="text-red-500 my-2">{message.newPasswordSameAsOld}</p>
						)}
						<Button className={'mt-5'}>{message.submit}</Button>
					</form>
				</div>
			)}
		</Layout>
	)
}

export default ResetPin
