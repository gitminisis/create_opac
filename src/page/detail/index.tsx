import ImageCarousel, { ImageProps, VideoProps } from '@/components/common/ImageCarousel'
import PageAction from '@/components/common/PageAction'
import SearchForm from '@/components/common/search-form/SearchForm'
import Layout from '@/components/layouts'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import { getSessionID, isDescriptionDatabase } from '@/lib/utils'
import DetailRecord from './DetailRecord'

import DescriptionTree from '@/components/common/description-tree'
import Accordion from '@/components/ui/simple-accordion'
import { deepSearchKey } from '@/lib/record'
import { getJSONTree, TreeNode } from '@/lib/tree'
import { useEffect, useState } from 'react'
import NavigationSideBar from './NavigationSideBar'
import NoRecord from '../NoRecord'

const Detail = () => {
	const { backToSummary, records, getMedia, common } = useJSONData({ selector: '#xml_record' })
	const record = records[0]
	const images =
		getMedia(records[0], 'im_access_link')?.map((e) => ({
			src: e.includes('[MEDIA]') ? e.replace('[MEDIA]', '/media/') : e,
		})) || []
	const videos: VideoProps[] =
		getMedia(records[0], 'vd_access_link')?.map((e) => ({
			type: 'video',
			width: 1280,
			height: 720,
			sources: [
				{
					src: e.includes('[MEDIA]') ? e.replace('[MEDIA]', '/media/') : e,
					type: 'video/mp4',
				},
			],
		})) || []
	const [openKeyPath, setOpenKeyPath] = useState<string[]>([])
	const { message } = useConstants()
	const refd = deepSearchKey(record, 'refd')[0]
	const database = record.database_name
	const [loading, setLoading] = useState(true)
	const [tree, setTree] = useState<TreeNode | undefined>()
	useEffect(() => {
		const sessionID = getSessionID()
		if (sessionID && isDescriptionDatabase(database)) {
			getJSONTree(sessionID, database, refd)
				.then((res) => {
					if (!res || res.noTree) {
						return
					}
					const { tree, openKeyPath } = res

					setTree(tree)
					console.log({ openKeyPath })

					setOpenKeyPath(openKeyPath)
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [database, refd])

	//If the XML_TREE is not working at the repo spec.
	if (!record.record) return <NoRecord />

	return (
		<Layout>
			<div className="rounded-[0.5rem] border bg-background shadow-md md:shadow-xl h-full flex-col flex w-full my-12">
				<PageAction
					breadcrumbs={[
						{ label: message.home, url: '/' },
						{
							label: `${records[0].database_name === 'SELECTION_LIST' ? message.bookmarkPage : message.summaryPage}`,
							url: backToSummary,
						},
						{
							label: message.detailPage,
							active: true,
							url: '#',
						},
					]}>
					<div className="flex w-full flex-row space-x-2 justify-end">
						<SearchForm
							className="w-[450px] m-0"
							inputStyle="text-black"
							inputName={'KEYWORD_CLUSTER'}
							action={`${common.session}?UNIONSEARCH&SHOWSINGLE=Y&SIMPLE_EXP=Y&ERRMSG=[MESSAGES]no-record.html&REPORT=WEB_UNION_SUM&APPLICATION=UNION_VIEW&DATABASE=${records[0].database_name}`}
						/>
					</div>
				</PageAction>
				<section>
					<div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
						<div className="flex flex-col items-start p-4 mx-auto ">
							<div className="w-full flex gap-12  flex-col lg:flex-row">
								<div className="w-full lg:w-1/3 flex flex-col gap-10">
									<div className="min-w-[300px] w-full max-w-[500px] text-center mx-auto ">
										{images && images.length > 0 ? (
											<ImageCarousel
												items={[...images, ...videos]}
												renderItems={(item) => {
													if (!(item as ImageProps).src) {
														const video = item as VideoProps
														return (
															<img
																alt={'video thumbnail'}
																src={
																	'https://d2uolguxr56s4e.cloudfront.net/img/kartrapages/video_player_placeholder.gif'
																}
																className="h-36 mx-auto cursor-pointer object-cover border-4 hover:border-primary"
															/>
														)
													}

													const image = item as ImageProps
													return (
														<img
															alt={image.src}
															src={image.src}
															className="rounded h-36 mx-auto cursor-pointer object-cover border-4 hover:border-primary bg-gray-300"
														/>
													)
												}}
											/>
										) : (
											<>
												<img
													alt={message.noMediaFound}
													src={'https://placehold.co/250x250'}
													className="h-36 mx-auto cursor-pointer object-cover border-4 hover:border-primary"
												/>
												<span>{message.noMediaFound}</span>
											</>
										)}
									</div>
									<NavigationSideBar />
								</div>

								<div className="w-full lg:w-2/3">
									<div className="w-full flex flex-col gap-6 items-start ">
										<div className="w-full ">
											<DetailRecord />
										</div>

										{isDescriptionDatabase(database) && (
											<div className="w-full ">
												<Accordion
													items={[
														{
															title: message.descriptionTree,
															content: (
																<div className="max-h-[600px] overflow-auto">
																	<DescriptionTree
																		loading={loading}
																		tree={tree}
																		selectedId={openKeyPath[0]}
																	/>
																</div>
															),
														},
													]}
												/>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</Layout>
	)
}

export default Detail
