import DataWithLabel from '@/components/common/DataWithLabel'
import DetailInfoCard from '@/components/common/DetailInfoCard'
import InfoCard from '@/components/common/InfoCard'
import Link from '@/components/common/Link'
import { Separator } from '@/components/ui/separator'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { getFieldDataByLabel, getFieldsFromRecord, truncateString } from '@/lib/record'
import { Record } from '@/types/record'
import { useDisplayMode } from '@/hooks/useDisplayMode'
import { BookmarkRecordAction } from './BookmarkRecordAction'

const BookmarkSummaryRecords = () => {
	const { records } = useJSONData({ selector: '#xml_record' })

	return (
		<>
			{records.map((e, i) => (
				<RecordView record={e} key={i} />
			))}
		</>
	)
}

const RecordView = ({ record }: { record: Record }) => {
	const { displayMode } = useDisplayMode()
	const { fields } = useConstants()
	const database = record.database_name || record.link_dbname || ''
	const recordLink = record.book_record_link.toString()
	const title =
		getFieldDataByLabel(record, fields, database, 'Title') ||
		record.record.title ||
		record.record.legal_title ||
		'Untitled'
	const thumbnail =
		record.media &&
		Array.isArray(record.media.im_access_link) &&
		record.media.im_access_link.length > 0 &&
		record.media.im_access_link[0]
	const gridFields = getFieldsFromRecord(
		record,
		fields,
		(item) => item.grid === true,
		(data, item) => <DataWithLabel key={item.name} label={item.label || ''} items={data} />
	) as React.ReactNode

	const listFields = getFieldsFromRecord(
		record,
		fields,
		(item) => item.summary === true,
		(data, item) => (
			<DataWithLabel
				className={`flex-col items-start justify-start my-1 space-x-0 ${item.name === 'obj_description' ? 'w-full' : 'w-[50%]'} `}
				key={item.name}
				label={item.label || ''}
				items={data}
			/>
		)
	) as React.ReactNode

	if (displayMode === 'grid') {
		return (
			<InfoCard
				link_dbname={record.link_dbname}
				className="border-primary"
				title={<Link href={recordLink}>{truncateString(title)}</Link>}
				description={gridFields}
				thumbnail={
					thumbnail
						? thumbnail.includes('[MEDIA]')
							? thumbnail.replace('[MEDIA]', '/media/')
							: thumbnail
						: 'https://placehold.co/250x250'
				}
				footer={
					<div className="flex h-4 items-center space-x-4 w-full justify-center ">
						<BookmarkRecordAction record={record} />
					</div>
				}
				record={record}
			/>
		)
	}

	return (
		<DetailInfoCard
			link_dbname={record.link_dbname}
			title={<Link href={recordLink}>{title}</Link>}
			className="col-span-4"
			thumbnail={
				thumbnail
					? thumbnail.includes('[MEDIA]')
						? thumbnail.replace('[MEDIA]', '/media/')
						: thumbnail
					: 'https://placehold.co/250x250'
			}
			footer={
				<div>
					<Separator />
					<div className="flex h-12 items-center space-x-4 w-full justify-evenly ">
						<BookmarkRecordAction record={record} />
					</div>
				</div>
			}>
			<div className="mt-4 flex justify-between flex-wrap">{listFields}</div>
		</DetailInfoCard>
	)
}

export default BookmarkSummaryRecords
