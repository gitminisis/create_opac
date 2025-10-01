import { Checkbox as CheckboxInput } from '@/components/ui/checkbox'
import { InputWrapper } from './InputWrapper'
import { CheckboxProps } from './types'
const CheckboxWithLabel = ({ value, onChange, title }: CheckboxProps) => {
	return (
		<InputWrapper label={title} className="flex flex-row-reverse items-center gap-2 space-y-0 min-w-[120px] justify-end">
			<CheckboxInput className="m-0" defaultChecked={value} onCheckedChange={(checked) => onChange(Boolean(checked))} />
		</InputWrapper>
	)
}

export default CheckboxWithLabel
