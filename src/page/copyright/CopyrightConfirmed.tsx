import { Button } from '../../components/ui/button'
import { CircleCheck, Copy } from 'lucide-react'
import Layout from '@/components/layouts'
import Link from '@/components/common/Link'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'

const CopyrightConfirmed = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const { config } = useConstants()
	const { navigations } = config
	let copyrightData = records[0].copyright
	console.log(copyrightData)

	return (
		<Layout>
			<section>
				<div className="bg-gray-50 min-h-screen py-10">
					<div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
						{/* Header */}
						<div className="flex justify-between items-center border-b pb-4">
							<h1 className="flex items-center text-xl font-bold">
								<CircleCheck className="mr-2 text-green-500" />
								Copyright Confirmed
							</h1>
						</div>
						<div className="py-4 [&_p]:my-4 [&_b]:text-lg [&_b]:underline">
							<h1 className="text-lg font-bold">Thank you for your request!</h1>
							<p>Your information has been submitted.</p>
							<p>Please give us 24 hours to reply back to your inquiry.</p>
							<p>Check your profile to stay updated with replies and/or comment from the staff.</p>
						</div>
						<div>
							<div className="border p-4 rounded">
								<div className="flex flex-row items-center">
									<Copy className="mr-2" />
									<h1 className="text-xl font-bold">Request Order Number: {copyrightData.req_order_num}</h1>
								</div>

								<p className="text-lg font-bold mt-4">{copyrightData.req_title}</p>
								<p className="text-sm text-gray-600">{copyrightData.req_topic}</p>
								<p className="text-md my-2">{copyrightData.req_topic_gl}</p>
								<p className="text-md mt-4">{copyrightData.req_patron_name}</p>
								<p className="text-md">{copyrightData.req_patron_email}</p>
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

export default CopyrightConfirmed
