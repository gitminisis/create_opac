import { ReactNode } from 'react'

export type InputProps = {
	id?: string
	title: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
	name?: string
	append?: ReactNode
}

export type CheckboxProps = {
	title: string
	value: boolean
	onChange: (value: boolean) => void
}

type SelectOption = {
	value: string
	label: string
}

export type SwitchProps = {
	title: string
	value: boolean
	onChange?: (value: boolean) => void
	disabled?: boolean
}

export type SelectProps = {
	label: string
	placeholder?: string
	triggerStyle?: string
	itemStyle?: string
	options: SelectOption[]
	onChange?: (option: SelectOption) => void
	defaultValue?: string
	renderOption?: (option: SelectOption) => ReactNode
}

export type FCForm = HTMLFormControlsCollection & {
	url: HTMLInputElement
	title: HTMLInputElement
	description: HTMLInputElement
	thumbnail: HTMLInputElement
}

export type TPForm = HTMLFormControlsCollection & {
	title: HTMLInputElement
	subTitle: HTMLInputElement
	description: HTMLInputElement
	expression: HTMLInputElement
	database: HTMLInputElement
}

export type BCForm = Omit<FCForm, 'description'>
