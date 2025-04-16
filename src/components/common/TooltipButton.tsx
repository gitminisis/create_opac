import { Button, ButtonProps } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { forwardRef } from 'react'

type TooltipButtonProps = ButtonProps & {
	tooltipContent?: string
}

const TooltipButton = forwardRef<HTMLButtonElement, TooltipButtonProps>(
	({ tooltipContent, ...props }, ref) => {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button ref={ref} {...props} />
					</TooltipTrigger>
					{tooltipContent && (
						<TooltipContent>
							<p>{tooltipContent}</p>
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		)
	}
)
TooltipButton.displayName = 'TooltipButton'
export default TooltipButton
