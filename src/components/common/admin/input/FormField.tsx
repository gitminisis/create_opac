import CheckboxWithLabel from '@/components/common/admin/input/CheckboxWithLabel'
import ImagePreview from '@/components/common/admin/input/ImagePreview'
import TextField from '@/components/common/admin/input/TextField'
import Dropdown from './Dropdown'
import TDRLinking from './TDRLinking'
import { isSupportedImageExtension, TDRFile } from '@/lib/tdr'
import { useState } from 'react'
type FormFieldBaseProps<T extends string | boolean> = {
	field: string
	value: T
	onChange?: (value: T) => void
	name?: string
}

type TextProps<T extends string> = FormFieldBaseProps<T> & {
	type: 'text'
}

type CheckboxProps<T extends boolean> = FormFieldBaseProps<T> & {
	type: 'checkbox'
}

type ImageProps<T extends string> = FormFieldBaseProps<T> & {
	type: 'image'
	onTDRAssetsSelect?: (files: TDRFile[]) => void
}

type ListProps = {
	type: 'list'
	field: string
	value: string
	onChange?: (value: string) => void
	name?: string
}

type FormFieldProps = TextProps<string> | CheckboxProps<boolean> | ImageProps<string> | ListProps

const FormField = ({ field, type, value, onChange, name, ...props }: FormFieldProps) => {
	const [curValue, setCurValue] = useState(value)
	switch (type) {
		case 'text':
			return <TextField name={name} title={field} value={value as string} onChange={(e) => onChange?.(e)} />
		case 'checkbox':
			return <CheckboxWithLabel title={field} value={value as boolean} onChange={(e) => onChange?.(e)} />
		case 'image':
			return (
				<div className="flex flex-col">
					<div className="flex flex-row w-full items-center">
						<TextField
							key={curValue as string}
							name={name}
							title={field}
							value={curValue as string}
							onChange={(e) => {
								setCurValue(e)
								onChange?.(e)
							}}
							append={
								(props as ImageProps<string>)?.onTDRAssetsSelect ? (
									<div className="w-min">
										<TDRLinking
											onAssetsSelect={(files) => {
												if (files.length > 0) {
													const assetSelectHandler = (props as ImageProps<string>).onTDRAssetsSelect
													const file = files[0]

													setCurValue(isSupportedImageExtension(file.Extension) ? file.Access : file.Thumbnail)
													assetSelectHandler?.(files)
												}
											}}
										/>
									</div>
								) : undefined
							}
						/>
					</div>

					<ImagePreview src={curValue as string} alt={field} />
				</div>
			)

		case 'list':
			return (
				<Dropdown
					options={[]}
					onChange={function (option: { value: string; label: string }): void {
						throw new Error('Function not implemented.')
					}}
				/>
			)

		default:
			return 'Unsupported input type'
	}
}

export default FormField
