import { Button } from '../../components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CircleEllipsis } from 'lucide-react'
import { convertXMLToJson, getPatronID, getLanguageID } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '@/components/layouts'

const CopyrightForm = () => {
	const [data, setData] = useState([])
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [title, setTitle] = useState('')
	const [itemid, setItemID] = useState('')
	const [dbname, setDbName] = useState('')
	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search)
		const title = queryParams.get('title')
		const itemid = queryParams.get('itemid')
		const dbname = queryParams.get('dbname')
		if (title) setTitle(title)
		if (itemid) setItemID(itemid)
		if (dbname) setDbName(dbname)

		const fetchData = async () => {
			try {
				const response = await axios.get(
					`/scripts/mwimain.dll/${getLanguageID()}/PATRON/WEB_CLIENT/PATRON_ID%20${getPatronID()}?COMMANDSEARCH`,
					{ headers: { 'Content-Type': 'text/xml' } }
				)
				let responseXMLToJson = convertXMLToJson(response.data)
				console.log(responseXMLToJson)
				setData(responseXMLToJson)
				setLastName(responseXMLToJson.client.name_last)
				setFirstName(responseXMLToJson.client.name_first)
				setFullName(responseXMLToJson.client.name_full)
				setEmail(responseXMLToJson.client.email)
			} catch (err) {
				console.error('Error fetching data:', err)
			}
		}

		fetchData()
	}, [])

	const formActionSaveRecord = document.querySelector('#enq-save-record')?.textContent as string
	const skipNStopRecord = document.querySelector('#enq-skip-n-stop-record')?.textContent as string

	const handleGoBack = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		window.history.back()
	}

	return (
		<Layout>
			<section>
				<div className="bg-gray-50 min-h-screen py-10">
					<div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
						{/* Header */}
						<div className="flex justify-between items-center border-b pb-4">
							<h1 className="flex items-center text-xl font-bold">
								<CircleEllipsis className="mr-2" />
								Submit Copyright
							</h1>
						</div>
						<div className="py-4">
							<form method="post" className="m-0" action={`${formActionSaveRecord}&RETURN_URL=[OPAC_COPYRIGHT]copyrightconfirmed.html`}>
								<Input type="hidden" name="METHOD_REQUEST" className="w-full p-2 border rounded mb-4" value="Web" readOnly />
								<Input type="hidden" name="REQ_PATRON_ID" className="w-full p-2 border rounded mb-4" value={getPatronID()} readOnly />
								<Input type="hidden" name="REQ_TITLE" className="w-full p-2 border rounded mb-4" value={title} readOnly />
								<div className="px-4 rounded grid grid-cols-1 gap-4">
									<div className="">
										<Label htmlFor="firstName" className="block text-sm font-semibold mb-1">
											Full Name*
										</Label>
										<Input
											id="firstName"
											type="text"
											className="w-full p-2 border rounded mb-4"
											name="REQ_PATRON_NAME"
											value={fullName}
											readOnly
										/>
									</div>
								</div>
								<div className="px-4 rounded grid grid-cols-2 gap-4">
									<div className="">
										<Label htmlFor="firstName" className="block text-sm font-semibold mb-1">
											Email*
										</Label>
										<Input
											id="firstName"
											type="text"
											className="w-full p-2 border rounded mb-4"
											name="REQ_PATRON_EMAIL"
											value={email}
											readOnly
										/>
									</div>
									<div className="">
										<Label htmlFor="reqAffiliation" className="block text-sm font-semibold mb-1">
											Affliation*
										</Label>
										<Input
											id="reqAffiliation"
											type="text"
											name="REQ_AFFILIATE"
											title="Affiliation"
											className="w-full p-2 border rounded"
											value="Affiliation"
											readOnly
										/>
									</div>
								</div>
								<div className="px-4 rounded grid grid-cols-2 gap-4">
									<div className="">
										<Label htmlFor="itemID" className="block text-sm font-semibold mb-1">
											Item ID*
										</Label>
										<Input
											id="itemID"
											type="text"
											className="w-full p-2 border rounded mb-4"
											name="REQ_ITEM_ID"
											value={itemid}
											readOnly
										/>
									</div>
									<div className="">
										<Label htmlFor="dbname" className="block text-sm font-semibold mb-1">
											Item Source*
										</Label>
										<Input
											id="dbname"
											type="text"
											name="REQ_DB_NAME"
											title="Item Source"
											className="w-full p-2 border rounded"
											value={dbname}
											readOnly
										/>
									</div>
								</div>
								<div className="px-4 rounded grid grid-cols-2 gap-4">
									<div className="">
										<Label htmlFor="reqTopic" className="block text-sm font-semibold mb-1">
											Topic*
										</Label>
										<Input
											id="reqTopic"
											type="text"
											name="REQ_TOPIC"
											title="Topic"
											className="w-full p-2 border rounded mb-4"
											value="Copyright Services"
											readOnly
										/>
									</div>
									<div className="">
										<Label htmlFor="reqType" className="block text-sm font-semibold mb-1">
											Reproduction Type*
										</Label>
										<Select name="REQ_REPRO_TYPE" required defaultValue='Digital Copy up to 18" x 25"'>
											<SelectTrigger className="w-full p-2 border rounded text-left">
												<SelectValue placeholder={'Digital Copy up to 18" x 25"'} />
											</SelectTrigger>
											<SelectContent className="bg-white border rounded shadow-md">
												<SelectItem value='Digital Copy up to 18" x 25"' className="p-2 hover:bg-gray-100">
													Digital Copy up to 18" x 25"
												</SelectItem>
												<SelectItem value='Digital Copy up to 18" x 56"' className="p-2 hover:bg-gray-100">
													Digital Copy up to 18" x 56"
												</SelectItem>
												<SelectItem value="Hi-Resolution Copy" className="p-2 hover:bg-gray-100">
													Hi-Resolution Copy
												</SelectItem>
												<SelectItem value="Sound & Moving Images" className="p-2 hover:bg-gray-100">
													Sound & Moving Images
												</SelectItem>
												<SelectItem value='Print up to 11" x 17"' className="p-2 hover:bg-gray-100">
													Print up to 11" x 17"
												</SelectItem>
												<SelectItem value='Print up to 11" x 36"' className="p-2 hover:bg-gray-100">
													Print up to 11" x 36"
												</SelectItem>
												<SelectItem value="Certified Copies" className="p-2 hover:bg-gray-100">
													Certified Copies
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="px-4 py-2 rounded grid grid-cols-1 gap-4">
									<div className="flex items-center">
										<Label htmlFor="firstName" className="text-sm font-semibold mr-1">
											Rush
										</Label>
										<Checkbox id="firstName" className="rounded" name="REQ_RUSH" value={'X'} />
									</div>
								</div>
								<div className="px-4 rounded grid grid-cols-1 mt-4">
									<Label htmlFor="reqDetail" className="block text-sm font-semibold mb-1">
										Additional Information*
									</Label>
									<Textarea id="reqDetail" name="REQ_TOPIC_GL" title="Leave a comment here" maxLength={5000} required></Textarea>
								</div>
								<div className="px-4 pt-4 mt-4 rounded border-t">
									<Button className="bg-primary rounded mr-1 hover:bg-primary" type="submit" variant="default">
										Submit Copyright
									</Button>
									<Button
										className="bg-primary rounded ml-1 hover:bg-primary"
										type="submit"
										variant="default"
										onClick={handleGoBack}>
										Cancel Copyright
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default CopyrightForm
