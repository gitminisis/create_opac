import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type InputWrapperProps = {
	children?: React.ReactNode
	label?: string
	className?: string
}

export const InputWrapper = ({ children, label, className }: InputWrapperProps) => {
	return (
		<div className={cn('my-3 flex flex-col space-y-2 w-full', className)}>
			<Label className="font-bold">{label}</Label>
			{children}
		</div>
	)
}
