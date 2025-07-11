import { LanguageSelect } from '@/components/common/LanguageSelect'
import Link from '@/components/common/Link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
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
import { clearCookies, convertLink, getCookieValue } from '@/lib/utils'
import { Home, UserRound } from 'lucide-react'
import MobileMenu from '../MobileMenu'

const Header = () => {
	const { config, home, archives, museum, library, message } = useConstants()
	const { logo, siteName } = config
	const navigations = [home, archives, museum, library]

	return (
		<header className="flex justify-between bg-primary sticky top-0 z-30  items-center gap-4 border-b py-2">
			<div className="container flex justify-between items-center md:p-[21px]">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<a className="flex flex-row space-x-4 items-center" href="/">
									<img className="h-12" src={logo} alt="logo" loading="eager" />
									<h1 className="text-2xl font-bold text-opac-white">{siteName}</h1>
								</a>
							</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<div className={'flex justify-between w-[120px] hidden md:flex'}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon" className="overflow-hidden rounded-full">
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
							<DropdownMenuItem>
								<Link
									href={
										getCookieValue('HOME_SESSID') +
										'?SEARCH&DATABASE=CLIENT_VIEW&REPORT=WEB_LIBRARY_CIRC_DASHBOARD&EXP=patron_id+~3D+global(m2l_patron_id)'
									}
									className="no-underline ml-[0.5rem]">
									{message.patronDashboard}
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link
									href={
										getCookieValue('HOME_SESSID') +
										'?SEARCH&DATABASE=CLIENT_VIEW&REPORT=WEB_CLIENT_ACC_SETTINGS&EXP=patron_id+~3D+global(m2l_patron_id)'
									}
									className="no-underline ml-[0.5rem]">
									{message.accountSettings}
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuLabel>Search Database</DropdownMenuLabel>
							{navigations.map((nav: any,key) => (
								<DropdownMenuItem key={key}>
									<Link href={convertLink(nav)} className="no-underline ml-[0.5rem]">
										{nav.displayTitle}
									</Link>
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Link onClick={clearCookies} className="no-underline ml-[0.5rem]">
									Logout
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<div className={'mr-2'}>
						<LanguageSelect />
					</div>
				</div>
				<div className="flex md:hidden">
					<MobileMenu />
				</div>
			</div>
		</header>
	)
}

export default Header
