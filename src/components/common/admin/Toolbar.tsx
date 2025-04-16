import { Button } from '@/components/ui/button'
import { HTMLAttributes } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { DeleteIcon } from 'lucide-react'

function GripIcon(props: HTMLAttributes<SVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<circle cx="12" cy="5" r="1" />
			<circle cx="19" cy="5" r="1" />
			<circle cx="5" cy="5" r="1" />
			<circle cx="12" cy="12" r="1" />
			<circle cx="19" cy="12" r="1" />
			<circle cx="5" cy="12" r="1" />
			<circle cx="12" cy="19" r="1" />
			<circle cx="19" cy="19" r="1" />
			<circle cx="5" cy="19" r="1" />
		</svg>
	)
}

function PlusIcon(props: HTMLAttributes<SVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	)
}

export default function Toolbar({
	className,
	onRemove,
	onDuplicate,
}: {
	className?: string
	onRemove: () => void
	onDuplicate: () => void
}) {
	return (
		<TooltipProvider>
			<div
				className={cn(
					'flex items-center space-x-2 opacity-0 transition-opacity',
					className
				)}>
				<Tooltip>
					<TooltipTrigger>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full"
							onClick={onDuplicate}>
							<PlusIcon className="w-6 h-6 text-muted-foreground" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Duplicate item</TooltipContent>
				</Tooltip>

				{/* <Tooltip>
					<TooltipTrigger>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full"
							onClick={onRemove}>
							<DeleteIcon className="w-6 h-6 text-muted-foreground" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Remove item</TooltipContent>
				</Tooltip> */}
			</div>
		</TooltipProvider>
	)
}
