import ProfileTable, { ProfileData } from '@/components/common/client-profile/ProfileTable'
import PatronLayout from '@/components/layouts/patron'
import { Button } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import {
	encodeURIStringToMinisisSpecialCharacter,
	getCookieValue,
	getHomeSessionID,
} from '@/lib/utils'
import { Checkbox } from '@radix-ui/react-checkbox'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'

const Orders = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const message = useConstants().message
	const cancelRequest = (reqNumber: string) => {
		var cancelReq_url =
			getCookieValue('HOME_SESSID') +
			'?MANIPXMLRECORD&KEY=REQ_ORDER_NUM&VALUE=' +
			reqNumber +
			'&DATABASE=REQUEST_INFO'
		var xmlForm = '<?xml version="1.0" encoding="UTF-8"?>\n<RECORD>\n'
		xmlForm = xmlForm.concat('<REC_STATUS>Deleted</REC_STATUS>\n')
		axios({
			method: 'post',
			url: cancelReq_url,
			headers: {
				'Content-Type': 'text/xml',
			},
			data: xmlForm,
			timeout: 300000, // 5-minute timeout
		})
			.then((response) => {
				const parser = new DOMParser()
				const xmlDoc = parser.parseFromString(response.data, 'text/xml')
				const errorValue = xmlDoc.querySelector('error')?.textContent

				if (errorValue && parseInt(errorValue, 10) === 0) {
					// Reload the page if the status was successfully changed
					window.location.reload()
				}
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

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
			accessorKey: 'date_needed',
			header: message.date,
			cell: ({ row }) => (
				<div className="capitalize">
					{row.getValue('date_needed') ? row.getValue('date_needed') : 'N/A'}
				</div>
			),
		},
		{
			accessorKey: 'time_needed',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.time}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => (
				<div className="">
					{row.getValue('time_needed') ? row.getValue('time_needed') : 'N/A'}
				</div>
			),
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
			accessorKey: 'req_item_id',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.referenceNo}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => (
				<div className="underline">
					<a
						className={`${row.getValue('req_db_name') ? '' : 'pointer-events-none'}`}
						href={
							getHomeSessionID() +
							'/' +
							row.getValue('req_db_name') +
							'/' +
							(row.getValue('req_db_name') == 'DESCRIPTION_WEB'
								? 'REFD'
								: 'ACCESSION_NUMBER') +
							'/' +
							encodeURIStringToMinisisSpecialCharacter(row.getValue('req_item_id')) +
							'?JUMP'
						}>
						{row.getValue('req_item_id')}
					</a>
				</div>
			),
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
			accessorKey: 'req_order_num',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.action}
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => (
				<div className="">
					{row.getValue('rec_status') === 'Deleted' ? (
						<Button disabled>{message.cancelled}</Button>
					) : row.getValue('req_status') === 'Retrieve' ||
					  row.getValue('req_status') === 'Prepared' ||
					  row.getValue('req_status') === 'Requested' ||
					  row.getValue('req_status') === 'Conservation' ? (
						<Button onClick={() => cancelRequest(row.getValue('req_order_num'))}>
							{message.cancel}
						</Button>
					) : (
						<Button disabled>{message.noAction}</Button>
					)}
				</div>
			),
		},
		{
			accessorKey: 'rec_status',
			header: ({ column }) => {
				return <></>
			},
			cell: ({ row }) => <></>,
		},
		{
			accessorKey: 'req_db_name',
			header: ({ column }) => {
				return <></>
			},
			cell: ({ row }) => <></>,
		},
	]
	return (
		<PatronLayout heading="Orders">
			<ProfileTable
				data={records}
				columns={columns}
				filterType={'req_title'}
				filterTypeShow=""
				filterDateType={'date_needed'}
			/>
		</PatronLayout>
	)
}

export default Orders
