import ProfileTable, { ProfileData } from '@/components/common/client-profile/ProfileTable'
import PatronLayout from '@/components/layouts/patron'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { getHomeSessionID } from '@/lib/utils'
import { Checkbox } from '@radix-ui/react-checkbox'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

const Enquiries = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const statusClassMap = {
		Request: 'bg-blue-200 text-blue-800',
		Active: 'bg-green-200 text-green-800',
		Closed: 'bg-orange-200 text-yellow-800',
		Deleted: 'bg-red-200 text-red-800',
	}
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
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'enq_id',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.inquiryNumber}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => (
				<div className="capitalize">
					<a
						className="font-bold underline"
						href={
							getHomeSessionID() +
							'?changesinglerecord&database=ENQUIRIES_VIEW&DE_FORM=[OPAC_ENQUIRY]de_enquiryreplyform.html&EXP=ENQ_ID%20' +
							row.getValue('enq_id')
						}>
						{row.getValue('enq_id')}
					</a>
				</div>
			),
		},
		{
			accessorKey: 'enq_topic',
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
			cell: ({ row }) => <div className="">{row.getValue('enq_topic')}</div>,
		},
		{
			accessorKey: 'enq_title',
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
			cell: ({ row }) => <div className="">{row.getValue('enq_title')}</div>,
		},
		{
			accessorKey: 'enq_create_date',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.dateCreated}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => <div className="">{row.getValue('enq_create_date')}</div>,
		},
		{
			accessorKey: 'enq_status',
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
			cell: ({ row }) => {
				const status = row.getValue('enq_status') as keyof typeof statusClassMap
				return (
					<Badge className={`${statusClassMap[status]}`} variant={'tag'}>
						{row.getValue('enq_status')}
					</Badge>
				)
			},
		},
	]
	return (
		<PatronLayout heading="Inquiries">
			<ProfileTable
				data={records}
				columns={columns}
				filterType={'enquiry'}
				filterTypeShow=""
				filterDateType={'enq_create_date'}
			/>
		</PatronLayout>
	)
}

export default Enquiries
