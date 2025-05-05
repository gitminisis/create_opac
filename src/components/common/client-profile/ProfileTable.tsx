import * as React from 'react'
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { endOfMonth, subMonths } from 'date-fns'
import { DatePickerWithRange } from './DatePickerWithRange'
import useConstants from '@/hooks/useConstants'
import { RefreshCw } from 'lucide-react'

export type ProfileData = {
	[key: string]: any
}

type DateRange = {
	from: Date | string
	to: Date | string
}

export function ProfileTable({
	data,
	columns,
	filterType,
	filterTypeShow,
	filterDateType,
}: {
	data: ProfileData[]
	columns: ColumnDef<ProfileData>[]
	filterType: string
	filterTypeShow: string
	filterDateType?: string
}) {
	const message = useConstants().message
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})
	const [records, setRecords] = React.useState<any>([])
	const [date, setDate] = React.useState<DateRange>({
		from: subMonths(new Date(), 1),
		to: endOfMonth(new Date()),
	})

	React.useEffect(() => {
		setRecords(filterDateType && date?.from ? filterEventsByDateRange(data, date) : data)
	}, [date])

	const resetFilter = () => {
		filterDateType && setDate({ from: '', to: '' })
		table.getColumn(filterType)?.setFilterValue('')
	}

	const table = useReactTable({
		data: records,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	const filterEventsByDateRange = (events: any[], range: any) => {
		const fromDate = new Date(range.from)
		const toDate = new Date(range.to)
		return events.filter((event) => {
			const eventDate = new Date(event[`${filterDateType}`])
			return eventDate >= fromDate && eventDate <= toDate
		})
	}

	return (
		<div className="w-full">
			<div className="md:flex items-center py-4">
				<Input
					placeholder={`Search ${filterTypeShow}...`}
					value={(table.getColumn(filterType)?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn(filterType)?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				{filterDateType && (
					<div className="flex items-center">
						<DatePickerWithRange
							date={date}
							setDate={setDate}
							className={'mt-1 mr-1 md:mt-0 md:ml-3'}
						/>
						<Button
							variant={'outline'}
							size="sm"
							className={'mt-1 md:mt-0 h-10 w-10 rounded-[7px] p-0'}
							onClick={resetFilter}>
							<RefreshCw height={20} width={20} />
						</Button>
					</div>
				)}
			</div>
			<div className="rounded-md border">
				<Table className={'bg-white rounded shadow-md border '}>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className={'bg-gray-100 text-bold text-center'}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className={'text-center'}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									{message.noResultFound}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{message.total} {table.getFilteredRowModel().rows.length} row(s)
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}>
						{message.previous}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}>
						{message.next}
					</Button>
				</div>
			</div>
		</div>
	)
}
export default ProfileTable
