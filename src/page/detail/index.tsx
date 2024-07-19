import ImageCarousel from '@/components/common/ImageCarousel'
import PageAction from '@/components/common/PageAction'
import SearchForm from '@/components/common/SearchForm'
import Layout from '@/components/layouts'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import DetailRecord from './DetailRecord'

const images = [
	{
		src: 'https://media.britishmuseum.org/media/Repository/Documents/2014_10/6_16/9a192748_4e41_4f04_a2de_a3bc0114cb3f/preview_00433935_001.jpg',
	},
	{
		src: 'https://media.britishmuseum.org/media/Repository/Documents/2014_10/6_16/ae91ce34_b9b4_44a4_9f0e_a3bc011460e8/preview_00433892_001.jpg',
	},
	{
		src: 'https://media.britishmuseum.org/media/Repository/Documents/2014_11/2_1/5bcca073_26c7_4e0f_bb70_a3d7001a1c24/preview_01081548_001.jpg',
	},
	{
		src: 'https://media.britishmuseum.org/media/Repository/Documents/2014_10/11_3/8dc66e9f_43e1_4170_956b_a3c1003d49ec/preview_00595099_001.jpg',
	},
	{
		src: 'https://media.britishmuseum.org/media/Repository/Documents/2014_11/9_19/c4b282ba_d905_4cff_adcb_a3de0144bc78/preview_01466623_001.jpg',
	},
]
const Detail = () => {
	const { backToSummary, records, getMedia } = useJSONData({ selector: '#xml_record' })
	// const { backToSummary, records, getMedia } = useJSONData({ defaultData: DetailM3Sample })
	const images = getMedia(records[0], 'im_access_link')?.map((e) => ({ src: e })) || []

	const { message } = useConstants()
	// TODO: create placeholder component when there is no data
	if (!records || records.length === 0) return <></>
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
					{/* <Button>
						<SlidersHorizontal className="mr-2 h-4 w-4" />
						Advanced Search
					</Button> */}
					<div className="flex w-full flex-row space-x-2 justify-end">
						{/* <Button>
							<SlidersHorizontal className="mr-2 h-4 w-4" />
							Advanced Search
						</Button> */}
						{/* <Separator orientation="vertical" /> */}
						<SearchForm
							className="w-[450px] m-0"
							inputStyle="text-black"
							inputName={'KEYWORD_CLUSTER'}
						/>
					</div>
				</PageAction>
				<section>
					<div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
						<div className="flex flex-col lg:flex-row space-y-12 lg:space-y-0 lg:space-x-8 items-start max-w-6xl p-4 mx-auto ">
							<div className="max-w-[700px]  mx-auto">
								{images && images.length > 0 ? (
									<ImageCarousel
										items={images}
										renderItems={(image) => (
											<img
												alt="test"
												src={image.src}
												className="h-36 mx-auto cursor-pointer object-cover border-4 hover:border-primary"
											/>
										)}
									/>
								) : (
									<span>{message.noMediaFound}</span>
								)}
							</div>
							<div className="w-full lg:w-1/2 grid gap-4 md:gap-10 items-start ">
								<DetailRecord />
							</div>
						</div>
					</div>
				</section>
			</div>
		</Layout>
	)
}

export default Detail
