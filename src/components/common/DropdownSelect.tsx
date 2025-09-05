import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useConstants from '@/hooks/useConstants'
import { cn } from '@/lib/utils'
import { SelectIcon, SelectProps } from '@radix-ui/react-select'
import { ChevronDown } from 'lucide-react'

type DropdownOption = {
	label: string
	value: string | number
}
export interface DropdownSelectProps {
	title?: string
	options: DropdownOption[]
	register?: SelectProps
	className?: string
	onOptionChange?: (value: string | number) => void
}

const DropdownSelect = ({ title, options, register, className }: DropdownSelectProps) => {
	const { message } = useConstants()
	return (
		<div className={cn('flex flex-col space-y-2', className)}>
			<Select onValueChange={register?.onValueChange}>
				<SelectTrigger className="text-left">
					<SelectValue className="text-left" placeholder={title || 'Select'} />
					<SelectIcon className="ml-auto">
						<ChevronDown className="h-4 w-4 " />
					</SelectIcon>
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
