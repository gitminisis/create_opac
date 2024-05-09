import InfoTable, { TableRow } from '@/components/common/InfoTable'
import RecordDetail from '@/components/common/RecordDetail'
import useJSONData from '@/hooks/useJSONData'
import { getFieldDataByLabel, getFieldsFromRecord } from '@/lib/record'
import { DBFields } from '../../types/record'
import { DetailM3Sample } from '@/samples'
import DetailRecordAction from '@/page/detail/DetailRecordAction'
import useConstants from '@/hooks/useConstants'

type Props = {}

const DetailRecord = (props: Props) => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const fields = useConstants().fields
	// const { records } = useJSONData({ defaultData: DetailM3Sample })
	const record = records[0]
	const database = record.database_name
	const recordData: DBFields<'COLLECTIONS'> = record.record
	const title = getFieldDataByLabel(record, fields, database, 'Title') || 'Untitled'
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
						renderRow={(row) => <div>{row.value}</div>}
					/>

					<DetailRecordAction />
				</div>
			</RecordDetail>
		</>
	)
}

export default DetailRecord
