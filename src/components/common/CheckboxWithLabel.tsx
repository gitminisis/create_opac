import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { Label } from '../ui/label'

export interface CheckboxWithLabelProps extends React.HTMLAttributes<HTMLDivElement> {
	label: string
	labelId?: string
	checked?: boolean
	callback: (e: any) => void
}
const CheckboxWithLabel = ({ className, label, labelId, checked = false, callback, ...props }: CheckboxWithLabelProps) => {
	return (
		<div
			className={cn('flex items-center space-x-2')}
			onClick={(e) => {
				callback(e)
			}}
			{...props}>
			<Checkbox id={labelId || label} defaultChecked={checked} checked={checked} className={className} />
			<Label htmlFor={labelId || label} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
				{label}
			</Label>
		</div>
	)
}

export default CheckboxWithLabel
