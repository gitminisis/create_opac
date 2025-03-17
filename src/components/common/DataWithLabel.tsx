import React from 'react'
import { Label } from '../ui/label'
import { cn } from '@/lib/utils'
import { truncateString } from '@/lib/record'
import { HighlightText } from './HighlightText'

type DataWithLabelProps = {
	className?: string
	label: string
	items: string[] | React.ReactNode[]
	searchTerms?: string[]
}

const DataWithLabel = ({ className, label, items, searchTerms = [] }: DataWithLabelProps) => {
	return (
		<div className={cn('flex flex-row text-black space-x-1', className)}>
			<Label className="text-sm font-bold ">{label}: </Label>
			<div className="text-sm font-normal">
				{items.map((item: any) => {
					if (typeof item === 'string') {
						return (
							<HighlightText
								text={truncateString(item, 250)}
								highlights={searchTerms}
							/>
						)
					}
					return item['__text'] ? (
						<HighlightText text={item['__text']} highlights={searchTerms} />
					) : (
						''
					)
				})}
			</div>
		</div>
	)
}

export default DataWithLabel
