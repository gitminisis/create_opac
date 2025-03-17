import { Button } from '../../components/ui/button'
import { CircleCheck, Lightbulb } from 'lucide-react'
import Layout from '@/components/layouts'
import Link from '@/components/common/Link'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'

const EnquiryConfirmed = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const { config } = useConstants()
	const { navigations } = config
	let enqData = records[0].enquiry
	console.log(enqData)

	return (
		<Layout>
			<section>
				<div className="bg-gray-50 min-h-screen py-10">
					<div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
						{/* Header */}
						<div className="flex justify-between items-center border-b pb-4">
							<h1 className="flex items-center text-xl font-bold">
								<CircleCheck className="mr-2 text-green-500" />
								Inquiry Confirmed
							</h1>
						</div>
						<div className="py-4 [&_p]:my-4 [&_b]:text-lg [&_b]:underline">
							<h1 className="text-lg font-bold">Thank you for your Inquiry!</h1>
							<p>Please give us 24 hours to reply back to your inquiry.</p>
							<p>
								Check your profile to stay updated with replies and/or comment from
								the staff.
							</p>
						</div>
						<div>
							<div className="border p-4 rounded">
								<div className="flex flex-row items-center">
									<Lightbulb className="mr-2" />
									<h1 className="text-xl font-bold">
										Inquiry Reference Number: {enqData.enq_id}
									</h1>
								</div>

								<p className="text-lg font-bold mt-4">{enqData.enq_title}</p>
								<p className="text-sm text-gray-600">{enqData.enq_topic}</p>
								<p className="text-md my-2">{enqData.enq_topic_detail}</p>
								<p className="text-md mt-4">{enqData.enq_user}</p>
								<p className="text-md">{enqData.enq_patron_email}</p>
								<p className="text-md">{enqData.enq_telephone}</p>
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

export default EnquiryConfirmed
