import ScrollToTopButton from '@/components/common/ScrollToTop'
import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { AdminAuthProvider } from '@/providers/AdminAuthProvider'
import { LoadingOverlayProvider } from '@/providers/LoadingOverlayProvider'

type AdminLayoutProps = {
	children?: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
	return (
		<LoadingOverlayProvider>
			<AdminAuthProvider>
				<div className="flex min-h-screen w-full flex-col bg-muted/40 relative">
					<Header />
					<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-8 grid-cols-1 ">
						{children}
					</main>
					<ScrollToTopButton />
					<Footer />
				</div>
			</AdminAuthProvider>
		</LoadingOverlayProvider>
	)
}

export default AdminLayout
