import React from 'react'
import { Card } from '../ui/card'
import { cn } from '@/lib/utils'

export interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string
	url: string
	thumbnail: string
	description?: string
}

const HoverCard = ({ title, url, thumbnail, description, className, children }: HoverCardProps) => {
	return (
		<Card className={cn('group relative block cursor-pointer border-none ', className)} onClick={() => (window.location.href = url)}>
			<div className="relative mb-4 before:content-[''] before:rounded-md before:absolute before:inset-0 before:bg-black before:bg-opacity-20">
				<img className="w-full brightness-[65%] group-hover:opacity-90" alt={title} src={thumbnail} />
				<div className="absolute inset-0 p-8 text-white flex flex-col">
					<div className="relative">
						<a className=" absolute inset-0" target="_blank" href="/"></a>
					</div>
					<div className="absolute inset-0 flex flex-col items-start justify-end p-6">
						<span className="mt-3 inline-block bg-primary px-3 py-1 text-md  font-medium  tracking-wide max-w-full break-words  text-white">
							{title}
						</span>

						{children}
					</div>

					{description && (
						<div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
							<p className="text-sm text-white">{description}</p>
						</div>
					)}
				</div>
			</div>
		</Card>
	)
}

export default HoverCard
