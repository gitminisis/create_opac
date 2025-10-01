import Button from '@/components/common/admin/Button'
import AdminLayout from '@/components/layouts/admin'
import { Input } from '@/components/ui/input'
import { useAdminAuth } from '@/providers/AdminAuthProvider'
import { useState } from 'react'

const AdminLogin = () => {
	return (
		<AdminLayout>
			<div className="w-full max-w-3xl space-y-6 text-center mx-auto">
				<h1 className="text-4xl font-bold text-slate-700 md:text-5xl">MINISIS Template Toolkit</h1>

				<p className="text-lg text-slate-600">Welcome to MTT. Please login with your provided credential to access your account.</p>

				<AdminLoginForm />
			</div>
		</AdminLayout>
	)
}

const AdminLoginForm = () => {
	const { signIn } = useAdminAuth()
	const [username, setUsername] = useState('')

	const [password, setPassword] = useState('')

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				signIn(username, password)
			}}
			className="space-y-4">
			<Input
				className="max-w-xl mx-auto h-12 text-lg"
				placeholder="Enter your Username"
				type="text"
				required
				onChange={(e) => setUsername(e.currentTarget.value)}
			/>
			<Input
				className="max-w-xl mx-auto h-12 text-lg"
				placeholder="Enter your Password"
				type="password"
				required
				onChange={(e) => setPassword(e.currentTarget.value)}
			/>

			<Button type="submit" className="h-12 px-8 text-lg text-white bg-[#0B2C4D] hover:bg-[#0B2C4D]/90">
				Login
			</Button>
		</form>
	)
}

export default AdminLogin
