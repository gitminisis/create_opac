import { cn } from '@/lib/utils'
import React from 'react'

export interface DetailInfoCardrops {
	title: string | React.ReactNode
	className?: string
	description?: string
	footer?: React.ReactNode
	children?: React.ReactNode
	thumbnail?: string
	alt?: string
}

const DetailInfoCard = ({
	title,
	description,
	thumbnail,
	alt,
	className,
	footer,
	children,
}: DetailInfoCardrops) => {
	return (
		<div className={cn('border rounded-lg rounded-l-none', className)}>
			<article className="shadow-md flex rounded-lg rounded-l-none flex-col md:flex-row transition hover:shadow-xl">
				<div className="basis-56">
					<img
						src={thumbnail}
						alt={alt || 'image thumbnail'}
						className=" h-full w-full  max-w-sm md:max-w-lg  mx-auto object-cover"
					/>
				</div>

				<div className="flex flex-1 flex-col justify-between">
					<div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
						<h3 className="font-bold text-2xl">{title}</h3>

						{description && (
							<p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
								{description}
							</p>
						)}
						<div>{children}</div>
					</div>

					{footer && <div className="">{footer}</div>}
				</div>
			</article>
		</div>
	)
}

export default DetailInfoCard
