type PageHeaderProps = {
	heading: string
	subHeading?: string
}

const PageHeader = ({ heading, subHeading }: PageHeaderProps) => {
	return (
		<header>
			<h2 className="text-xl font-bold text-gray-900 sm:text-3xl">{heading}</h2>
			{subHeading && <p className="mt-4 max-w-md text-gray-500">{subHeading}</p>}
		</header>
	)
}

export default PageHeader
