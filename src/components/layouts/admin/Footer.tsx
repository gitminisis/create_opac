import version from '@/app_version.json'
const Footer = () => {
	return (
		<footer className="bg-[#002a54] w-full text-white py-4 px-6">
			<div className="max-w-6xl mx-auto flex flex-col items-center space-y-2">
				<img src="https://www.minisisinc.com/img/logo.png" width={200} height={40} alt="MINISIS INC" className="bg-white p-0 rounded" />
				<div className="text-sm">
					<span>1-877-255-4399</span>
					<span className="mx-2">|</span>
					<a href="http://www.minisisinc.com" className="text-blue-300 hover:underline">
						www.minisisinc.com
					</a>
				</div>
				<div className="text-xs">© {new Date().getFullYear()} MINISIS Inc. All Rights Reserved</div>
				{version.APP_VERSION && <div className="text-xs">Version {version.APP_VERSION} </div>}
			</div>
		</footer>
	)
}

export default Footer
