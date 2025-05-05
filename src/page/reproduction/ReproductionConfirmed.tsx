import { Button } from '../../components/ui/button'
import { CircleCheck, Copy } from 'lucide-react'
import Layout from '@/components/layouts'
import Link from '@/components/common/Link'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'

const ReproductionConfirmed = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const { config } = useConstants()
	const { navigations } = config
	let reprodData = records[0].reproduction
	const message = useConstants().message

	return (
		<Layout>
			<section>
				<div className="bg-gray-50 min-h-screen py-10">
					<div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
						{/* Header */}
						<div className="flex justify-between items-center border-b pb-4">
							<h1 className="flex items-center text-xl font-bold">
								<CircleCheck className="mr-2 text-green-500" />
								{message.reproductionConfirmed}
							</h1>
						</div>
						<div className="py-4 [&_p]:my-4 [&_b]:text-lg [&_b]:underline">
							<h1 className="text-lg font-bold">{message.thankYouTitle}</h1>
							<p>{message.infoSubmitted}</p>
							<p>{message.replyTime}</p>
							<p>{message.profileCheck}</p>
						</div>
						<div>
							<div className="border p-4 rounded">
								<div className="flex flex-row items-center">
									<Copy className="mr-2" />
									<h1 className="text-xl font-bold">
										{message.requestOrderNumber}: {reprodData.req_order_num}
									</h1>
								</div>

								<p className="text-lg font-bold mt-4">{reprodData.req_title}</p>
								<p className="text-sm text-gray-600">{reprodData.req_topic}</p>
								<p className="text-md my-2">{reprodData.req_topic_gl}</p>
								<p className="text-md mt-4">{reprodData.req_patron_name}</p>
								<p className="text-md">{reprodData.req_patron_email}</p>
							</div>
						</div>
						<div className="border-t mt-6">
							<div className="flex items-center pt-4">
								{navigations.map((item) => (
									<Link className="mx-1" href={item.url}>
										<Button>{item.title}</Button>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default ReproductionConfirmed
