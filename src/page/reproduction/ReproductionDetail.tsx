import { Button } from '../../components/ui/button'
import { CircleCheck, Copy } from 'lucide-react'
import Layout from '@/components/layouts'
import Link from '@/components/common/Link'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'

const ReproductionDetail = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const { config } = useConstants()
	const { navigations } = config
	const ZERO_AMOUNT = '$0.00'
	let reprodData = records[0].reproductiondetail
	console.log(reprodData)

	return (
		<Layout>
			<section>
				<div className="bg-gray-50 min-h-screen py-10">
					<div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
						{/* Header */}
						<div className="flex justify-between items-center border-b pb-4">
							<h1 className="flex items-center text-xl font-bold">Reproduction Information</h1>
						</div>
						<div>
							<div className="border p-4 rounded">
								<div className="flex flex-row items-center">
									<Copy className="mr-2" />
									<h1 className="text-xl font-bold">Request Order Number: {reprodData.req_order_num}</h1>
								</div>

								<p className="text-lg font-bold mt-4">{reprodData.req_title}</p>
								<p className="text-sm text-gray-600">{reprodData.req_topic}</p>
								<p className="text-md my-2">{reprodData.req_topic_gl}</p>
								<p className="text-md">Charge Amount: {reprodData.req_charge_amt ? reprodData.req_charge_amt : ZERO_AMOUNT}</p>
								<p className="text-md">
									Tax {reprodData.req_tax_percent ? '(' + reprodData.req_tax_percent + ')' : '(0%)'}:{' '}
									{reprodData.req_tax ? reprodData.req_tax : ZERO_AMOUNT}
								</p>
								<p className="text-md">Handling: {reprodData.req_handling ? reprodData.req_handling : ZERO_AMOUNT}</p>
								<p className="text-md">Total Amount: {reprodData.req_paid_amt}</p>
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

export default ReproductionDetail
