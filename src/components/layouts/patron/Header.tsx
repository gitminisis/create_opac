import { LanguageSelect } from '@/components/common/LanguageSelect'
import Link from '@/components/common/Link'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useConstants from '@/hooks/useConstants'
import { clearCookies, getCookieValue } from '@/lib/utils'
import { Home, UserRound } from 'lucide-react'

const Header = () => {
	const { message } = useConstants()
	const home_url =
		'?SEARCH&DATABASE=CLIENT_VIEW&REPORT=WEB_CLIENT_PROFILE&EXP=patron_id+~3D+global(m2l_patron_id)'

	return (
		<header className="flex justify-between bg-primary sticky top-0 z-30  items-center gap-4 border-b py-2">
			<div className="container flex justify-between items-center ">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									href={getCookieValue('HOME_SESSID') + home_url}
									className="flex no-underline text-primary-foreground hover:text-primary-foreground/80">
									<Home className="mr-1 h-5 w-5" />
									{message.clientDashboard}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<div className={'flex'}>
					<div className={'mr-2'}>
						<LanguageSelect />
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="overflow-hidden rounded-full">
								<UserRound />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Your Account</DropdownMenuLabel>
							<DropdownMenuItem>
								<Link
									href={
										getCookieValue('HOME_SESSID') +
										'?SEARCH&DATABASE=CLIENT_VIEW&REPORT=WEB_CLIENT_PROFILE&EXP=patron_id+~3D+global(m2l_patron_id)'
									}
									className="no-underline ml-[0.5rem]">
									{message.dashboardHome}
								</Link>
							</DropdownMenuItem>
							{/* <DropdownMenuItem>Account Settings</DropdownMenuItem> */}
							<DropdownMenuSeparator />
							<DropdownMenuLabel>Search Database</DropdownMenuLabel>
							<DropdownMenuItem>
								<Link href="/" className="no-underline ml-[0.5rem]">All</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/archives.html" className="no-underline ml-[0.5rem]">Archives</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/museum.html" className="no-underline ml-[0.5rem]">Museum</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/library.html" className="no-underline ml-[0.5rem]">Library</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Link onClick={clearCookies} className="no-underline ml-[0.5rem]">Logout</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}

export default Header
