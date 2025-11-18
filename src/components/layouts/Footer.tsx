import { CONSTANTS } from '@/constants'
import { getJSONType } from '@/lib/utils'
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react'

import version from '@/app_version.json'

const Footer = () => {
	const { siteName } = getJSONType(CONSTANTS.EN.config)

	const quickLinks = [
		{ label: 'Contact Us', href: '/about/royal-collection-trust/contact-us' },
		{ label: '£1 Tickets', href: '/one-pound-tickets' },
		{ label: 'Press Office', href: '/about/press-office' },
		{ label: '1-Year Pass', href: '/1-year-pass' },
		{ label: 'Travel Trade & Groups', href: '/travel-trade-and-groups' },
		{ label: 'Access and Communities', href: '/access-and-communities' },
		{ label: 'Working for us', href: '/about/working-for-us' },
		{ label: 'Sustainability', href: '/about-royal-collection-trust/sustainability' },
		{ label: 'Picture Library', href: '/about/picture-library' },
		{ label: 'Policies', href: '/about/policies' },
		{ label: 'Learning Resources', href: '/resources' },
		{ label: 'School Sessions', href: '/schools/sessions' },
	]

	const residences = [
		{ label: 'Buckingham Palace', href: '/visit/buckingham-palace' },
		{ label: 'The Royal Mews, Buckingham Palace', href: '/visit/the-royal-mews-buckingham-palace' },
		{ label: "The King's Gallery, Buckingham Palace", href: '/visit/the-kings-gallery-buckingham-palace' },
		{ label: "St James's Palace", href: '/visit/st-jamess-palace' },
		{ label: 'Windsor Castle', href: '/visit/windsor-castle' },
		{ label: 'Palace of Holyroodhouse', href: '/visit/palace-of-holyroodhouse' },
		{ label: "The King's Gallery, Palace of Holyroodhouse", href: '/visit/the-kings-gallery-palace-of-holyroodhouse' },
	]

	return (
		<footer className="w-full mx-auto bg-white">
			<div className="container mx-auto px-6 py-12">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
					{/* Social Links Column */}
					<div>
						<div className="bg-gray-100 p-6 rounded">
							<h3 className="text-gray-900 font-semibold mb-4 text-base">Follow us</h3>
							<div className="flex gap-4 mb-6">
								<a
									href="https://www.facebook.com/royalcollectiontrust"
									target="_blank"
									rel="noopener noreferrer"
									title="Facebook"
									className="text-gray-700 hover:text-red-700 transition-colors"
								>
									<Facebook size={24} />
								</a>
								<a
									href="https://www.instagram.com/royalcollectiontrust/"
									target="_blank"
									rel="noopener noreferrer"
									title="Instagram"
									className="text-gray-700 hover:text-red-700 transition-colors"
								>
									<Instagram size={24} />
								</a>
								<a
									href="https://www.youtube.com/@RoyalCollectionTrust"
									target="_blank"
									rel="noopener noreferrer"
									title="YouTube"
									className="text-gray-700 hover:text-red-700 transition-colors"
								>
									<Youtube size={24} />
								</a>
								<a
									href="https://X.com/RCT"
									target="_blank"
									rel="noopener noreferrer"
									title="X"
									className="text-gray-700 hover:text-red-700 transition-colors"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.807-5.967 6.807H2.882l7.432-8.49H1.227l5.851-6.986h6.166l4.888 6.402L24 2.25zM17.15 18.75h1.828L6.122 4.126H4.231l12.919 14.624z" />
									</svg>
								</a>
								<a
									href="/about/royal-collection-trust/contact-us"
									title="Contact us"
									className="text-gray-700 hover:text-red-700 transition-colors"
								>
									<Mail size={24} />
								</a>
							</div>
						</div>
					</div>

					{/* Quick Links Column */}
					<div>
						<h3 className="text-gray-900 font-semibold mb-4 text-base">Quick Links</h3>
						<ul className="space-y-2">
							{quickLinks.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										title={link.label}
										className="text-gray-700 hover:text-red-700 transition-colors text-sm"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Official Royal Residences Column */}
					<div>
						<h3 className="text-gray-900 font-semibold mb-4 text-base">Official Royal Residences</h3>
						<ul className="space-y-2">
							{residences.map((residence) => (
								<li key={residence.href}>
									<a
										href={residence.href}
										title={residence.label}
										className="text-gray-700 hover:text-red-700 transition-colors text-sm"
									>
										{residence.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Divider */}
				<hr className="my-8 border-gray-300" />

				{/* Charity Information */}
				<div className="mb-8">
					<p className="text-gray-700 text-sm leading-relaxed">
						The income from your ticket contributes directly to The Royal Collection Trust, a registered charity. The aims
						of The Royal Collection Trust are the care and conservation of the Royal Collection, and the promotion of
						access and enjoyment through exhibitions, publications, loans and educational activities.
					</p>
				</div>

				{/* Bottom Section */}
				<div className="border-t border-gray-300 pt-6">
					<div className="flex gap-4 items-center flex-col text-gray-700 text-center">
						<p className="text-sm">
							{siteName} &copy; {new Date().getFullYear()}
						</p>
						<p className="text-xs text-gray-500">
							Software powered by MINISIS Inc. {version.APP_VERSION && `Version ${version.APP_VERSION}`}{' '}
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
