import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import useConstants from '@/hooks/useConstants'
import { CircleHelp, CircleMinus, CirclePlus, CircleX, TextSearch } from 'lucide-react'
import { useRef, useState } from 'react'
import AdvancedSearchInput from './AdvancedSearchInput'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
export type FieldObject = {
	field: string
	keyword: string
	boolean?: string
	remove?: boolean
}

type Advanced_Search_Props = {
	search_database: string
	url: string
}

export const STATUS_TYPE = {
	Invalid: 'Invalid',
	Success: 'Success',
	Confirm: 'Confirm',
	Cancel: 'Cancel',
	OutDate: 'OutDate',
	InList: 'InList', // Already registered
	Full: 'Full', // Fully registered
	Expired: 'Expired',
} as const

export const ADVANCED_SEARCH_BOOLEAN = {
	AND: 'AND',
	OR: 'OR',
	NOT: 'NOT',
}

type KeywordType = 'AND_WORD' | 'OR_WORD' | 'ADJ_WORD'

const AdvancedSearchForm = ({ search_database, url }: Advanced_Search_Props) => {
	const { message, advancedSearch, home, archives, museum, library } = useConstants()
	const [searchExp, setSearchExp] = useState<FieldObject[]>([
		{
			field: getDefaultField(search_database),
			keyword: '',
			boolean: ADVANCED_SEARCH_BOOLEAN.AND,
		},
		{ field: '', keyword: '', boolean: ADVANCED_SEARCH_BOOLEAN.AND },
		{ field: '', keyword: '' },
	])
	const formRef = useRef<HTMLFormElement>(null)
	const inputRef = useRef<any>(null)
	const navigations = [home, archives, museum, library]
	const [digitalDoc, setDigitalDoc] = useState(false)
	const [selected, setSelected] = useState<KeywordType | null>(null)

	const getDBTitle = (search_database: string) => {
		let db = navigations.filter((item) => item.database_name === search_database)
		if (search_database === 'UNION_VIEW') return 'All collections'
		if (!search_database) return ''
		return `${db[0].displayTitle}`
	}

	function getDefaultField(search_database: string) {
		let db = advancedSearch.filter((item) => item.database === search_database)
		return db[0].items[0].name
	}

	const updateField = (key: string, value: string, index: string) => {
		const newSearchExp: any = [...searchExp]
		newSearchExp[index][key] = value
		setSearchExp(newSearchExp)
	}

	const removeField = (index: number) => {
		const newSearchExp = [...searchExp]
		newSearchExp.splice(index, 1)
		if (newSearchExp.length > 0) {
			newSearchExp[newSearchExp.length - 1].boolean = undefined
		}
		setSearchExp(newSearchExp)
	}

	const addField = () => {
		const newSearchExp = [...searchExp]
		newSearchExp[newSearchExp.length - 1].boolean = ADVANCED_SEARCH_BOOLEAN.AND
		newSearchExp.push({ field: '', keyword: '', remove: true })
		setSearchExp(newSearchExp)
	}

	const handleChange = (name: KeywordType, checked: boolean | 'indeterminate') => {
		setSelected(checked === true ? name : null)
	}

	const resetFields = () => {
		setSearchExp([
			{
				field: getDefaultField(search_database),
				keyword: '',
				boolean: ADVANCED_SEARCH_BOOLEAN.AND,
			},
			{ field: '', keyword: '', boolean: ADVANCED_SEARCH_BOOLEAN.AND },
			{ field: '', keyword: '' },
		])
		setDigitalDoc(false)
		setSelected(null)
	}

	const submitSearch = () => {
		let data = searchExp.filter((e) => e.keyword !== '')
		if (data.length < 1) {
			toast({
				title: `${message.advWarnMsg}`,
			})
			return
		}
		let len = data.length
		let qry = data.map((exp, index) => `${exp.field} ${exp.keyword} ${exp.boolean && index !== len - 1 ? exp.boolean : ''}`).join(' ')
		if (digitalDoc) {
			qry += ` AND MEDIA_PRESENT_UN Ready`
		}

		inputRef.current.value = qry
		formRef.current?.submit()
	}

	return (
		<div className={'w-full h-full min-h-[45vh] my-8 flex flex-col justify-center items-center'}>
			<div className={'w-full md:w-5/6 flex flex-col justify-center items-center bg-slate-200 py-11 rounded-xl'}>
				<h2 className={'text-4xl text-center'}>
					{getDBTitle(search_database)} {message.advanceSearch}
				</h2>
				<div className={'text-center'}>{message.advanceSearchDesc}</div>
				<form ref={formRef} method="POST" id="advancedSearchForm" action={`${url}`} className={'hidden'}>
					<input name="QUERY_EXPRESSION" ref={inputRef} hidden id="advancedSearchInput" />
					{selected && <input type="hidden" name={'FLD_OP1'} value={selected} />}
				</form>
				<div className={'w-full md:w-4/6 mt-3 flex flex-col items-center'}>
					{searchExp.map((exp, index) => (
						<div className={'w-full flex items-center justify-center'} key={index}>
							<AdvancedSearchInput
								submitSearch={submitSearch}
								updateField={updateField}
								exp={exp}
								index={index}
								database_name={search_database}
							/>
							{index >= 3 ? (
								<CircleMinus
									key={index}
									className="dynamic-delete-button"
									type="minus-circle-o"
									onClick={(_) => {
										removeField(index)
									}}
								/>
							) : (
								<span className="dynamic-delete-button w-[24px]"></span>
							)}
						</div>
					))}
					<div className={'flex items-center text-primary my-3 cursor-pointer'}>
						<div onClick={addField} className={'w-40 border-dashed border-2 border-primary p-2 flex justify-evenly items-center'}>
							<CirclePlus />
							<div className={'text-center font-bold'}>{message.addField}</div>
						</div>
						<div className="relative group inline-block">
							<button className="p-2 rounded text-black">
								<CircleHelp />
							</button>
							<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 w-48 bg-gray-800 text-white text-center text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
								{message.advanceSearchTooltip}
							</div>
						</div>
					</div>
					<div className={'flex items-center my-3'}>
						<Checkbox onClick={() => setDigitalDoc(!digitalDoc)} checked={digitalDoc} />
						<Label className="ml-1 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							{message.digitalDocumentsOnly}
						</Label>
					</div>
					<div className={'w-full flex justify-center'}>
						<div className={'w-full max-w-[173px] md:max-w-[500px] md:flex justify-evenly '}>
							<div className={'flex items-center my-1'}>
								<Checkbox checked={selected === 'AND_WORD'} onCheckedChange={(v) => handleChange('AND_WORD', v)} id="AND_WORD" />
								<Label className="ml-1 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									{message.allOfTheseKeywords}
								</Label>
							</div>
							<div className={'flex items-center my-1'}>
								<Checkbox checked={selected === 'OR_WORD'} onCheckedChange={(v) => handleChange('OR_WORD', v)} id="OR_WORD" />
								<Label className="ml-1 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									{message.anyOfTheseKeywords}
								</Label>
							</div>
							<div className={'flex items-center my-1'}>
								<Checkbox checked={selected === 'ADJ_WORD'} onCheckedChange={(v) => handleChange('ADJ_WORD', v)} id="ADJ_WORD" />
								<Label className="ml-1 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									{message.exactPhrase}
								</Label>
							</div>
						</div>
					</div>

					<div className="w-full mt-8 flex justify-between m-2">
						<Button variant={'default'} className={'h-[50px] w-[45%] ml-[7px] font-bold text-lg'} onClick={submitSearch}>
							<TextSearch className={'mb-1'} />
							<span className="mx-2 block text-l">{message.searchButton}</span>
						</Button>
						<Button variant={'default'} className={'h-[50px] w-[45%] mr-[25px] font-bold text-lg'} onClick={resetFields}>
							<CircleX className={'mb-1'} />
							<span className="mx-2 block text-l">{message.clear}</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AdvancedSearchForm
