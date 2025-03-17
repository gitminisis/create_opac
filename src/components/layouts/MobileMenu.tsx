import { MenuIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'

import useConstants from '@/hooks/useConstants'
import { LanguageSelect } from '../common/LanguageSelect'
import Link from '../common/Link'
import LoginBtn from '../common/LoginBtn'

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
					<nav className="">
						<ul className="flex flex-col items-center  text-md">
							{navigations.map((nav) => (
								<li
									key={nav.displayTitle}
									className="flex items-center text-left h-12 w-full px-2  hover:text-white hover:bg-primary/60 ">
									<Link
										className="transition no-underline text-md text-primary"
										href={nav.linkURL}>
										{nav.displayTitle}
									</Link>
								</li>
							))}
							{auth.login && (
								<li className="flex items-center text-left h-12 w-full px-2  hover:text-white hover:bg-primary/60">
									<LoginBtn className="text-primary text-md " />
								</li>
							)}
						</ul>
						<div className="px-2">
							<LanguageSelect />
						</div>
					</nav>
				</SheetContent>
			</Sheet>
		</div>
	)
}

export default MobileMenu
