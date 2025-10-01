import ScrollToTopButton from '@/components/common/ScrollToTop'
import React, { useState } from 'react'
import Header from './Header'
import useJSONData from '@/hooks/useJSONData'
import Footer from './Footer'

type PatronLayoutProps = {
	children?: React.ReactNode
	activeSection?: string
	heading?: string
}

const AccountSettingsLayout = ({ children, activeSection, heading }: PatronLayoutProps) => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const [activeButton, setActiveButton] = useState(null)
	const handleClick = (id: any) => {
		setActiveButton(id) // Set the clicked button as active
	}

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40 relative">
			<div className="flex-1 flex flex-col relative">
				<Header />

				<main className="container grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 pb-4 mt-3">
					{heading && <h1 className="text-2xl font-bold">{heading}</h1>}
					{children}
				</main>
				<ScrollToTopButton />
			</div>
			<Footer />
		</div>
	)
}

export default AccountSettingsLayout
