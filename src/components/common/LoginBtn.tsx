import useConstants from '@/hooks/useConstants'
import { clearCookies, cn, getCookieValue, isLogin } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import Link from './Link'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const LoginBtn = ({ className }: { className?: string }) => {
	const { message, config } = useConstants()
	const isAuthenticated = isLogin()
	let m2l_patron_name = getCookieValue('M2L_PATRON_NAME') || 'Guest'
	return (
		<>
			{isAuthenticated ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild className={'focus:outline-none focus:border-none'}>
						<button className={'text-opac-white text-lg font-bold flex items-center'}>
							<div>
								<div className="block sm:hidden">{message.welcome}!</div>
								<div className={'break-words whitespace-normal'}>{decodeURIComponent(m2l_patron_name)}</div>
							</div>
							<div>
								<ChevronDown className={'h-4'} />
							</div>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className={'w-full'}>
						<DropdownMenuLabel>{message.myAccount}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link
								href={
									getCookieValue('HOME_SESSID') +
									'?SEARCH&DATABASE=CLIENT&REPORT=WEB_PATRON_PROFILE&EXP=patron_id+~3D+global(m2l_patron_id)'
								}
								className="no-underline ml-[0.5rem]">
								{message.dashboardHome}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link
								href={
									getCookieValue('HOME_SESSID') +
									'?SEARCH&DATABASE=PATRON_BIBLIO&REPORT=WEB_LIBRARY_CIRC_DASHBOARD&EXP=patron_id+~3D+global(m2l_patron_id)'
								}
								className="no-underline ml-[0.5rem]">
								{message.libraryDashboard}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link
								href={
									getCookieValue('HOME_SESSID') +
									'?SEARCH&DATABASE=CLIENT&REPORT=WEB_CLIENT_ACC_SETTINGS&EXP=patron_id+~3D+global(m2l_patron_id)'
								}
								className="no-underline ml-[0.5rem]">
								{message.accountSettings}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link onClick={clearCookies} className="no-underline ml-[0.5rem]">
								{message.logout}
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Link
					className={cn('transition no-underline text-lg text-opac-white hover:text-opac-secondary', className)}
					href={`${config.auth.url}`}>
					{message.logIn}
				</Link>
			)}
		</>
	)
}

export default LoginBtn
