import React from 'react'

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
	<div className="text-center">
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
