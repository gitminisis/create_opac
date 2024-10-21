import { cn } from '@/lib/utils'
import React from 'react'

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
	heading: string
	subHeading?: string
}

const Section = ({ className, children, heading, subHeading, ...props }: SectionProps) => {
	return (
		<section className={cn('', className)} {...props}>
			<div className="mx-auto container px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
				<div className="mx-auto max-w-lg text-center">
					<h2 className="text-3xl font-bold sm:text-4xl text-primary-background">
						{heading}{' '}
					</h2>
					{subHeading && <p className="mt-4 text-secondary-foreground">{subHeading}</p>}
				</div>
				<div className="mt-8 flex flex-row">{children}</div>
			</div>
		</section>
	)
}

export default Section
