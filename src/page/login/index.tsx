import { LanguageSelect } from '@/components/common/LanguageSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useConstants from '@/hooks/useConstants'
import { getHomeSessionID } from '@/lib/utils'
import { useState } from 'react'

const Login = () => {
	const { config } = useConstants()
	const [accountNumber, setAccountNumber] = useState('')
	const [password, setPassword] = useState('')
	const { message } = useConstants()

	return (
		<section className="bg-white">
			<div className="lg:grid lg:min-h-screen lg:grid-cols-12">
				<aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
					<img
						alt=""
						src="https://images.unsplash.com/photo-1537202108838-e7072bad1927?q=80&w=1946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						className="absolute inset-0 h-full w-full object-cover"
					/>
				</aside>

				<main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
					<div className="w-full">
						<div className={'flex items-center justify-between'}>
							<div className={'flex items-center'}>
								<a className="block text-teal-600" href="/">
									<img className="h-14" src={config.logo} alt="logo" />
								</a>
								<h1 className="ml-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
									{message.logIn}
								</h1>
							</div>
							<LanguageSelect />
						</div>
						<form
							method="post"
							action={
								password && accountNumber
									? getHomeSessionID() +
										'/scripts/mwimain.dll?patronlogin&application=UNION_VIEW&language=144&file=[OPAC]loginSuccessful.html'
									: '/scripts/mwimain.dll?get&file=[OPAC]login.html'
							}
							className="mt-8 grid grid-cols-6 gap-6">
							<div className="col-span-6">
								<label
									htmlFor="user"
									className="block text-sm font-medium text-gray-700">
									{message.accountNumber}
								</label>
								<Input
									type="text"
									id="user"
									name="C_CLIENT_NUMBER"
									value={accountNumber}
									onChange={(e) => setAccountNumber(e.target.value)}
								/>
							</div>
							<div className="col-span-6 sm:col-span-6">
								<label
									htmlFor="Password"
									className="block text-sm font-medium text-gray-700">
									{message.password}
								</label>
								<Input
									type="password"
									id="Password"
									name="PATRON_PID"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							<div className="col-span-6 sm:flex sm:items-center sm:gap-4">
								<Button
									className="bg-opac-darkblue"
									type="submit"
									variant="default">
									{message.logIn}
								</Button>
							</div>
						</form>
						<div className={'flex mt-1'}>
							<div>{message.noLogin}</div>
							<a
								href={`/scripts/mwimain.dll/144/CLIENT_VIEW?DIRECTSEARCH`}
								className={'border-b-2 border-b-black ml-[10px] h-[22px]'}>
								{message.createAccount}
							</a>
						</div>
						<div>
							<a
								href={`/forgot-pin.html`}
								className={'border-b-2 border-b-black h-[22px]'}>
								{message.forgotPassword}
							</a>
						</div>
					</div>
				</main>
			</div>
		</section>
	)
}

export default Login
