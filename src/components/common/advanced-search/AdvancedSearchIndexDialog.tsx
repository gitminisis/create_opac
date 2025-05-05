import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	ScrollAreaCorner,
	ScrollAreaRoot,
	ScrollAreaScrollbar,
	ScrollAreaThumb,
	ScrollAreaViewport,
} from '@/components/ui/scrollArea'
import { toast } from '@/components/ui/use-toast'
import useConstants from '@/hooks/useConstants'
import { convertXMLToJson, getSessionID } from '@/lib/utils'
import axios from 'axios'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Menu, Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '../../ui/dialog'

interface ClusterData {
	index_list: {
		option: string[]
	}
	first_page: string
	prev_page: string
	next_page: string
	last_page: string
	keyname: string
	find: string
}

type option = {
	name: string
	bg: string
}

interface Adv_dialog {
	field: string
	updateField: Function
	adv_search_index: number
	database_name: string
	label: string | undefined
}

const DEFAULT_OPTION_COLOR = 'bg-white'
const SELECT_OPTION_COLOR = 'bg-green-200'

const AdvancedSearchIndexDialog = ({
	field,
	updateField,
	adv_search_index,
	database_name,
	label,
}: Adv_dialog) => {
	const { message, advancedSearch } = useConstants()
	const [open, setOpen] = useState(false)
	const [cluster, setCluster] = useState<ClusterData>({
		index_list: {
			option: [],
		},
		first_page: '',
		prev_page: '',
		next_page: '',
		last_page: '',
		keyname: '',
		find: '',
	})
	const [options, setOptions] = useState<option[]>([])
	const [keyvalue, setKeyvalue] = useState<string>('')
	const [userSelect, setUserSelect] = useState('')

	const getCluster = async (field: string) => {
		let HOME_SESSID = getSessionID()
		await axios
			.get(
				`${HOME_SESSID}/FIRST?INDEXLIST&KEYNAME=${field}&DATABASE=${database_name}&form=[INCLUDES]cluster.html`
			)
			.then((res) => {
				updateClusterList(res)
			})
	}

	const getClusterBySearch = (keyvalue: string, keyname: string, url: string) => {
		let data = `KEYNAME=${keyname}&KEYVALUE=${keyvalue}`
		axios.post(url, data).then((res) => {
			updateClusterList(res)
		})
	}

	const pageAction = (url: string) => {
		url = url.replace(/--/g, '')
		axios
			.get(url)
			.then((res) => {
				if (url !== '#' && res.data && res.data !== '') {
					updateClusterList(res)
				}
			})
			.catch(function (error) {})
	}

	const updateClusterList = (res: any) => {
		let parser = new DOMParser()
		let xml = parser.parseFromString(res.data, 'text/xml')
		let xmlText = new XMLSerializer().serializeToString(xml)
		const list = convertXMLToJson(xmlText)
		let nOptions: option[] = list.cluster?.index_list?.option.map((item: string) => {
			return {
				name: item,
				bg: DEFAULT_OPTION_COLOR,
			}
		})

		setCluster(list.cluster)
		setOptions(nOptions ?? [])
	}

	const handleKeyvalueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setKeyvalue(event.target.value)
	}

	const handleSubmit = () => {
		if (!userSelect) return toast({ title: `${message.advIdxSubmitWarnMsg}` })
		updateField('keyword', userSelect, adv_search_index)
		setOptions([])
		setKeyvalue('')
		setOpen(false)
	}

	const optionClick = (name: string, selected_key: number) => {
		let list = options
		let n_list = list.map((item, key) => {
			if (key === selected_key) {
				return {
					...item,
					bg: SELECT_OPTION_COLOR,
				}
			}
			return {
				...item,
				bg: DEFAULT_OPTION_COLOR,
			}
		})
		setOptions(n_list)
		setUserSelect(name)
	}

	const openDialog = () => {
		if (!field) return
		setOpen(true)
		getCluster(field)
	}

	return (
		<Dialog open={open}>
			<DialogTrigger asChild onClick={openDialog}>
				<Button
					disabled={!field ? true : false}
					className={
						'h-full w-[50px] px-0 flex items-center justify-center overflow-hidden ml-3 bg-primary '
					}>
					<Menu />
				</Button>
			</DialogTrigger>
			<DialogContent
				hideClose={'hidden'}
				onInteractOutside={() => setOpen(false)}
				modal={true}
				className={'rounded'}>
				<div className={'w-full flex justify-center items-center relative'}>
					<DialogHeader className={'font-bold text-xl md:text-2xl'}>
						{message.browseCluster} '{label}'
					</DialogHeader>
					<Button
						className={
							'absolute right-1 p-1 bg-primary font-bold mx-1 text-white rounded w-[40px]'
						}
						onClick={() => setOpen(false)}>
						<X className={'h-6 w-6'} />
					</Button>
				</div>
				<div className={'flex'}>
					<div className="w-full relative">
						<Input
							required
							className={
								'w-full rounded-none pl-4 border-2 py-3 bg-transparent border-primary text-black rounded-l-md ring-inset'
							}
							name="keyvalue"
							onChange={handleKeyvalueChange}
							placeholder={message.searchPlaceholder}
							type="search"
						/>
					</div>
					<Button
						variant={'default'}
						onClick={() => getClusterBySearch(keyvalue, cluster.keyname, cluster.find)}
						className="right-0 top-0 h-full bg-primary rounded-l-lg "
						type="submit">
						<span className="block">
							<Search className="w-4 h-4" />
						</span>
					</Button>
				</div>
				<div className={'flex w-full justify-between items-center'}>
					<div
						className={
							'p-1 bg-primary font-bold mx-1 text-white rounded cursor-pointer'
						}
						onClick={() => pageAction(cluster.first_page)}>
						<ChevronFirst />
					</div>
					<div
						className={
							'p-1 bg-primary font-bold mx-1 text-white rounded cursor-pointer'
						}
						onClick={() => pageAction(cluster.prev_page)}>
						<ChevronLeft />
					</div>
					<ScrollAreaRoot className={'w-48 md:w-64 h-[400px]'}>
						<ScrollAreaViewport>
							<div className="py-[15px] px-5">
								{options?.length > 1 ? (
									options?.map((item: option, key) => (
										<div
											className={`${item.bg} cursor-pointer text-mauve12 text-[13px] leading-[18px] p-2.5 border-t border-t-mauve6`}
											onDoubleClick={handleSubmit}
											onClick={() => optionClick(item.name, key)}
											key={key}>
											{item.name}
										</div>
									))
								) : (
									<div>{message.noKeyFound}</div>
								)}
							</div>
						</ScrollAreaViewport>
						<ScrollAreaScrollbar orientation="vertical">
							<ScrollAreaThumb />
						</ScrollAreaScrollbar>
						<ScrollAreaScrollbar orientation="horizontal">
							<ScrollAreaThumb />
						</ScrollAreaScrollbar>
						<ScrollAreaCorner />
					</ScrollAreaRoot>
					<div
						className={
							'p-1 bg-primary font-bold mx-1 text-white rounded cursor-pointer'
						}
						onClick={() => pageAction(cluster.next_page)}>
						<ChevronRight />
					</div>
					<div
						className={
							'p-1 bg-primary font-bold mx-1 text-white rounded cursor-pointer'
						}
						onClick={() => pageAction(cluster.last_page)}>
						<ChevronLast />
					</div>
				</div>
				<DialogFooter
					className={' w-full flex  bottom-1 relative md:justify-center md:items-center'}>
					<Button className={'w-full font-bold'} onClick={handleSubmit}>
						{message.submit}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default AdvancedSearchIndexDialog
