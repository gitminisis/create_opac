import Button from '@/components/common/admin/Button'
import Link from '@/components/common/Link'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { useAdminAuth } from '@/providers/AdminAuthProvider'
import { LogOut } from 'lucide-react'

const Header = () => {
	const navigationLists = [
		{ url: './home.html', page: 'Union home' },
		{ url: './biblio.html', page: 'Biblio' },
		{ url: './collections.html', page: 'Collections' },
		{ url: './description.html', page: 'Description' },
		{ url: './fields.html', page: 'Report fields' },
		// { url: './rsvp.html', page: 'RSVP' },
		// { url: './message.html', page: 'Translation' },
		{ url: './settings.html', page: 'Settings' },
		{ url: './styles.html', page: 'Theme' },
	]

	const { isAuthenticated, signOut } = useAdminAuth()

	const checkActiveUrl = () => {
		const currentUrl = window.location.href
		const activePage = navigationLists.find((item) => {
			if (item.url === './home.html') {
				return currentUrl.includes('home.html') || currentUrl.endsWith('/admin/')
			}
			return currentUrl.includes(item.url.replace('./', ''))
		})
		return activePage ? activePage.page : null
	}

	return (
		<>
			<header className="bg-[#002a54] text-white justify-between sticky top-0 z-30 flex h-14 items-center gap-4 border-b py-4 px-4 sm:static sm:h-auto sm:border-0  sm:px-6">
				<Link className="text-white hover:text-white no-underline text-lg">MINISIS Template Toolkit</Link>
				{isAuthenticated && (
					<div>
						<Button onClick={() => signOut()}>
							<LogOut />
							Sign out
						</Button>
					</div>
				)}
			</header>
			{isAuthenticated && (
				<section className="bg-[#8ea4c0] text-white justify-between sticky top-0 z-30 flex h-14 items-center gap-4 border-b py-2 px-4 sm:static sm:h-auto sm:border-0  sm:px-6">
					<NavigationMenu className="mx-auto">
						<NavigationMenuList>
							{navigationLists.map((e) => (
								<NavigationMenuItem
									key={e.page}
									className={cn(
										'text-blue-950 cursor-pointer  px-4 py-2 rounded-md',
										checkActiveUrl() === e.page ? 'bg-white' : 'text-white'
									)}>
									<NavigationMenuLink href={e.url}>{e.page}</NavigationMenuLink>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</section>
			)}
		</>
	)
}

export default Header
