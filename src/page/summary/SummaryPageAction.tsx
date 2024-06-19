import CheckboxWithLabel from '@/components/common/CheckboxWithLabel'
import CollapseList from '@/components/common/CollapseList'
import DropdownSelect from '@/components/common/DropdownSelect'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { SummarySample } from '@/samples'
import { Label } from '@radix-ui/react-dropdown-menu'

/**
 * This component contains:
 * - Filter
 * - Number of records per page
 * - Sort
 * - Bookmark
 */
const SummaryPageAction = () => {
	const { message } = useConstants()
	const { filter } = useJSONData({ selector: '#xml_record' })
	return (
		<div className="flex flex-col space-y-4">
			<div className="flex flex-col space-y-2">
				<Label>{message.recordPerPage}</Label>
				<DropdownSelect
					className="text-left"
					title={message.selectRecordsNumber}
					options={[
						{
							label: 'Display 12 records',
							value: 12,
						},
						{
							label: 'Display 25 records',
							value: 25,
						},
						{
							label: 'Display 50 records',
							value: 50,
						},
						{
							label: 'Display 100 records',
							value: 100,
						},
					]}
				/>
			</div>
			<div className="flex flex-col space-y-2">
				<Label>{message.sortBy}</Label>
				<DropdownSelect
					title={message.sortBy}
					options={[
						{
							label: 'Default',
							value: 'test',
						},
						{
							label: 'Accession Number',
							value: 'test',
						},
						{
							label: 'Title Ascending',
							value: 'test',
						},
						{
							label: 'Title Descending',
							value: 'test',
						},
						{
							label: 'Date Ascending',
							value: 'test',
						},
						{
							label: 'Date Descending',
							value: 'test',
						},
					]}
				/>
			</div>

			{filter && filter.length > 0 && (
				<div className="flex flex-col space-y-2">
					<Label>{message.filterBy}</Label>
					<div className="flex flex-col space-y-4">
						{filter.map((item, index) => (
							<CollapseList title={item._title} expand={index === 0} key={item._name}>
								<div className="space-y-3  border-t p-4">
									{item.item_group.map((option) => (
										<CheckboxWithLabel
											callback={() => {
												window.location.href = option.item_link
											}}
											label={`${option.item_value} (${option.item_frequency})`}
											checked={option.item_selected === 'Y'}
										/>
									))}
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
