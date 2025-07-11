import Link from '@/components/common/Link'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import clientProfileJSON from '@/constants/en/client-profile.json'
import { getCookieValue } from '@/lib/utils'
import { BookMarked, CalendarDays, Copy, Copyright, FileX, Home, Lightbulb, MessageCircleMore, Settings, ShoppingBag, Upload } from 'lucide-react'

const Sidebar = () => {
	const m2l_patron_id = getCookieValue('M2L_PATRON_ID')?.split(']')[1]
	const home_url = '?SEARCH&DATABASE=CLIENT_VIEW&REPORT=WEB_CLIENT_PROFILE&EXP=patron_id+~3D+global(m2l_patron_id)'
	return (
		<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 shadow-md flex-col border-r bg-background sm:flex">
			<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href={getCookieValue('HOME_SESSID') + home_url}
							className="flex h-9 w-9 items-center justify-center  text-accent-foreground rounded-full hover:bg-neutral-200 hover:text-slate-700 md:h-8 md:w-8">
							<Home className="h-5 w-5" />
							<span className="sr-only">Patron Dashboard</span>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right">Patron Dashboard</TooltipContent>
				</Tooltip>

				{clientProfileJSON.database.map((item, index) => (
					<Tooltip key={index}>
						<TooltipTrigger asChild>
							<Link
								href={`${getCookieValue('HOME_SESSID') + item.url + (item.label === 'Bookmarks' || item.label === 'Easy Upload' ? '' : m2l_patron_id)}`}
								className="flex h-9 w-9 items-center justify-center  text-accent-foreground rounded-full hover:bg-neutral-200 hover:text-slate-700 md:h-8 md:w-8">
								{item.label === 'Orders' ? (
									<ShoppingBag className="h-5 w-5" />
								) : item.label === 'Copyright Requests' ? (
									<Copyright className="h-5 w-5" />
								) : item.label === 'Reproductions' ? (
									<Copy className="h-5 w-5" />
								) : item.label === 'Bookmarks' ? (
									<BookMarked className="h-5 w-5" />
								) : item.label === 'Enquiries' ? (
									<Lightbulb className="h-5 w-5" />
								) : item.label === 'Crowdsource' ? (
									<MessageCircleMore className="h-5 w-5" />
								) : item.label === 'Easy Upload' ? (
									<Upload className="h-5 w-5" />
								) : (
									<FileX className="h-5 w-5" />
								)}
								<span className="sr-only">{item.label}</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">{item.label}</TooltipContent>
					</Tooltip>
				))}
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href={`/scripts/mwimain.dll/144/WEB_CALENDAR/WEB_CALENDAR_PROFILE?commandsearch&exp=%2B%2B%40&EXP=TAG_FUNC_P_ID%20${m2l_patron_id}
								&M_GVAR1=USER_ID:${m2l_patron_id}`}
							className="flex h-9 w-9 items-center justify-center  text-accent-foreground rounded-full hover:bg-neutral-200 hover:text-slate-700 md:h-8 md:w-8">
							<CalendarDays className="h-5 w-5" />
						</Link>
					</TooltipTrigger>
				</Tooltip>
			</nav>
			<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href="#"
							className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
							<Settings className="h-5 w-5" />
							<span className="sr-only">Settings</span>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right">Settings</TooltipContent>
				</Tooltip>
			</nav>
		</aside>
	)
}

export default Sidebar
