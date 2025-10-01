import useConstants from '@/hooks/useConstants'
import { LanguageSelect } from '../common/LanguageSelect'
import Link from '../common/Link'
import LoginBtn from '../common/LoginBtn'
import MobileMenu from './MobileMenu'
import { useEffect } from 'react'
import { convertLink, getCookieValue } from '@/lib/utils'

const Header = () => {
	const { config, home, archives, museum, library } = useConstants()
	const { logo, siteName } = config
	const navigations = [home, archives, museum, library]

	useEffect(() => {
		if (logo) {
			const link = document.createElement('link')
			link.rel = 'preload'
			link.as = 'image'
			link.href = logo
			document.head.appendChild(link)
		}
	}, [logo])

	return (
		<header className="w-full bg-primary  mx-auto px-4 sm:px-6 lg:px-8">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center pt-4 py-2">
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-4">
							<a className="flex flex-row space-x-4 items-center" href="/">
								<span className="sr-only ">Home</span>
								<img className="h-12" src={logo} alt="logo" loading="eager" />
								<h1 className="text-2xl font-bold text-opac-white">{siteName}</h1>
							</a>
						</div>
					</div>
					<div className=" items-center space-x-4 hidden md:flex">
						{config.auth.login && <LoginBtn />}
						<LanguageSelect />
					</div>
					<div className="flex md:hidden">
						<MobileMenu />
					</div>
				</div>
				<nav className="hidden md:block py-2 pb-4">
					<ul className="flex space-x-6 text-sm justify-end">
						{navigations.map((item: any, key) => (
							<li key={key}>
								<Link href={convertLink(item)} className="text-lg hover:underline text-opac-white hover:text-opac-secondary">
									{item.displayTitle}
								</Link>
							</li>
						))}
						<li key={'minista'}>
							<Link href={'/minista.html'} className="text-lg hover:underline text-opac-white hover:text-opac-secondary">
								MINIS'TA{' '}
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	)
}

export default Header
