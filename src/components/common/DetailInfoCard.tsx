import useJSONData from '@/hooks/useJSONData'
import { cn, convertLowerTrim, getClassName } from '@/lib/utils'
import React from 'react'
import { Record } from '@/types/record'
import useConstants from '@/hooks/useConstants'
import { Badge } from '../ui/badge'

export interface DetailInfoCardrops {
	title: string | React.ReactNode
	className?: string
	description?: string
	footer?: React.ReactNode
	children?: React.ReactNode
	thumbnail?: string
	alt?: string
	record?: { database_name?: string }
	link_dbname?: string // For bookmark summary list
}

const DetailInfoCard = ({ title, description, thumbnail, alt, className, footer, children, record, link_dbname }: DetailInfoCardrops) => {
	const { navigations } = useConstants().config
	const getColor = (event_type: string | undefined) => {
		if (!event_type) return {}
		let result = navigations?.filter((item) => {
			return convertLowerTrim(item.search_database) === convertLowerTrim(event_type)
		})

		return {
			color: `${result[0]?.color}`,
			title: `${result[0]?.title}`,
		}
	}

	return (
		<div className={cn(`border-2 rounded-md col-span-4 ${getClassName(link_dbname ?? record?.database_name, 'border')} relative`, className)}>
			<Badge
				className={`${getColor(link_dbname ?? record?.database_name).color} absolute z-10 right-1 top-1 md:top-[27px] md:right-[15px] text-white`}
				variant={'tag'}>
				{getColor(link_dbname ?? record?.database_name).title}
			</Badge>
			<article className="shadow-md flex rounded-lg rounded-l-none flex-col md:flex-row transition hover:shadow-xl">
				<div className="basis-56 mt-[32px] md:mt-0">
					<img
						src={thumbnail}
						alt={alt || 'image thumbnail'}
						className=" h-full w-full  max-w-sm md:max-w-lg  mx-auto object-cover bg-gray-300 min-h-[293px]"
					/>
				</div>
				<div className="flex flex-1 flex-col justify-between">
					<div className="border-s border-gray-900/10 sm:border-l-transparent sm:p-6 md:w-[90%] break-all">
						<h3 className="font-bold text-2xl">{title}</h3>

						{description && <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">{description}</p>}
						<div>{children}</div>
					</div>

					{footer && <div className="">{footer}</div>}
				</div>
			</article>
		</div>
	)
}

export default DetailInfoCard
