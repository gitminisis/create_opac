import CheckboxWithLabel from '@/components/common/CheckboxWithLabel'
import CollapseList from '@/components/common/CollapseList'
import DropdownSelect from '@/components/common/DropdownSelect'
import useConstants from '@/hooks/useConstants'
import useJSONData, { COMMON_FIELDS_TYPE, SORT_TYPE } from '@/hooks/useJSONData'
import { Label } from '@radix-ui/react-dropdown-menu'
import ViewBookmarks from '../bookmark/ViewBookmarks'
import BookmarkAll from '../bookmark/BookmarkAll'
import PrintPage from '../bookmark/PrintPage'
import { convertToArr } from '@/lib/utils'

/**
 * This component contains:
 * - Filter
 * - Number of records per page
 * - Sort
 * - Bookmark
 */
const SummaryPageAction = () => {
	const { message } = useConstants()
	const { filter, common, getSortURL } = useJSONData({ selector: '#xml_record' })
	let filterArr = convertToArr(filter)
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
				<Label className="font-bold">{message.bookmark}</Label>
				<ViewBookmarks />
				<BookmarkAll />
				<PrintPage />
			</div>
			<div className="flex flex-col space-y-2">
				<Label className="font-bold">{message.recordPerPage}</Label>
				<DropdownSelect
					register={{
						onValueChange: (value) => {
							const pageURL = common[
								`pagesize_${value}` as COMMON_FIELDS_TYPE
							] as string
							if (pageURL) {
								window.location.href = pageURL
							}
						},
					}}
					title={message.selectRecordsNumber}
					options={[
						{
							label: `${message.displaying} 12 ${message.record}`,
							value: 12,
						},
						{
							label: `${message.displaying} 25 ${message.record}`,
							value: 25,
						},
						{
							label: `${message.displaying} 50 ${message.record}`,
							value: 50,
						},
						{
							label: `${message.displaying} 100 ${message.record}`,
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
											item_link: string
											item_value: any
											item_frequency: any
											item_selected: string
										}) => (
											<CheckboxWithLabel
												callback={() => {
													window.location.href = option.item_link
												}}
												label={`${option.item_value} (${option.item_frequency})`}
												checked={option.item_selected === 'Y'}
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
