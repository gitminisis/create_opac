import InfoTable, { TableRow } from '@/components/common/InfoTable'
import RecordDetail from '@/components/common/RecordDetail'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { getFieldDataByLabel, getFieldsFromRecord } from '@/lib/record'
import DetailRecordAction from '@/page/detail/DetailRecordAction'
import { DBFields } from '../../types/record'
import { convertLowerTrim } from '@/lib/utils'
import { HighlightText } from '@/components/common/HighlightText'

type Props = {}

const DetailRecord = (props: Props) => {
	const { records, common } = useJSONData({ selector: '#xml_record' })
	const { fields } = useConstants()
	const record = records[0]
	const database = record.database_name
	const recordData: DBFields<'COLLECTIONS'> = record.record
	const title = getFieldDataByLabel(record, fields, database, 'Title') || record.record.title || record.record.legal_title || 'Untitled'
	const detailFields = getFieldsFromRecord(
		convertLowerTrim(database) === 'selection_list' ? record.record : record,
		fields,
		(item) => item.detail,
		(data, item) => ({ label: item.label, value: data })
	) as TableRow[]
	const searchTerms = common?.search_statement?.toString()?.split(' ') ?? []

	return (
		<RecordDetail heading={<HighlightText text={title} highlights={searchTerms} />} subHeading={recordData.collection}>
			<div className="flex flex-col space-y-12">
				<InfoTable
					rowsData={detailFields || []}
					renderRow={({ value }) => {
						if (typeof value === 'string') {
							return (
								<div>
									<HighlightText text={value} highlights={searchTerms} />
								</div>
							)
						}
						if (Array.isArray(value)) {
							return value.map((e, i) => (
								<div key={i}>
									<HighlightText text={e.toString()} highlights={searchTerms} />
								</div>
							))
						}
						return value
					}}
				/>

				<DetailRecordAction />
			</div>
		</RecordDetail>
	)
}

export default DetailRecord
