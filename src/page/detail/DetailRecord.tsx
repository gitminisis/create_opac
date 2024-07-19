import InfoTable, { TableRow } from '@/components/common/InfoTable'
import RecordDetail from '@/components/common/RecordDetail'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { getFieldDataByLabel, getFieldsFromRecord } from '@/lib/record'
import DetailRecordAction from '@/page/detail/DetailRecordAction'
import { DBFields } from '../../types/record'

type Props = {}

const DetailRecord = (props: Props) => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const fields = useConstants().fields
	// const { records } = useJSONData({ defaultData: DetailM3Sample })
	const record = records[0]
	const database = record.database_name
	const recordData: DBFields<'COLLECTIONS'> = record.record
	const title =
		getFieldDataByLabel(record, fields, database, 'Title') || record.record.title || 'Untitled'
	const detailFields = getFieldsFromRecord(
		record,
		fields,
		(item) => item.detail,
		(data, item) => ({ label: item.label, value: data })
	) as TableRow[]

	return (
		<>
			<RecordDetail heading={title} subHeading={recordData.collection}>
				<div className="flex flex-col space-y-12">
					<InfoTable
						rowsData={detailFields || []}
						renderRow={({ value }) => {
							if (typeof value === 'string') {
								return <div>{value}</div>
							}
							if (Array.isArray(value)) {
								return value.map((e, i) => <div key={i}>{e.toString()}</div>)
							}
							return value
						}}
					/>
					<DetailRecordAction />
				</div>
			</RecordDetail>
		</>
	)
}

export default DetailRecord
