import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TEXTAREA_LENGTH } from '@/lib/admin'
import React, { useState } from 'react'
import { InputWrapper } from './InputWrapper'
import { InputProps } from './types'

const TextField = ({ id, title, value, onChange, placeholder, name, append }: InputProps) => {
	const [val, setVal] = useState(value)
	const defaultId = id || `text-field-${title}`

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		setVal(e.target.value)
		onChange?.(e.target.value)
	}
	return (
		<InputWrapper label={title}>
			{value.length >= TEXTAREA_LENGTH ? (
				<Textarea aria-placeholder={placeholder} id={defaultId} placeholder={title} defaultValue={val} onChange={handleChange} name={name} />
			) : (
				<Input aria-placeholder={placeholder} id={defaultId} placeholder={title} defaultValue={value} onChange={handleChange} name={name} />
			)}
			{append}
		</InputWrapper>
	)
}

export default TextField
