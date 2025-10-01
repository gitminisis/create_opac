import React from 'react'
import { Card } from '../ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export interface ThumbnailCardProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string
	url: string
	thumbnail: string
}

const ThumbnailCard = ({ title, url, thumbnail, className, children }: ThumbnailCardProps) => {
	return (
		<motion.div
			whileHover={{ scale: 1.03 }}
			transition={{ type: 'spring', stiffness: 300, damping: 20 }}
			className="cursor-pointer"
		>
			<Card 
				className={cn('group relative block overflow-hidden', className)} 
				onClick={() => (window.location.href = url)}
			>
				<div className="relative h-[350px] sm:h-[450px] w-[350px]">
					<motion.img 
						loading={'lazy'} 
						src={thumbnail} 
						alt={title} 
						className="brightness-75 absolute inset-0 h-full w-full object-cover transition-all duration-300 group-hover:brightness-100 group-hover:scale-105" 
					/>
				</div>

				<div className="absolute inset-0 flex flex-col items-start justify-end p-6 transition-all duration-300">
					<motion.span 
						initial={{ y: 10, opacity: 0.8 }}
						whileHover={{ y: 0, opacity: 1 }}
						className="mt-3 inline-block rounded-md bg-primary px-5 py-3 text-md font-medium tracking-wide text-white shadow-lg transition-all duration-300 group-hover:bg-primary/90"
					>
						{title}
					</motion.span>
					<div className="w-full transition-all duration-300 group-hover:translate-y-[-5px]">
						{children}
					</div>
				</div>
			</Card>
		</motion.div>
	)
}

export default ThumbnailCard
