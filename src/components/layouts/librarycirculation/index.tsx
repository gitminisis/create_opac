import { useRef, useState } from 'react'
import { BookOpen, Clock, Truck, FileText, Bell, Home, ClockAlert, CircleDollarSign, Check } from 'lucide-react'
import { NotificationBanner } from './NotificationBanner'
import PatronLayout from '../patron'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { StatCardProps } from '@/page/dashboard/PatronProfile'
import { convertToArr, getCookieValue, getHomeSessionID } from '@/lib/utils'
import { colorClasses } from '@/page/dashboard/constants'
import RequestOn from './RequestOn'
import HoldOn from './HoldOn'
import TransitOn from './TransitOn'
import CheckedOut from './CheckedOut'
import { Button, buttonVariants } from '@/components/ui/button'
import axios from 'axios'

export default function LibraryDashboard() {
	const { records } = useJSONData({ selector: '#xml_record' })
	const record = records[0]
	const { message, patronLibraryCirculation } = useConstants()
	const libraryProfileList = patronLibraryCirculation.database
	const [notifications, setNotifications] = useState(convertToArr(record.p_blk_message))
	const onRequestRef = useRef<HTMLDivElement>(null)
	const onHoldRef = useRef<HTMLDivElement>(null)
	const inTransitRef = useRef<HTMLDivElement>(null)
	const checkedOutRef = useRef<HTMLDivElement>(null)

	const statCards = [
		{
			icon: <FileText className="h-4 w-4" />,
			label: libraryProfileList[3].label,
			color: 'purple',
			value: record.wait_count,
			ref: onRequestRef,
		},
		{
			icon: <Clock className="h-4 w-4" />,
			label: libraryProfileList[1].label,
			color: 'amber',
			value: record.hold_count,
			ref: onHoldRef,
		},
		{
			icon: <Truck className="h-4 w-4" />,
			label: libraryProfileList[2].label,
			color: 'green',
			value: record.transit_count,
			ref: inTransitRef,
		},
		{
			icon: <BookOpen className="h-4 w-4" />,
			label: libraryProfileList[0].label,
			color: 'blue',
			value: record.circ_count,
			ref: checkedOutRef,
		},
	]

	const scrollTo = (ref: React.RefObject<HTMLDivElement>, offset = -130) => {
		if (!ref.current) return
		const top = ref.current.getBoundingClientRect().top + window.scrollY + offset
		window.scrollTo({ top, behavior: 'smooth' })
	}

	const dismissNotification = async (idx: number) => {
		let xmlFormDelete = `<?xml version="1.0" encoding="UTF-8"?>
    <RECORD>
		<P_BLK_MESSAGE op="del" OCC="${idx + 1}">
		</P_BLK_MESSAGE>
    </RECORD>`

		return await axios
			.post(`${getHomeSessionID()}?manipxmlrecord&database=PATRON&READ=N&KEY=SISN&VALUE=${record.sisn}`, xmlFormDelete, {
				headers: {
					'Content-Type': 'text/xml',
				},
				withCredentials: true,
				timeout: 5000,
			})
			.then(() => {
				setNotifications(notifications.filter((_, i) => i !== idx))
			})
	}

	return (
		<PatronLayout
			isLibrary={true}
			mainHeading={
				<>
					<BookOpen className="mr-1 h-5 w-5" />
					<h2 className="text-lg font-semibold text-gray-900">{message.libraryPortal}</h2>
				</>
			}>
			<div className="flex flex-wrap gap-2 sm:gap-4 ">
				{statCards.map((card, index) => {
					return (
						<Button variant={'outline'} onClick={() => scrollTo(card.ref)} key={index}>
							<div className="flex items-center justify-center gap-2">
								<div className={`rounded-full p-1 ${colorClasses[card.color as keyof typeof colorClasses]}`}>{card.icon}</div>
								<span className="text-sm text-black-500">{card.label}</span>
							</div>
						</Button>
					)
				})}
			</div>

			{notifications.length > 0 && (
				<div className="mb-2">
					<div className="flex items-center gap-2 mb-4">
						<Bell className="h-5 w-5 text-gray-600" />
						<h2 className="text-lg font-semibold text-gray-900">{message.notifications}</h2>
					</div>
					<div className="space-y-3 max-h-[150px] overflow-auto">
						{notifications.map((notification, index) => (
							<NotificationBanner key={index} message={notification} type={'info'} onDismiss={() => dismissNotification(index)} />
						))}
					</div>
				</div>
			)}

			<div className="mb-4 rounded-md bg-white p-6 shadow">
				<h1 className="text-3xl font-semibold text-gray-800">
					{message.welcome} {records[0]?.patron_name || 'User'}!
				</h1>
				<p className="mt-2 "> {message.welcomeMessageLibrary}</p>
			</div>

			<div className="mb-4 rounded-md bg-white p-3 shadow">
				<div className={'pb-2 text-lg font-semibold text-gray-900'}>{message.yourLibraryMaterials}</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{statCards.map((card, index) => (
						<div className=" cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50">
							<div className="rounded-md bg-white p-6 shadow" onClick={() => scrollTo(card.ref)} key={index}>
								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-center gap-2">
										<div className={`rounded-full p-2 ${colorClasses[card.color as keyof typeof colorClasses]}`}>{card.icon}</div>
										<span className="text-sm text-gray-500">{card.label}</span>
									</div>
									<div className="flex items-baseline justify-center">
										<h3 className="text-2xl font-bold">{card.value || 0}</h3>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="mb-4 rounded-md bg-white p-3 shadow">
				<div className={'pb-2 text-lg font-semibold text-gray-900'}>{message.currentNotices}</div>
				<div className={'grid gap-2 grid-cols-2'}>
					<div className="rounded-md bg-white p-6 shadow">
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-center gap-2">
								<div className={`rounded-full p-2 ${colorClasses['red']}`}>{<CircleDollarSign />}</div>
								<span className="text-sm text-gray-500">{message.finesDue}</span>
							</div>
							<div className="flex items-baseline justify-center">
								<h3 className="text-2xl font-bold">{record.fine_due}</h3>
							</div>
						</div>
					</div>
					<div className="rounded-md bg-white p-6 shadow">
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-center gap-2">
								<div className={`rounded-full p-2 ${colorClasses['orange']}`}>{<ClockAlert />}</div>
								<span className="text-sm text-gray-500">{message.overdueItems}</span>
							</div>
							<div className="flex items-baseline justify-center">
								<h3 className="text-2xl font-bold">{record.overdue_items}</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div ref={checkedOutRef}>
				<CheckedOut />
			</div>
			<div ref={onHoldRef}>
				<HoldOn />
			</div>
			<div ref={inTransitRef}>
				<TransitOn />
			</div>
			<div ref={onRequestRef}>
				<RequestOn />
			</div>
		</PatronLayout>
	)
}
