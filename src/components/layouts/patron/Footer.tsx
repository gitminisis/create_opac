import { CONSTANTS } from '@/constants'
import { getJSONType } from '@/lib/utils'
import { HeroHighlight } from '../../ui/hero-highlight'

import version from '@/app_version.json'
const Footer = () => {
	const { logo, siteName } = getJSONType(CONSTANTS.EN.config)

	return (
		<footer className="w-full bg-black mx-auto absolute bottom-0">
			<HeroHighlight containerClassName="h-28">
				<div className="flex gap-4 items-center flex-col text-white text-center">
					<p className="text-lg mx-auto">
						{siteName} &copy; {new Date().getFullYear()}
					</p>
					<p className="text-sm text-gray-400">
						Software powered by MINISIS Inc.{' '}
						{version.APP_VERSION && `Version ${version.APP_VERSION}`}{' '}
					</p>
				</div>
			</HeroHighlight>
		</footer>
	)
}

export default Footer
