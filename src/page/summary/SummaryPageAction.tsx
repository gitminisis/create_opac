import CheckboxWithLabel from '@/components/common/CheckboxWithLabel'
import CollapseList from '@/components/common/CollapseList'
import DropdownSelect from '@/components/common/DropdownSelect'
import useConstants from '@/hooks/useConstants'
import useJSONData, { COMMON_FIELDS_TYPE, SORT_TYPE } from '@/hooks/useJSONData'
import { convertToArr, fetchSearchHistory, getHomeSessionID } from '@/lib/utils'
import { Label } from '@radix-ui/react-dropdown-menu'
import BookmarkAll from '../bookmark/BookmarkAll'
import ViewBookmarks from '../bookmark/ViewBookmarks'
import { useState, useEffect } from 'react'

/**
 * This component contains:
 * - Search History
 * - Filter
 * - Number of records per page
 * - Sort
 * - Bookmark
 */
const SummaryPageAction = () => {
	const { message } = useConstants()
	const { filter, common, getSortURL } = useJSONData({ selector: '#xml_record' })
	const [searchHistoryData, setSearchHistoryData] = useState<any>(null)
	let filterArr = convertToArr(filter)

	useEffect(() => {
		const getData = async () => {
			const data = await fetchSearchHistory()
			console.log(data)
			setSearchHistoryData(data)
		}
		console.log(searchHistoryData)
		getData()
	}, [])
	const SORT_OPTIONS: { label: string; value: SORT_TYPE }[] = [
		{
			label: message.sortDefault,
			value: 'default',
		},
		{
			label: message.sortTitleAscending,
			value: 'title_asc',
		},
		{
			label: message.sortTitleDescending,
			value: 'title_dsc',
		},
		{
			label: message.sortDateAscending,
			value: 'date_asc',
		},
		{
			label: message.sortDateDescending,
			value: 'date_dsc',
		},
	]

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex flex-col space-y-2">
				<Label className="font-bold">{message.searchHistory}</Label>
				<div className="max-h-[250px] overflow-y-auto rounded-md border border-input">
					<table className="w-full text-sm">
						<thead>
							<tr className="sticky top-0 z-10">
								<th className="px-4 py-2 text-left bg-primary text-white">Keyword</th>
								<th className="px-4 py-2 text-right bg-primary text-white">Results</th>
							</tr>
						</thead>
						<tbody>
							{[
								...(Array.isArray(searchHistoryData?.database?.statement)
									? searchHistoryData.database.statement
									: searchHistoryData?.database?.statement
										? [searchHistoryData.database.statement]
										: []),
							]
								.filter((item, index, self) => self.findIndex((i) => i.expression === item.expression) === index)
								.reverse()
								.map((item: { count: string; expression: string; summary_link: string }, index: number) => (
									<tr key={index} className="even:bg-gray-200 hover:bg-gray:200">
										<td className="px-4 py-2">
											<a
												href={
													getHomeSessionID() +
													`?UNIONSEARCH&KEEP=Y&LANG=144&APPLICATION=UNION_VIEW&EXP=KEYWORD_CLUSTER%20` +
													item.expression
												}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:underline"
												title={item.expression}>
												{item.expression.length > 40 ? `${item.expression.slice(0, 40)}...` : item.expression}
											</a>
										</td>
										<td className="px-4 py-2 text-right">
											<div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-primary-foreground hover:bg-primary/80 bg-black">
												{item.count}
											</div>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
			<div className="flex flex-col space-y-2">
				<Label className="font-bold">{message.bookmark}</Label>
				<ViewBookmarks />
				<BookmarkAll />
			</div>
			<div className="flex flex-col space-y-2">
				<Label className="font-bold">{message.recordPerPage}</Label>
				<DropdownSelect
					register={{
						onValueChange: (value) => {
							const pageURL = common[`pagesize_${value}` as COMMON_FIELDS_TYPE] as string
							if (pageURL) {
								window.location.href = pageURL
							}
						},
					}}
					title={message.selectRecordsNumber}
					options={[
						{
							label: `${message.displaying} 12 ${message.record}s`,
							value: 12,
						},
						{
							label: `${message.displaying} 25 ${message.record}s`,
							value: 25,
						},
						{
							label: `${message.displaying} 50 ${message.record}s`,
							value: 50,
						},
						{
							label: `${message.displaying} 100 ${message.record}s`,
							value: 100,
						},
					]}
				/>
			</div>
			<div className="flex flex-col space-y-2">
				<Label className="font-bold">{message.sortBy}</Label>
				<DropdownSelect
					title={message.sortBy}
					register={{
						onValueChange: (value: SORT_TYPE) => {
							const url = getSortURL('UNION_VIEW', value)
							window.location.href = url
						},
					}}
					options={SORT_OPTIONS}
				/>
			</div>
			{filterArr && filterArr.length > 0 && (
				<div className="flex flex-col space-y-2">
					<Label className="font-bold">{message.filterBy}</Label>
					<div className="flex flex-col space-y-4">
						{filterArr.map((item, index) => (
							<CollapseList title={item._title} expand={index === 0} key={item._name}>
								<div className="space-y-3 border-t p-4 max-h-[500px] overflow-y-auto">
									{item.item_group.map(
										(option: {
											item_link: string | { item_selected: string; __text: string }
											item_value: any
											item_frequency: any
											item_selected: string
										}) => (
											<CheckboxWithLabel
												callback={() => {
													window.location.href =
														typeof option.item_link === 'string'
															? option.item_link
															: option.item_link?.__text ?? option.item_link
												}}
												label={`${option.item_value} (${option.item_frequency})`}
												checked={
													option.item_selected === 'Y' ||
													(typeof option.item_link === 'object' && option.item_link?.item_selected === 'Y')
												}
											/>
										)
									)}
								</div>
							</CollapseList>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default SummaryPageAction
