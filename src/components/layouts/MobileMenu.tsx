import { MenuIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'

import useConstants from '@/hooks/useConstants'
import { LanguageSelect } from '../common/LanguageSelect'
import Link from '../common/Link'
import LoginBtn from '../common/LoginBtn'
import { convertLink, getCookieValue } from '@/lib/utils'

const MobileMenu = () => {
	const [mobileMenu, setMobileMenu] = useState<boolean>(false)
	const { config, home, archives, museum, library } = useConstants()
	const { siteName, auth } = config
	const navigations = [home, archives, museum, library]
	
	return (
		<div className="block md:hidden">
			<Button size="icon" onClick={() => setMobileMenu(true)}>
				<MenuIcon />
			</Button>
			<Sheet open={mobileMenu} onOpenChange={setMobileMenu}>
				<SheetContent side="left">
					<SheetHeader>
						<SheetTitle>{siteName}</SheetTitle>
					</SheetHeader>
					{auth.login && (
						<div className={'flex justify-center items-center py-5'}>
							<div className=" inline-block bg-primary p-2 ring-offset-background rounded-lg" style={{ borderRadius: '5px' }}>
								<LoginBtn />
							</div>
						</div>
					)}
					<nav className="">
						<ul className="flex flex-col items-center text-md">
							{navigations.map((nav:any) => (
								<li
									key={nav.displayTitle}
									className="flex items-center text-left h-12 w-full px-2 hover:text-white hover:bg-primary/60 ">
									<Link className="transition no-underline text-md text-primary" href={convertLink(nav)}>
										{nav.displayTitle}
									</Link>
								</li>
							))}
						</ul>
					</nav>
					<div className="px-2 absolute bottom-[23px] right-[14px]">
						<LanguageSelect />
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}

export default MobileMenu
