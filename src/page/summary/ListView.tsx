import DataWithLabel from '@/components/common/DataWithLabel'
import DetailInfoCard from '@/components/common/DetailInfoCard'
import { HighlightText } from '@/components/common/HighlightText'
import Link from '@/components/common/Link'
import { Separator } from '@/components/ui/separator'
import { getFieldsFromRecord } from '@/lib/record'
import { cn, getClassName } from '@/lib/utils'
import { ReactNode } from 'react'
import { RecordAction } from './RecordAction'
import { ViewProps } from './SummaryRecord'

const ListView = ({
	title,
	recordLink,
	searchTerms,
	record,
	fields,
	database,
	thumbnailUrl,
}: ViewProps) => {
	// Get list fields
	const listFields = getFieldsFromRecord(
		record,
		fields,
		(item) => item.summary === true,
		(data, item) => (
			<DataWithLabel
				className={`flex-col items-start justify-start my-1 space-x-0 ${
					item.name === 'obj_description' ? 'w-full' : 'w-[50%]'
				}`}
				key={item.name}
				label={item.label || ''}
				items={data}
				searchTerms={searchTerms}
			/>
		)
	) as ReactNode

	return (
		<DetailInfoCard
			record={record}
			title={
				<Link href={recordLink}>
					<HighlightText text={title} highlights={searchTerms} />
				</Link>
			}
			className={cn(getClassName(database, 'border'), 'border-2 rounded-md')}
			thumbnail={thumbnailUrl}
			footer={
				<div>
					<Separator />
					<div className="flex h-12 items-center space-x-4 w-full justify-evenly">
						<RecordAction record={record} />
					</div>
				</div>
			}>
			<div className="mt-4 flex justify-between flex-wrap">{listFields}</div>
		</DetailInfoCard>
	)
}

export default ListView
