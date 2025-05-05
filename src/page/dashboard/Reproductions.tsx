import ProfileTable, { ProfileData } from '@/components/common/client-profile/ProfileTable'
import PatronLayout from '@/components/layouts/patron'
import { Button } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { Checkbox } from '@radix-ui/react-checkbox'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

const Reproductions = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const message = useConstants().message
	const columns: ColumnDef<ProfileData>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label={message.selectAll}
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label={message.selectRow}
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'req_order_num',
			header: `${message.order} #`,
			cell: ({ row }) => (
				<div className="capitalize">
					<a
						className="underline text-primary hover:text-opac-secondary"
						href={row.getValue('req_order_num_link')}>
						{row.getValue('req_order_num')}
					</a>
				</div>
			),
		},
		{
			accessorKey: 'req_order_num_link',
			header: '',
			cell: ({ row }) => <></>,
		},
		{
			accessorKey: 'req_item_id',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.item} #
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => <div className="">{row.getValue('req_item_id')}</div>,
		},
		{
			accessorKey: 'req_topic',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.topic}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => <div className="">{row.getValue('req_topic')}</div>,
		},
		{
			accessorKey: 'req_title',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.title}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => <div className="">{row.getValue('req_title')}</div>,
		},
		{
			accessorKey: 'req_status',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.status}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => <div className="">{row.getValue('req_status')}</div>,
		},
		{
			accessorKey: 'req_paid_amt',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.amount}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => <div className="">{row.getValue('req_paid_amt')}</div>,
		},
		{
			accessorKey: 'amt_paid',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.paid}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => <div className="">{row.getValue('amt_paid')}</div>,
		},
	]
	return (
		<PatronLayout heading={message.reproduction}>
			<ProfileTable
				data={records}
				columns={columns}
				filterType={'comments'}
				filterTypeShow=""
			/>
		</PatronLayout>
	)
}

export default Reproductions
