import { cn } from '@/lib/utils'
import React from 'react'
import Footer from './Footer'
import Header from './Header'

const Layout = ({ children, className }: React.ComponentProps<'div'>) => {
	return (
		<div className={cn('flex flex-col items-center justify-center min-h-screen ', className)}>
			<Header />
			<main className="flex-grow w-full max-w-screen">{children}</main>
			<Footer />
		</div>
	)
}

export default Layout
