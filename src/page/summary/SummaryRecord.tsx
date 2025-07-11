import useConstants from '@/hooks/useConstants'
import { useDisplayMode } from '@/hooks/useDisplayMode'
import useJSONData from '@/hooks/useJSONData'
import { getFieldDataByLabel } from '@/lib/record'
import { Record } from '@/types/record'
import GridView from './GridView'
import ListView from './ListView'

const SummaryRecords = () => {
	const { records } = useJSONData({ selector: '#xml_record' })

	return (
		<>
			{records.map((record, key) => (
				<RecordView record={record} key={key} />
			))}
		</>
	)
}

interface RecordViewProps {
	record: Record
}

const RecordView = ({ record }: RecordViewProps) => {
	const { common } = useJSONData({ selector: '#xml_record' })
	const { displayMode } = useDisplayMode()
	const { fields } = useConstants()

	// Extract and process record data
	const database = record.database_name || record.link_dbname || ''
	const recordLink = record.record_link.toString()
	const title = getFieldDataByLabel(record, fields, database, 'Title') || record.record.title || 'Untitled'

	// Process thumbnail URL
	const thumbnailUrl = getThumbnailUrl(record)

	// Search highlights
	const searchTerms = common?.search_statement?.toString()?.split(' ') ?? []

	// Render appropriate view based on display mode
	return displayMode === 'grid' ? (
		<GridView
			title={title}
			recordLink={recordLink}
			searchTerms={searchTerms}
			record={record}
			fields={fields}
			database={database}
			thumbnailUrl={thumbnailUrl}
		/>
	) : (
		<ListView
			title={title}
			recordLink={recordLink}
			searchTerms={searchTerms}
			record={record}
			fields={fields}
			database={database}
			thumbnailUrl={thumbnailUrl}
		/>
	)
}

export interface ViewProps {
	title: string
	recordLink: string
	searchTerms: string[]
	record: Record
	fields: any
	database: string
	thumbnailUrl: string
}

// Helper function to extract thumbnail URL
function getThumbnailUrl(record: Record): string {
	const thumbnail =
		record.media && Array.isArray(record.media.im_access_link) && record.media.im_access_link.length > 0 && record.media.im_access_link[0]

	if (!thumbnail) {
		return 'https://placehold.co/250x250'
	}

	return thumbnail.includes('[MEDIA]') ? thumbnail.replace('[MEDIA]', '/media/') : thumbnail
}

export default SummaryRecords
