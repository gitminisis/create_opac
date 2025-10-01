import { Select as DefaultSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { SelectProps } from './types'
import { InputWrapper } from './InputWrapper'

const Select = ({ label, placeholder, triggerStyle, itemStyle, options, renderOption, defaultValue }: SelectProps) => {
	return (
		<InputWrapper label={label}>
			<DefaultSelect defaultValue={defaultValue}>
				<SelectTrigger className={cn('w-[180px]', triggerStyle)}>
					<SelectValue placeholder={placeholder || 'Select an option'} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option, index) => (
						<SelectItem className={cn(itemStyle)} key={index} value={option.value}>
							{renderOption ? renderOption(option) : option.label}
						</SelectItem>
					))}
				</SelectContent>
			</DefaultSelect>
		</InputWrapper>
	)
}

export default Select
