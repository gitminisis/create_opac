import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import useConstants from '@/hooks/useConstants'
import { cn } from '@/lib/utils'

type DropdownOption = {
	label: string
	value: string | number
}
export interface DropdownSelectProps {
	title?: string
	options: DropdownOption[]
	register?: any
	className?: string
}

const DropdownSelect = ({ title, options, register, className }: DropdownSelectProps) => {
	const { message } = useConstants()
	return (
		<div className={cn('flex flex-col space-y-2', className)}>
			<Select {...register}>
				<SelectTrigger className="">
					<SelectValue placeholder={title || 'Select'} />
				</SelectTrigger>
				<SelectContent>
					{options?.length > 0 ? (
						options.map((option, i) => (
							<SelectItem key={i} value={`${option.value}`}>
								{option.label}
							</SelectItem>
						))
					) : (
						<SelectItem value="none">{message.noOptionsAvailable}</SelectItem>
					)}
				</SelectContent>
			</Select>
		</div>
	)
}

export default DropdownSelect
