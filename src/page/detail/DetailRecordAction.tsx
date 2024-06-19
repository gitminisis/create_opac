import useJSONData from '@/hooks/useJSONData'
import { Button } from '../../components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon, Heart, Link, Printer } from 'lucide-react'
import { copyRecordURL, deepSearchKey } from '@/lib/record'
import { useToast } from '../../components/ui/use-toast'
import { DetailM3Sample } from '@/samples'
import useConstants from '@/hooks/useConstants'

const DetailRecordAction = () => {
	const { toast } = useToast()

	// const { nextRecord, previousRecord, records } = useJSONData({ defaultData: DetailM3Sample })
	const { nextRecord, previousRecord, records } = useJSONData({ selector: '#xml_record' })

	const { message } = useConstants()
	const record = records[0]

	const goToURL = (url: string | null) => {
		if (url) {
			window.location.href = url
		}
	}

	const sisn = deepSearchKey(record, 'sisn')[0] as string
	const database = record.database_name
	return (
		<div className="flex flex-col space-y-4">
			<div className="flex flex-row justify-between space-x-2">
				<Button
					className="align-center"
					disabled={!previousRecord}
					onClick={() => goToURL(previousRecord)}>
					<ArrowLeftIcon />
					<span className="hidden md:block">{message.previous}</span>
				</Button>

				<div className="flex space-x-2">
					{/* <Button className="" variant="outline">
						<Heart className="w-4 h-4 mr-2 hidden md:block" /> {message.save}
					</Button> */}
					<Button
						variant="outline"
						onClick={() => {
							copyRecordURL(database, sisn)
							toast({
								title: 'Record URL is copied',
							})
						}}>
						<Link className="w-4 h-4 mr-2 hidden md:block" /> {message.copy}
					</Button>
					{/* <Button variant="outline">
						<Printer className="w-4 h-4 mr-2 hidden md:block" /> {message.print}
					</Button> */}
				</div>

				<Button
					className="align-center"
					disabled={!nextRecord}
					onClick={() => goToURL(nextRecord)}>
					<span className="hidden md:block">{message.next}</span>
					<ArrowRightIcon />
				</Button>
			</div>
		</div>
	)
}

export default DetailRecordAction
