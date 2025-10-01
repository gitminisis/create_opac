import HoverCard from '@/components/common/HoverCard'
import InterativeMap from '@/components/common/interactive-map'
import TimeLine from '@/components/common/interactive-timeline'
import Masonry from '@/components/common/Masonry'
import HomeSearchForm from '@/components/common/search-form/HomeSearchForm'
import Categories from '@/components/features/Categories'
import FeaturedCollection from '@/components/features/FeaturedCollection'
import TopPick from '@/components/features/TopPick'
import useConstants from '@/hooks/useConstants'
import { getSearchURL, truncateWords } from '@/lib/utils'
import Hero from '../components/common/Hero'
import Section from '../components/common/Section'
import RSVPCalendar from '../components/features/RSVPCalendar'
import Layout from '../components/layouts'
import UniversalViewerEmbed from '@/components/common/iif-viewers'

export const UNION_SEARCH_CL = 'KEYWORD_CLUSTER'



export type MainPageProps = {
	previewMode?: boolean
	previewData?: any
}

export type PageSectionProps = MainPageProps & {
	page: 'home' | 'archives' | 'library' | 'museum'
}
const Home = ({ previewMode = false, previewData }: MainPageProps) => {
	const sourceData = useConstants().home
	const data = previewMode && previewData ? (previewData as typeof sourceData) : sourceData
	const {
		heading,
		heroBanner,
		searchURL,
		enableFeaturedCollection,
		enableRSVP,
		enableCategoriesItems,
		enableRecentAddition,
		enableMap,
		enableTimeline,
	}: any = data
	const { message } = useConstants()
	const mockData = Array.from({ length: 1000 }, (_, index) => ({
		LEGAL_TITLE: `Event ${index + 1}`,
		sisn: `SISN-${index + 1}`,
		TIME_INDEX: (9000 + index).toString(),
		DATE: `Year ${9000 + index - 10000}`,
		ID: `ID-${index + 1}`,
		DATABASE_TYPE: 'Historical',
		IMAG_URL: 'https://via.placeholder.com/150',
	}))
	return (
		<Layout>
			<Hero className="" title={heading} backgroundImage={heroBanner} description="">
				<div className={'w-full mx-auto flex space-x-4 justify-center mt-6 max-w-2xl'}>
					<HomeSearchForm title={message.searchAllCollections} inputName={UNION_SEARCH_CL} action={getSearchURL(searchURL)} />
				</div>
			</Hero>

			<TopPick page={'home'} previewData={previewData} previewMode={previewMode} />

			{enableFeaturedCollection && <FeaturedCollection page={'home'} previewData={previewData} previewMode={previewMode} />}
			{enableCategoriesItems && <Categories page={'home'} previewData={previewData} previewMode={previewMode} />}

			{enableRSVP && <RSVPCalendar page={'home'} previewData={previewData} previewMode={previewMode} />}
			{enableMap && (
				<Section heading={`${message.map}`}>
					<InterativeMap page={'home'} />
				</Section>
			)}
			{enableTimeline && (
				<Section heading={`${message.timeline}`}>
					<TimeLine page={'home'} />
				</Section>
			)}
			{/* {enableRecentAddition && (
				<Section heading="Recent additions">
					<Masonry
						items={images}
						renderItem={(item, index) => (
							<HoverCard
								description="More than 100,000 archival photos, maps, documents, and oral histories, as well as over 5,000 artifacts are at your fingertips. Browse the categories, neighbourhoods, "
								key={index}
								title={truncateWords('Test', 10)}
								thumbnail={item}
								url={''}
							/>
						)}
					/>
				</Section>
			)} */}
		</Layout>
	)
}

export default Home
