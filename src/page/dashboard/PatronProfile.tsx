import Link from '@/components/common/Link'
import PatronLayout from '@/components/layouts/patron'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { getCookieValue } from '@/lib/utils'
import {
	Archive,
	BookMarked,
	CalendarDays,
	Copy,
	Copyright,
	File,
	Landmark,
	Library,
	Lightbulb,
	MessageCircleMore,
	ShoppingBag,
} from 'lucide-react'
import { useState } from 'react'

interface StatCardProps {
	key: number
	icon: React.ReactNode
	label: string
	color: string
	value: any
}

export default function PatronProfile() {
	const { records } = useJSONData({ selector: '#xml_record' })
	const [activeButton, setActiveButton] = useState(null)
	const { home, archives, museum, library, message, clientProfile } = useConstants()
	const profileList = clientProfile.database
	const m2l_patron_id = getCookieValue('M2L_PATRON_ID')?.split(']')[1]
	const handleClick = (id: any) => {
		setActiveButton(id)
	}

	const statCards = [
		{
			key: 1,
			icon: <ShoppingBag className="h-4 w-4" />,
			label: profileList[0].label,
			color: 'blue',
			value: records[0].orders_count,
		},
		{
			key: 2,
			icon: <Copyright className="h-4 w-4" />,
			label: profileList[1].label,
			color: 'green',
			value: records[0].copyright_count,
		},
		{
			key: 3,
			icon: <Copy className="h-4 w-4" />,
			label: profileList[2].label,
			color: 'red',
			value: records[0].reproductions_count,
		},
		{
			key: 4,
			icon: <BookMarked className="h-4 w-4" />,
			label: profileList[3].label,
			color: 'purple',
			value: records[0].bookmark_count,
		},
		{
			key: 5,
			icon: <Lightbulb className="h-4 w-4" />,
			label: profileList[4].label,
			color: 'amber',
			value: records[0].enquiries_count,
		},
		{
			key: 6,
			icon: <MessageCircleMore className="h-4 w-4" />,
			label: profileList[5].label,
			color: 'orange',
			value: records[0].crowdsource_count,
		},
		{
			key: 7,
			icon: <CalendarDays className="h-4 w-4" />,
			label: message.calendar,
			color: 'pink',
			value: records[0].calendar_count,
		},
	]
	function StatCard({ icon, label, value, color }: StatCardProps) {
		const colorClasses = {
			blue:   'bg-blue-100 text-blue-500',
			green:  'bg-green-100 text-green-500',
			red:    'bg-red-100 text-red-500',
			purple: 'bg-purple-100 text-purple-500',
			amber:  'bg-amber-100 text-amber-500',
			orange: 'bg-orange-100 text-orange-500',
			pink:   'bg-pink-100 text-pink-500',
		} as const

		return (
			<div className="rounded-md bg-white p-6 shadow">
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-center gap-2">
						<div
							className={`rounded-full p-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
							{icon}
						</div>
						<span className="text-sm text-gray-500">{label}</span>
					</div>
					<div className="flex items-baseline justify-center">
						<h3 className="text-2xl font-bold">{value || 0}</h3>
					</div>
				</div>
			</div>
		)
	}
	return (
		<PatronLayout heading="">
			<div className="mb-4 rounded-md bg-white p-6 shadow">
				<h1 className="text-3xl font-semibold text-gray-800">
					{message.welcome} {records[0]?.full_name || 'User'}!
				</h1>
				<p className="mt-2">{message.welcomeMessage}</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{statCards.map((card, index) => (
					<StatCard
						key={card.key}
						icon={card.icon}
						label={card.label}
						color={card.color}
						value={card.value}
					/>
				))}
			</div>

			{/* Recent Media Section */}
			<div className="space-y-4 min-h-[550px]">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-medium">
						<span>{message.searchDatabase}</span>
					</h2>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{[home, archives, museum, library].map((item, index) => (
						<div
							key={index}
							className="overflow-hidden rounded-md bg-white shadow hover:brightness-95">
							<Link href={item.linkURL} className="group no-underline">
								<div className="aspect-square relative overflow-hidden">
									<img
										src={item.heroBanner}
										alt={`Recent media ${index + 1}`}
										className="h-full w-full object-cover transition ease-in-out duration-150 group-hover:scale-105"
									/>
								</div>
								<div className="p-4">
									<div className="flex items-center justify-between text-sm text-gray-500">
										<div className="flex items-center gap-2">
											{item === home && <File className="w-5 h-5" />}
											{item === archives && <Archive className="w-5 h-5" />}
											{item === museum && <Landmark className="w-5 h-5" />}
											{item === library && <Library className="w-5 h-5" />}

											{item === home
												? Number(records[0].description_count) +
													Number(records[0].collection_count) +
													Number(records[0].biblio_count)
												: item === archives
													? records[0].description_count
													: item === museum
														? records[0].collection_count
														: item === library
															? records[0].biblio_count
															: ''}
										</div>
										<span>{item.displayTitle}</span>
									</div>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</PatronLayout>
	)
}
