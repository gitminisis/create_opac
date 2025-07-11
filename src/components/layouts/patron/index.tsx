import ScrollToTopButton from '@/components/common/ScrollToTop'
import React, { useState } from 'react'
import Header from './Header'
import { getCookieValue } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import Footer from '../patron/Footer'
import Link from '@/components/common/Link'
import { colorClasses } from '@/page/dashboard/constants'
import {
	Archive,
	BookMarked,
	CalendarDays,
	Copy,
	Copyright,
	File,
	House,
	Landmark,
	Library,
	Lightbulb,
	MessageCircleMore,
	Search,
	ShoppingBag,
	Upload,
	BookOpen,
	Home,
	ImageUp,
	Clock,
	Truck,
	FileText,
} from 'lucide-react'

type PatronLayoutProps = {
	children?: React.ReactNode
	activeSection?: string
	heading?: string
	mainHeading: any
	isLibrary?: boolean
}

const PatronLayout = ({ children, heading, mainHeading, isLibrary }: PatronLayoutProps) => {
	const m2l_patron_id = getCookieValue('M2L_PATRON_ID')?.split(']')[1]
	const { message, clientProfile, patronLibraryCirculation } = useConstants()
	const profileList = clientProfile.database
	const libraryProfileList = patronLibraryCirculation.database
	const home_url = '?SEARCH&DATABASE=CLIENT_VIEW&REPORT=WEB_CLIENT_PROFILE&EXP=patron_id+~3D+global(m2l_patron_id)'

	const libraryDashboardCards = [
		{
			icon: <BookOpen className="h-4 w-4" />,
			label: 'Checked Out',
			color: 'blue',
			link: libraryProfileList[0].url,
		},
		{
			icon: <Clock className="h-4 w-4" />,
			label: 'On Hold',
			color: 'amber',
			link: libraryProfileList[1].url,
		},
		{
			icon: <Truck className="h-4 w-4" />,
			label: 'In Transit',
			color: 'green',
			link: libraryProfileList[2].url,
		},
		{
			icon: <FileText className="h-4 w-4" />,
			label: 'On Request',
			color: 'purple',
			link: libraryProfileList[3].url,
		},
	]

	const clientDashboardCards = [
		{
			icon: <ShoppingBag className="h-4 w-4" />,
			label: profileList[0].label,
			color: 'blue',
			link: profileList[0].url,
		},
		{
			icon: <Copyright className="h-4 w-4" />,
			label: profileList[1].label,
			color: 'green',
			link: profileList[1].url,
		},
		{
			icon: <Copy className="h-4 w-4" />,
			label: profileList[2].label,
			color: 'red',
			link: profileList[2].url,
		},
		{
			icon: <BookMarked className="h-4 w-4" />,
			label: profileList[3].label,
			color: 'purple',
			link: profileList[3].url,
		},
		{
			icon: <Lightbulb className="h-4 w-4" />,
			label: profileList[4].label,
			color: 'amber',
			link: profileList[4].url,
		},
		{
			icon: <MessageCircleMore className="h-4 w-4" />,
			label: profileList[5].label,
			color: 'orange',
			link: profileList[5].url,
		},
		{
			icon: <ImageUp className="h-4 w-4" />,
			label: profileList[6].label,
			color: 'indigo',
			link: profileList[6].url,
		},
		{
			icon: <BookOpen className="h-4 w-4" />,
			label: profileList[7].label,
			color: 'yellow',
			link: profileList[7].url,
		},
	]

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40 relative">
			{/* <Sidebar /> */}
			<div className="flex-1 flex flex-col relative">
				<Header />
				<main className="container grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 pb-4 mt-3">
					<Link href={getCookieValue('HOME_SESSID') + home_url} className="flex items-center no-underline text-lg  ">
						{mainHeading}
					</Link>
					<div className="flex flex-wrap gap-2 sm:gap-4 ">
						{!isLibrary ? (
							<>
								{clientDashboardCards.map((card, index) => {
									const isSpecialLabel = card.label === 'Bookmarks' || card.label === 'Library Portal'
									const href = getCookieValue('HOME_SESSID') + card.link + (isSpecialLabel ? '' : m2l_patron_id)
									return (
										<a key={index} href={href} className={buttonVariants({ variant: 'outline' }) + 'p-2'}>
											<div className="flex items-center justify-center gap-2">
												<div className={`rounded-full p-1 ${colorClasses[card.color as keyof typeof colorClasses]}`}>
													{card.icon}
												</div>
												<span className="text-sm text-black-500">{card.label}</span>
											</div>
										</a>
									)
								})}
								{/* Calendar profile list need different url so it is separated from the profilelist, 20240207 Don Ryu */}
								<a
									key={'Calendar'}
									href={`/scripts/mwimain.dll/144/WEB_CALENDAR/WEB_CALENDAR_PROFILE?commandsearch&exp=%2B%2B%40&EXP=TAG_FUNC_P_ID%20${m2l_patron_id}&M_GVAR1=USER_ID:${m2l_patron_id}`}
									className={buttonVariants({ variant: 'outline' })}>
									<div className="flex items-center justify-center gap-2">
										<div className={`rounded-full p-1 ${colorClasses['pink']}`}>
											<CalendarDays className="h-4 w-4" />
										</div>
										<span className="text-sm text-black-500">{message.calendar}</span>
									</div>
								</a>
							</>
						) : (
						<>
							{libraryDashboardCards.map((card, index) => {
								const isSpecialLabel = card.label === 'Bookmarks' || card.label === 'Library Portal'
								const href = getCookieValue('HOME_SESSID') + card.link + (isSpecialLabel ? '' : m2l_patron_id)
								return (
									<a key={index} href={href} className={buttonVariants({ variant: 'outline' }) + 'p-2'}>
										<div className="flex items-center justify-center gap-2">
											<div className={`rounded-full p-1 ${colorClasses[card.color as keyof typeof colorClasses]}`}>
												{card.icon}
											</div>
											<span className="text-sm text-black-500">{card.label}</span>
										</div>
									</a>
								)
							})}</>
						)}
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
