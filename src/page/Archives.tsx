import AdvanceSearchButton from '@/components/common/advanced-search/AdvancedSearchButton'
import AdvancedSearchForm from '@/components/common/advanced-search/AdvancedSearchForm'
import InterativeMap from '@/components/common/interactive-map'
import HomeSearchForm from '@/components/common/search-form/HomeSearchForm'
import Section from '@/components/common/Section'
import Categories from '@/components/features/Categories'
import FeaturedCollection from '@/components/features/FeaturedCollection'
import RSVPCalendar from '@/components/features/RSVPCalendar'
import useConstants from '@/hooks/useConstants'
import { getSearchURL } from '@/lib/utils'
import { useState } from 'react'
import Hero from '../components/common/Hero'
import Layout from '../components/layouts'
import { MainPageProps, UNION_SEARCH_CL } from './Home'
import TimeLine from '@/components/common/interactive-timeline'
import Indexes from '@/components/features/Indexes'

const Archives = ({ previewMode = false, previewData }: MainPageProps) => {
	const [showAdvSearch, setShowAdvSearch] = useState(false)
	const { message } = useConstants()
	const { heroBanner, searchURL, heading, database_name, enableFeaturedCollection, enableCategoriesItems, enableRSVP, enableMap, enableTimeline } =
		useConstants().archives
	return (
		<Layout>
			<Hero className={''} title={heading} backgroundImage={heroBanner} description="">
				<div className={'w-full mx-auto flex space-x-4 justify-center mt-6 max-w-2xl'}>
					<HomeSearchForm
						inputName={UNION_SEARCH_CL}
						action={getSearchURL(searchURL)}
						append={<AdvanceSearchButton setShowAdvSearch={setShowAdvSearch} />}
					/>
				</div>
			</Hero>
			{showAdvSearch && <AdvancedSearchForm search_database={database_name} url={getSearchURL(searchURL)} />}
			{enableFeaturedCollection && <FeaturedCollection page={'archives'} previewData={previewData} previewMode={previewMode} />}
			<Indexes />

			{enableCategoriesItems && <Categories page={'archives'} previewData={previewData} previewMode={previewMode} />}

			{enableRSVP && <RSVPCalendar page={'archives'} previewData={previewData} previewMode={previewMode} />}
			{enableMap && (
				<Section heading={`${message.map}`}>
					<InterativeMap page={'archives'} />
				</Section>
			)}
			{enableTimeline && (
				<Section heading={`${message.timeline}`}>
					<TimeLine page={'archives'} />
				</Section>
			)}
		</Layout>
	)
}
export default Archives
