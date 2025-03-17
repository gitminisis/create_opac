import HoverCard from '@/components/common/HoverCard'
import InterativeMap from '@/components/common/interactive-map'
import Masonry from '@/components/common/Masonry'
import HomeSearchForm from '@/components/common/search-form/HomeSearchForm'
import Categories from '@/components/features/Categories'
import FeaturedCollection from '@/components/features/FeaturedCollection'
import useConstants from '@/hooks/useConstants'
import { getSearchURL, truncateWords } from '@/lib/utils'
import Hero from '../components/common/Hero'
import Section from '../components/common/Section'
import RSVPCalendar from '../components/features/RSVPCalendar'
import Layout from '../components/layouts'
import TopPick from '@/components/features/TopPick'
import TimeLine from '@/components/common/interactive-timeline'
import { HighlightText } from '@/components/common/HighlightText'

export const UNION_SEARCH_CL = 'KEYWORD_CLUSTER'

const images = [
	'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
	'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80',
	'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
	'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
	'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80',
	'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
	'https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
	'https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
	'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
	'https://images.unsplash.com/photo-1439853949127-fa647821eba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2640&q=80',
	'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
	'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80',
	'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
	'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
	'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80',
	'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
	'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80',
	'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
	'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
	'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80',
	'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
	'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80',
	'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
	'https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
	'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80',
]

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
	}:any = data
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
					<HomeSearchForm
						title={message.searchAllCollections}
						inputName={UNION_SEARCH_CL}
						action={getSearchURL(searchURL)}
					/>
				</div>
			</Hero>

		

			<TopPick page={'home'} previewData={previewData} previewMode={previewMode} />

			{enableFeaturedCollection && (
				<FeaturedCollection
					page={'home'}
					previewData={previewData}
					previewMode={previewMode}
				/>
			)}
			{enableCategoriesItems && (
				<Categories page={'home'} previewData={previewData} previewMode={previewMode} />
			)}

			{enableRSVP && (
				<RSVPCalendar page={'home'} previewData={previewData} previewMode={previewMode} />
			)}
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
			{enableRecentAddition && (
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
			)}
		</Layout>
	)
}

export default Home
