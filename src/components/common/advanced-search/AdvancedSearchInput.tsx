import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import useConstants from '@/hooks/useConstants'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { FieldObject } from './AdvancedSearchForm'
import AdvancedSearchIndexDialog from './AdvancedSearchIndexDialog'

interface AdvancedSearchInputProps {
	exp: FieldObject
	index: number
	database_name: string
	updateField: Function
	submitSearch: Function
}
export type selected = {
	label: string
	name: string
}

const AdvancedSearchInput = ({
	updateField,
	index,
	exp,
	database_name,
	submitSearch,
}: AdvancedSearchInputProps) => {
	const { advancedSearch, message } = useConstants()
	const [userSelect, setUserSelect] = useState<string>('')
	const ADVANCED_SEARCH_BOOLEAN_SELECT_MAP = [
		{
			key: `${message.and}`,
			value: 'AND',
		},
		{
			key: `${message.or}`,
			value: 'OR',
		},
		{
			key: `${message.not}`,
			value: 'AND NOT',
		},
	]

	const searchDatabase = () => {
		let dbArr = advancedSearch.filter((elm) => elm.database === database_name)
		return dbArr[0]
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			submitSearch()
		}
	}

	const getLabel = () => {
		let item = searchDatabase().items.find((item) => item.name === exp.field)
		return `${item?.label ?? message.searchButton}`
	}

	return (
		<div className="w-full flex relative m-2" key={index}>
			<Select
				value={exp.field}
				onValueChange={(value) => {
					updateField('field', value, index)
					setUserSelect(value)
				}}>
				<SelectTrigger className="w-52 border border-primary bg-primary text-white rounded-r-lg font-semibold text-left">
					<SelectValue
						className={'text-black'}
						placeholder={<div>{message.selectAfield}</div>}
					/>
				</SelectTrigger>
				<SelectContent position={'popper'}>
					{searchDatabase()?.items.map((item, key) => {
						return (
							<SelectItem
								key={key}
								value={item.name}
								className="text-white w-full border bg-primary border-primary">
								{item.label}
							</SelectItem>
						)
					})}
				</SelectContent>
			</Select>
			<Input
				disabled={exp.field || userSelect ? false : true}
				onKeyDown={handleKeyDown}
				value={exp.keyword}
				onChange={(e) => {
					updateField('keyword', e.target.value, index)
				}}
				className={cn(
					'placeholder:text-slate-400 w-full rounded-none pl-4 border-2 py-3 bg-transparent border-primary focus:outline-none ring-inset'
				)}
				type="search"
			/>
			{!exp.keyword && (
				<div
					className={
						'absolute w-full h-full flex items-center justify-center text-gray-500 pointer-events-none'
					}>
					<span className="hidden lg:inline ml-[15px] text-gray-500 italic">
						{message.searchPlaceholderAdv}
						{` ${getLabel()}`}
					</span>
				</div>
			)}
			<Select
				value={exp.boolean}
				onValueChange={(value) => {
					updateField('boolean', value, index)
				}}>
				<SelectTrigger
					disabled={!exp.boolean}
					className="w-28 border border-primary bg-primary text-white rounded-l-lg font-semibold ">
					<SelectValue />
				</SelectTrigger>
				<SelectContent position={'popper'}>
					{ADVANCED_SEARCH_BOOLEAN_SELECT_MAP.map((item, key) => {
						return (
							<SelectItem
								key={key}
								value={item.value}
								className="text-white w-full border border-primary bg-primary">
								{item.key}
							</SelectItem>
						)
					})}
				</SelectContent>
			</Select>
			<AdvancedSearchIndexDialog
				label={getLabel()}
				field={exp.field ?? userSelect}
				updateField={updateField}
				adv_search_index={index}
				database_name={database_name}
			/>
		</div>
	)
}

export default AdvancedSearchInput
