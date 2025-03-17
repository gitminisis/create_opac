const LandingPageMessage = ({
	title,
	subtitle,
	showButton,
	buttonText,
	buttonLink,
}: {
	title: string
	subtitle: string
	showButton: boolean
	buttonText?: string
	buttonLink?: string
}) => (
	<div className="min-h-[35vh] flex flex-col items-center justify-center">
		<h1 className="landing-page-title">{title}</h1>
		<p className="landing-page-sub-title">{subtitle}</p>
		{showButton && (
			<a href={buttonLink} className="landing-page-button">
				{buttonText}
			</a>
		)}
	</div>
)
export default LandingPageMessage
