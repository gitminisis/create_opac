import useConstants from '@/hooks/useConstants'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Login = () => {
	const { config } = useConstants()
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
						<a className="block text-blue-600" href="/">
							<span className="sr-only">Home</span>
							Home
						</a>

						<h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
							Account Login
						</h1>

						{/* <p className="mt-4 leading-relaxed text-gray-500"></p> */}

						<form
							method="POST"
							action="/scripts/mwimain.dll?patronlogin&application=UNION_VIEW&language=144&file=[OPAC]home.html"
							className="mt-8 grid grid-cols-6 gap-6">
							<div className="col-span-6">
								<label
									htmlFor="Email"
									className="block text-sm font-medium text-gray-700">
									Account Number
								</label>
								<Input type="text" id="Email" name="email" />
							</div>

							<div className="col-span-6 sm:col-span-6">
								<label
									htmlFor="Password"
									className="block text-sm font-medium text-gray-700">
									Password
								</label>
								<Input type="password" id="Password" name="password" />
							</div>

							<div className="col-span-6 sm:flex sm:items-center sm:gap-4">
								<Button
									className="bg-opac-darkblue"
									type="submit"
									variant="default">
									Login
								</Button>
							</div>
						</form>
					</div>
				</main>
			</div>
		</section>
	)
}

export default Login
