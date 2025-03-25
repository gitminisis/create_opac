import DataWithLabel from '@/components/common/DataWithLabel'
import { HighlightText } from '@/components/common/HighlightText'
import InfoCard from '@/components/common/InfoCard'
import { getFieldsFromRecord, truncateString } from '@/lib/record'
import { ReactNode } from 'react'
import { RecordAction } from './RecordAction'
import Link from '@/components/common/Link'
import { ViewProps } from './SummaryRecord'
import { cn, getClassName } from '@/lib/utils'

const GridView = ({
	title,
	recordLink,
	searchTerms,
	record,
	fields,
	database,
	thumbnailUrl,
}: ViewProps) => {
	// Get grid fields
	const gridFields = getFieldsFromRecord(
		record,
		fields,
		(item) => item.grid === true,
		(data, item) => (
			<DataWithLabel
				key={item.name}
				label={item.label || ''}
				items={data}
				searchTerms={searchTerms}
			/>
		)
	) as ReactNode

	return (
		<InfoCard
			className={cn(getClassName(database, 'border'), 'border-2')}
			title={
				<Link href={recordLink}>
					<HighlightText text={truncateString(title)} highlights={searchTerms} />
				</Link>
			}
			description={gridFields}
			thumbnail={thumbnailUrl}
			footer={
				<div className="flex h-4 items-center space-x-4 w-full justify-center">
					<RecordAction record={record} />
				</div>
			}
		/>
	)
}

export default GridView
