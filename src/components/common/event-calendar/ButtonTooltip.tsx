import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TAG_NAME } from './Constants'
import { useEffect, useState } from 'react'

interface ButtonTooltipProps {
	children: React.ReactNode
	item?: Array<{ [key: string]: string }>
}

const ButtonTooltip: React.FC<ButtonTooltipProps> = ({ children, item }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent
					side="top"
					align="center"
					sideOffset={5}
					className="hidden z-50 md:block max-w-[250px] max-h-[250px] overflow-y-hidden p-2 rounded bg-primary text-white text-start custom-scrollbar">
					{item?.map((elm, key) => <div key={key}>&#x2022;{elm[TAG_NAME]}</div>)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default ButtonTooltip
