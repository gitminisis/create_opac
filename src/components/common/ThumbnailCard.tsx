import React from 'react'
import { Card } from '../ui/card'
import { cn } from '@/lib/utils'

export interface ThumbnailCardProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string
	url: string
	thumbnail: string
}

const ThumbnailCard = ({ title, url, thumbnail, className, children }: ThumbnailCardProps) => {
	return (
		<Card className={cn('group relative block', className)} onClick={() => (window.location.href = url)}>
			<div className="relative h-[350px] sm:h-[450px] w-[350px]">
				<img loading={'lazy'} src={thumbnail} alt={title} className="brightness-75 absolute inset-0 h-full w-full object-cover " />
			</div>

			<div className="absolute inset-0 flex flex-col items-start justify-end p-6">
				<span className="mt-3 inline-block rounded-md bg-primary px-5 py-3 text-md  font-medium  tracking-wide text-white">{title}</span>
				{children}
			</div>
		</Card>
	)
}

export default ThumbnailCard
