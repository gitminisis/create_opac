import { cn } from '@/lib/utils'
import React from 'react'

export interface SplitSectionProps {
	className?: string
	reverse?: boolean
	title: string
	description?: string
	children?: React.ReactNode
}

const SplitSection = ({
	children,
	title,
	description,
	className,
	reverse = false,
}: SplitSectionProps) => {
	return (
		<section className={cn('w-full', className)}>
			<div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
					{children}

					<div
						className={cn(
							'lg:py-24 order-last',
							reverse ? 'lg:order-last' : 'lg:order-first'
						)}>
						<h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>

						{description && <p className="mt-4 text-gray-600">{description}</p>}
					</div>
				</div>
			</div>
		</section>
	)
}

export default SplitSection
