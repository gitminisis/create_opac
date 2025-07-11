import React from 'react'

export type TableRow = {
	label: string
	value: number | string | string[] | React.ReactNode
}

export interface TInfoTable {
	rowsData: TableRow[]
	renderRow: (row: TableRow, index: number) => string | React.ReactNode
}
const InfoTable = ({ rowsData, renderRow = (row) => row.value }: TInfoTable) => {
	return (
		<div className="flow-root">
			<dl className="-my-3 divide-y divide-gray-100 text-sm">
				{rowsData.map((row, index) => (
					<div key={row.label} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
						<dt className="font-bold  text-gray-900">{row.label}</dt>
						<dd className="text-gray-800  sm:col-span-2">{renderRow(row, index)}</dd>
					</div>
				))}
			</dl>
		</div>
	)
}

export default InfoTable
