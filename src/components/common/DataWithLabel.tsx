import React from 'react'
import { Label } from '../ui/label'
import { cn } from '@/lib/utils'
import { truncateString } from '@/lib/record'

type DataWithLabelProps = {
	className?: string
	label: string
	items: string[] | React.ReactNode[]
}

const DataWithLabel = ({ className, label, items }: DataWithLabelProps) => {
	return (
		<div className={cn('flex flex-row text-black space-x-1', className)}>
			<Label className="text-sm font-bold ">{label}: </Label>
			<div className="text-sm font-normal">
				{items.map((item) => {
					if (typeof item === 'string') {
						return truncateString(item, 250)
					}
					return item
				})}
			</div>
		</div>
	)
}

export default DataWithLabel
