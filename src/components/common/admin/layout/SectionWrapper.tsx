import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { ChevronDown, Trash } from 'lucide-react'
import { ReactNode } from 'react'

type Props = {
	title?: string
	children?: ReactNode
	className?: string
	onRemove?: () => void
	defaultCollapseMode?: boolean
}

const SectionWrapper = ({ title, children, className, onRemove, defaultCollapseMode = false }: Props) => {
	return (
		<Collapsible defaultOpen={!defaultCollapseMode}>
			<div className={cn('rounded border-blue-950 border-2  p-4', className)}>
				<div className="flex flex-row w-full justify-between">
					<div className="flex flex-row items-center space-x-2">
						<CollapsibleTrigger asChild>
							<Button variant="ghost">
								<ChevronDown />
							</Button>
						</CollapsibleTrigger>
						{title && <p className="font-bold">{title}</p>}
					</div>

					{onRemove && (
						<Button variant="destructive" className="w-min" onClick={onRemove}>
							<Trash className="h-4 w-4 " />
						</Button>
					)}
				</div>
				<CollapsibleContent> {children}</CollapsibleContent>
			</div>
		</Collapsible>
	)
}

export default SectionWrapper
