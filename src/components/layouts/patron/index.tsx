import ScrollToTopButton from '@/components/common/ScrollToTop'
import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import useJSONData from '@/hooks/useJSONData'
import { getCookieValue } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import Footer from '../patron/Footer'

type PatronLayoutProps = {
	children?: React.ReactNode
	activeSection?: string
	heading?: string
}

const PatronLayout = ({ children, activeSection, heading }: PatronLayoutProps) => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const [activeButton, setActiveButton] = useState(null)
	const m2l_patron_id = getCookieValue('M2L_PATRON_ID')?.split(']')[1]
	const handleClick = (id: any) => {
		setActiveButton(id) // Set the clicked button as active
	}

	const { message, clientProfile } = useConstants()
	const profileList = clientProfile.database

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40 relative">
			{/* <Sidebar /> */}
			<div className="flex-1 flex flex-col relative">
				<Header />
				<main className="container grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 pb-4">
					<div className="flex flex-col gap-8 pt-4">
						<div className="flex flex-wrap gap-2 sm:gap-4">
							{profileList.map((button) => (
								<a
									key={button.id}
									href={
										getCookieValue('HOME_SESSID') +
										button.url +
										(button.db !== 'SHOWORDERLIST' ? m2l_patron_id : '')
									}
									onClick={() => handleClick(button.id)}
									className={buttonVariants({ variant: 'outline' })}>
									{button.label}
								</a>
							))}
							{/* Calendar profile list need different url so it is separated from the profilelist, 20240207 Don Ryu */}
							<a
								key={'Calendar'}
								href={`/scripts/mwimain.dll/144/WEB_CALENDAR/WEB_CALENDAR_PROFILE?commandsearch&exp=%2B%2B%40&EXP=TAG_FUNC_P_ID%20${m2l_patron_id}&M_GVAR1=USER_ID:${m2l_patron_id}`}
								className={buttonVariants({ variant: 'outline' })}>
								{message.calendar}
							</a>
						</div>
					</div>
					{heading && <h1 className="text-2xl font-bold">{heading}</h1>}
					{children}
				</main>
				<ScrollToTopButton />
			</div>
			<Footer />
		</div>
	)
}

export default PatronLayout
