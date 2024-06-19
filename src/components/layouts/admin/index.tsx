import React from 'react'
import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'

type AdminLayoutProps = {
	children?: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40 relative">
			<Sidebar />
			<div className="min-h-screen flex flex-col sm:gap-4 sm:pt-4 sm:pl-14 relative">
				<Header />
				<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
					{children}
				</main>
				<Footer />
			</div>
		</div>
	)
}

export default AdminLayout
