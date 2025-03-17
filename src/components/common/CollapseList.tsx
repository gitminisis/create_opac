import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'

import React from 'react'

export interface CollapseListProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string
	expand?: boolean
	disabled?: boolean
}

const CollapseList = ({ title, children, expand = false, disabled }: CollapseListProps) => {
	const [isOpen, setIsOpen] = React.useState(expand)
	return (
		<div className="w-full space-y-2">
			<Collapsible
				disabled={disabled}
				open={isOpen}
				onOpenChange={setIsOpen}
				className="overflow-hidden rounded-md border border-input  [&_summary::-webkit-details-marker]:hidden">
				<CollapsibleTrigger className="flex cursor-pointer items-center justify-between py-2 px-2.5 text-white transition w-full bg-primary">
					<span className="text-sm "> {title} </span>
					<span>
						{isOpen ? (
							<ChevronUp className="w-4 h-4 opacity-50" />
						) : (
							<ChevronDown className="w-4 h-4 opacity-50" />
						)}
					</span>
				</CollapsibleTrigger>
				<CollapsibleContent>{children}</CollapsibleContent>
			</Collapsible>
		</div>
	)
}

export default CollapseList
