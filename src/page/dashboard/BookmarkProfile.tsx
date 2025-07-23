import ProfileTable, { ProfileData } from '@/components/common/client-profile/ProfileTable'
import PatronLayout from '@/components/layouts/patron'
import { Button } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { Checkbox } from '@radix-ui/react-checkbox'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { Home } from 'lucide-react'

const BookmarkProfile = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const { message, clientProfile } = useConstants()
	const columns: ColumnDef<ProfileData>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'req_item_id',
			header: 'Item #',
			cell: ({ row }) => <div className="capitalize">{row.getValue('req_item_id')}</div>,
		},
		{
			accessorKey: 'req_topic',
			header: ({ column }) => {
				return (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.topic}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => <div className="capitalize">{row.getValue('req_topic')}</div>,
		},
		{
			accessorKey: 'req_item_title',
			header: ({ column }) => {
				return (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.title}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => <div className="capitalize">{row.getValue('req_item_title')}</div>,
		},
		{
			accessorKey: 'req_status',
			header: ({ column }) => {
				return (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.status}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => <div className="capitalize">{row.getValue('req_status')}</div>,
		},
	]
	return (
		<PatronLayout
			
			mainHeading={
				<>
					<Home className="mr-1 h-5 w-5" />
					<h2 className="text-lg font-semibold text-gray-900">{message.clientDashboard}</h2>
				</>
			}
			heading="Bookmark">
			<ProfileTable data={records} columns={columns} filterType={'comments'} filterTypeShow="" />
		</PatronLayout>
	)
}

export default BookmarkProfile
