import { CONSTANTS } from '@/constants'
import { getJSONType } from '@/lib/utils'
import { HeroHighlight } from '../ui/hero-highlight'
import { Twitter, Linkedin, Youtube, Rss, Instagram, Mail } from 'lucide-react'

import version from '@/app_version.json'
const Footer = () => {
	const { siteName } = getJSONType(CONSTANTS.EN.config)

	return (
		<footer className="w-full mx-auto" style={{ backgroundColor: '#616161' }}>
			<div className="border-t-4 border-red-700">
				<div className="container mx-auto px-6 py-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Legal Information Column */}
						<div>
							<h3 className="text-white font-semibold mb-4">Legal information</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="https://www.bis.org/terms_conditions.htm"
										target="_blank"
										rel="noreferrer"
										className="text-gray-300 hover:text-white transition-colors text-sm"
									>
										Terms and conditions
									</a>
								</li>
								<li>
									<a
										href="https://www.bis.org/terms_conditions.htm#Copyright_and_Permissions"
										target="_blank"
										rel="noreferrer"
										className="text-gray-300 hover:text-white transition-colors text-sm"
									>
										Copyright and permissions
									</a>
								</li>
								<li>
									<a
										href="https://www.bis.org/privacy.htm"
										target="_blank"
										rel="noreferrer"
										className="text-gray-300 hover:text-white transition-colors text-sm"
									>
										Privacy notice
									</a>
								</li>
								<li>
									<a
										href="https://www.bis.org/cookies.htm"
										target="_blank"
										rel="noreferrer"
										className="text-gray-300 hover:text-white transition-colors text-sm"
									>
										Cookies notice
									</a>
								</li>
								<li>
									<a
										href="https://www.bis.org/about/warning0405.htm"
										target="_blank"
										rel="noreferrer"
										className="text-gray-300 hover:text-white transition-colors text-sm"
									>
										Email scam warning
									</a>
								</li>
							</ul>
						</div>

						{/* Stay Connected Column */}
						<div>
							<h3 className="text-white font-semibold mb-4">Stay connected</h3>

							{/* Social Links */}
							<div className="mb-6">
								<p className="text-gray-300 text-sm mb-3">Follow us</p>
								<div className="flex gap-3 mb-4">
									<a
										href="https://x.com/BIS_org"
										target="_blank"
										rel="noreferrer"
										className="w-8 h-8 rounded flex items-center justify-center text-white transition-colors"
										style={{ backgroundColor: '#616161' }}
										onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
										onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#616161')}
										title="Follow us on X"
									>
										<Twitter size={16} />
									</a>
									<a
										href="https://www.linkedin.com/company/bis"
										target="_blank"
										rel="noreferrer"
										className="w-8 h-8 rounded flex items-center justify-center text-white transition-colors"
										style={{ backgroundColor: '#616161' }}
										onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
										onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#616161')}
										title="Follow us on LinkedIn"
									>
										<Linkedin size={16} />
									</a>
									<a
										href="https://www.youtube.com/user/bisbribiz"
										target="_blank"
										rel="noreferrer"
										className="w-8 h-8 rounded flex items-center justify-center text-white transition-colors"
										style={{ backgroundColor: '#616161' }}
										onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
										onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#616161')}
										title="Watch our YouTube videos"
									>
										<Youtube size={16} />
									</a>
									<a
										href="https://www.bis.org/rss/index.htm"
										target="_blank"
										rel="noreferrer"
										className="w-8 h-8 rounded flex items-center justify-center text-white transition-colors"
										style={{ backgroundColor: '#616161' }}
										onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
										onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#616161')}
										title="RSS Feeds"
									>
										<Rss size={16} />
									</a>
									<a
										href="https://www.bis.org/podcast"
										target="_blank"
										rel="noreferrer"
										className="w-8 h-8 rounded flex items-center justify-center text-white transition-colors"
										style={{ backgroundColor: '#616161' }}
										onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
										onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#616161')}
										title="Listen to our Podcast"
									>
										<Rss size={16} />
									</a>
									<a
										href="https://www.instagram.com/bankforintlsettlements"
										target="_blank"
										rel="noreferrer"
										className="w-8 h-8 rounded flex items-center justify-center text-white transition-colors"
										style={{ backgroundColor: '#616161' }}
										onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
										onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#616161')}
										title="Follow us on Instagram"
									>
										<Instagram size={16} />
									</a>
								</div>
							</div>

							<hr className="my-4" style={{ borderColor: '#616161' }} />

							
						</div>
					</div>

					{/* Bottom Section with Original Content */}
					<div className="border-t mt-8 pt-6" style={{ borderColor: '#616161' }}>
						<div className="flex gap-4 items-center flex-col text-white text-center">
							<p className="text-sm mx-auto">
								{siteName} &copy; {new Date().getFullYear()}
							</p>
							<p className="text-xs text-gray-400">
								Software powered by MINISIS Inc. {version.APP_VERSION && `Version ${version.APP_VERSION}`}{' '}
							</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
