import React from 'react'
import { Input } from '../../ui/input'
import { Checkbox } from '../../ui/checkbox'
import { Label } from '@/components/ui/label'
import { SchemaType, SchemaValueType } from '@/types/schema'
import { TEXTAREA_LENGTH } from '@/lib/admin'
import { Textarea } from '@/components/ui/textarea'
import AdminForm from '@/page/admin/AdminForm'
import { cn } from '@/lib/utils'

type InputWrapperProps = {
	children?: React.ReactNode
	id: string
	label?: string
	className?: string
}

const InputWrapper = ({ children, id, label, className }: InputWrapperProps) => {
	return (
		<div className={cn('my-3 flex flex-col', className)}>
			<Label className="font-bold" htmlFor={id}>
				{label}
			</Label>
			{children}
		</div>
	)
}
const AdminFormInput = ({ type, title, items, properties, value }: SchemaType) => {
	if (type === 'string') {
		try {
			const stringValue = JSON.stringify(value).replace(/"/g, '')
			const inputId = `${title.split(' ').join('')}-input`
			return (
				<InputWrapper label={title} id={inputId}>
					{stringValue.length >= TEXTAREA_LENGTH ? (
						<Textarea id={inputId} placeholder={title} defaultValue={stringValue} />
					) : (
						<Input id={inputId} placeholder={title} defaultValue={stringValue} />
					)}
				</InputWrapper>
			)
		} catch (error) {
			console.error('Error rendering string input')
		}
	}
	if (type === 'boolean') {
		const inputId = `${title.split(' ').join('')}-input`
		return (
			<InputWrapper label={title} id={inputId}>
				<span>
					<Checkbox />
				</span>
			</InputWrapper>
		)
	}
	if (type === 'array' && items) {
		return (value as Array<SchemaValueType>)?.map((v, i) => (
			<AdminFormInput key={i} value={v} {...items} />
		))
	}
	if (type === 'object' && properties) {
		return Object.keys(properties).map((e) => {
			const item = properties[e] as SchemaType
			const itemValue = value
				? ((value as Record<string, Object>)[e] as SchemaValueType)
				: null
			if (item && itemValue) {
				const { type, title, value, ...rest } = item
				return <AdminFormInput value={itemValue} type={type} title={title} {...rest} />
			}
			return null
		})
	}

	return <div>Unhandled data type</div>
}

export default AdminFormInput
