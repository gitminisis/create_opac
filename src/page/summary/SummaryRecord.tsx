import DataWithLabel from '@/components/common/DataWithLabel'
import DetailInfoCard from '@/components/common/DetailInfoCard'
import InfoCard from '@/components/common/InfoCard'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import useJSONData from '@/hooks/useJSONData'
import {
	getFieldDataByLabel,
	deepSearchKey,
	truncateString,
	copyRecordURL,
	getFieldsFromRecord,
} from '@/lib/record'
import { cn } from '@/lib/utils'
import { viewAtom } from '@/store'
import { Separator } from '@/components/ui/separator'
import { ToastAction } from '@radix-ui/react-toast'
import { useAtom } from 'jotai'
import { Heart, Copy, Mail } from 'lucide-react'
import { useState } from 'react'
import Link from '@/components/common/Link'
import { Record } from '@/types/record'
import { SummarySample } from '@/samples'
import useConstants from '@/hooks/useConstants'

const SummaryRecords = () => {
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
	const [view] = useAtom(viewAtom)
	const fields = useConstants().fields
	const database = record.database_name
	const recordLink = record.record_link
	const title = getFieldDataByLabel(record, fields, database, 'Title') || 'Untitled'
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
		() => true,
		(data, item) => (
			<DataWithLabel
				className="flex-col items-start justify-start my-1 space-x-0"
				key={item.name}
				label={item.label || ''}
				items={data}
			/>
		)
	) as React.ReactNode

	if (view === 'grid') {
		return (
			<InfoCard
				className="border-primary"
				title={<Link href={recordLink}>{truncateString(title)}</Link>}
				description={gridFields}
				thumbnail={thumbnail || 'https://placehold.co/250x250'}
				footer={
					<div className="flex h-4 items-center space-x-4 w-full justify-center ">
						<RecordAction record={record} />
					</div>
				}
			/>
		)
	}

	return (
		<DetailInfoCard
			title={<Link href={recordLink}>{title}</Link>}
			className="col-span-3 border-primary"
			thumbnail={thumbnail || 'https://placehold.co/250x250'}
			footer={
				<div>
					<Separator />
					<div className="flex h-12 items-center space-x-4 w-full justify-evenly ">
						<RecordAction record={record} />
					</div>
				</div>
			}>
			<div className="mt-4">{listFields}</div>
		</DetailInfoCard>
	)
}

const RecordAction = ({ record }: { record: Record }) => {
	const [like, setLike] = useState(false)
	const { toast } = useToast()
	const sisn = deepSearchKey(record, 'sisn')[0] as string
	const database = record.database_name

	const { message } = useConstants()

	return (
		<>
			{/* <Button
				variant="ghost"
				size="icon"
				onClick={() => {
					setLike(true)
					toast({
						title: like
							? 'This record has already been marked'
							: 'Record has been bookmarked',
						action: <ToastAction altText="View bookmark">View bookmark</ToastAction>,
					})
				}}>
				<Heart
					className={cn('h-4 w-4 text-primary')}
					fill={like ? 'hsl(var(--opac-blue))' : 'rgb(0,0,0,0)'}
					stroke={like ? 'hsl(var(--opac-blue))' : 'hsl(var(--primary'}
				/>
			</Button> */}
			{/* <Separator orientation="vertical" /> */}
			<Button
				variant="ghost"
				size="icon"
				onClick={() => {
					copyRecordURL(database, sisn)
					toast({
						title: message.recordIsCopied,
					})
				}}>
				<Copy className="h-4 w-4 text-primary" />
			</Button>
			{/* <Separator orientation="vertical" /> */}
			{/* <Button variant="ghost" size="icon">
				<Mail className="h-4 w-4 text-primary" />
			</Button> */}
		</>
	)
}
export default SummaryRecords
