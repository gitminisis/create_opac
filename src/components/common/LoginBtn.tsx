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
						<button
							className={
								'text-opac-white text-lg font-bold flex items-center max-w-[250px] truncate'
							}>
							{message.welcome} {decodeURIComponent(m2l_patron_name)}!
							<ChevronDown className={'h-4'} />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className={'w-full'}>
						<DropdownMenuLabel>{message.myAccount}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link
								href={
									getCookieValue('HOME_SESSID') +
									'?SEARCH&DATABASE=CLIENT_VIEW&REPORT=WEB_CLIENT_PROFILE&EXP=patron_id+~3D+global(m2l_patron_id)'
								}>
								{message.dashboardHome}
							</Link>
						</DropdownMenuItem>
						{/* <DropdownMenuItem>{message.accountSettings}</DropdownMenuItem> */}
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link onClick={clearCookies}>{message.logout}</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Link
					className={cn(
						'transition no-underline text-lg text-opac-white hover:text-opac-secondary',
						className
					)}
					href={`${config.auth.url}`}>
					{message.logIn}
				</Link>
			)}
		</>
	)
}

export default LoginBtn
