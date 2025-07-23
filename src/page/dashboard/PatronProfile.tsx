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
} from 'lucide-react'
import { colorClasses } from './constants'

export interface StatCardProps {
	icon: React.ReactNode
	label: string
	color: string
	value: any
}

export default function PatronProfile() {
	const { records } = useJSONData({ selector: '#xml_record' })
	const { home, archives, museum, library, message, clientProfile } = useConstants()
	const profileList = clientProfile.database
	const m2l_patron_id = getCookieValue('M2L_PATRON_ID')?.split(']')[1]


	const clientDashboardCards = [
		{
			icon: <ShoppingBag className="h-4 w-4" />,
			label: profileList[0].label,
			color: 'blue',
			value: records[0].orders_count,
			link: profileList[0].url,
		},
		{
			icon: <Copyright className="h-4 w-4" />,
			label: profileList[1].label,
			color: 'green',
			value: records[0].copyright_count,
			link: profileList[1].url,
		},
		{
			icon: <Copy className="h-4 w-4" />,
			label: profileList[2].label,
			color: 'red',
			value: records[0].reproductions_count,
			link: profileList[2].url,
		},
		{
			icon: <BookMarked className="h-4 w-4" />,
			label: profileList[3].label,
			color: 'purple',
			value: records[0].bookmark_count,
			link: profileList[3].url,
		},
		{
			icon: <Lightbulb className="h-4 w-4" />,
			label: profileList[4].label,
			color: 'amber',
			value: records[0].enquiries_count,
			link: profileList[4].url,
		},
		{
			icon: <MessageCircleMore className="h-4 w-4" />,
			label: profileList[5].label,
			color: 'orange',
			value: records[0].crowdsource_count,
			link: profileList[5].url,
		},
		{
			icon: <BookOpen className="h-4 w-4" />,
			label: profileList[7].label,
			color: 'yellow',
			value: records[0].biblio_r_count,
			link: profileList[7].url,
		},
	]

	function StatCard({ icon, label, value, color }: StatCardProps) {
		return (
			<div className="rounded-md bg-white p-6 shadow">
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-center gap-2">
						<div className={`rounded-full p-2 ${colorClasses[color as keyof typeof colorClasses]}`}>{icon}</div>
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
		<PatronLayout
			
			mainHeading={
				<>
					<Home className="mr-1 h-5 w-5" />
					<h2 className="text-lg font-semibold text-gray-900">{message.clientDashboard}</h2>
				</>
			}>
			<div className="mb-4 rounded-md bg-white p-6 shadow">
				<h1 className="text-3xl font-semibold text-gray-800">
					{message.welcome} {records[0]?.full_name || 'User'}!
				</h1>
				<p className="mt-2">{message.welcomeMessage}</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{clientDashboardCards.map((card, index) => {
					const isSpecialLabel = card.label === 'Bookmarks' || card.label === 'Library Portal'
					const href = getCookieValue('HOME_SESSID') + card.link + (isSpecialLabel ? '' : m2l_patron_id)

					return (
						<a key={index} href={href} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50">
							<StatCard icon={card.icon} label={card.label} color={card.color} value={card.value} />
						</a>
					)
				})}
				{/* Calednar statCard's Anchor tag should be different, it uses commandsearch so never need seesion id, I made seperate StatCard for Calendar. Don Ryu 20250402 */}
				<a
					href={`/scripts/mwimain.dll/144/WEB_CALENDAR/WEB_CALENDAR_PROFILE?commandsearch&exp=%2B%2B%40&EXP=TAG_FUNC_P_ID%20${m2l_patron_id}&M_GVAR1=USER_ID:${m2l_patron_id}`}
					className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50">
					<StatCard
						key={8}
						icon={<CalendarDays className="h-4 w-4" />}
						label={message.calendar}
						color={'pink'}
						value={records[0].calendar_count}
					/>
				</a>
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
						<div key={index} className="overflow-hidden rounded-md bg-white shadow hover:brightness-95">
							<Link href={item.linkURL} className="group no-underline">
								<div className="aspect-square relative overflow-hidden">
									<img
										loading={'lazy'}
										src={item.heroBanner}
										alt={`Recent media ${index + 1}`}
										className="h-full w-full object-cover transition ease-in-out duration-150 group-hover:scale-105"
									/>
								</div>
								<div className="p-4">
									<div className="flex items-center justify-between text-sm text-gray-500">
										<div className="flex items-center gap-2">
											{item === home && <House className="w-5 h-5" />}
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
