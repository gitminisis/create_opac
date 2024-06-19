import { CONSTANTS } from '@/constants'
import { getJSONType } from '@/lib/utils'

const Footer = () => {
	const { logo, siteName } = getJSONType(CONSTANTS.EN.config)

	return (
		<footer className="bg-black mx-auto static  px-4 py-4 sm:px-6 lg:px-4  w-full bottom-0 ">
			<div className="sm:flex sm:items-center sm:justify-between ">
				<p className="text-center text-white mx-auto">
					{siteName} &copy; {new Date().getFullYear()}
				</p>
			</div>
		</footer>
	)
}

export default Footer
