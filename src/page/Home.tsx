import useConstants from '@/hooks/useConstants'
import Hero from '../components/common/Hero'
import SearchForm from '../components/common/SearchForm'
import Section from '../components/common/Section'
import Slide from '../components/common/Slide'
import ThumbnailCard from '../components/common/ThumbnailCard'
import Layout from '../components/layouts'
import { Card } from '../components/ui/card'
import EventCalendar from '@/components/common/event-calendar/EventCalendar'

const Home = () => {
	const {
		heading,
		heroBanner,
		browseByCategoryTitle,
		categoriesItems,
		searchURL,
		// eventCalendar,
	} = useConstants().home

	return (
		<Layout>
			<Hero className="" title={heading} backgroundImage={heroBanner} description="">
				<SearchForm
					className="w-full mt-6 max-w-2xl"
					searchURL={searchURL}
					inputName={'KEYWORD_CLUSTER'}
				/>

				{/* <CommandDemo /> */}
			</Hero>

			<Section heading={browseByCategoryTitle}>
				<Slide
					// auto
					itemsPerSlide={{ lg: 4 }}
					items={categoriesItems}
					renderItem={(item: { title: any; url: any; thumbnail: any }, index: any) => (
						<Card
							className="max-w-md mx-auto shadow-xl border-none cursor-pointer"
							key={index}>
							<ThumbnailCard
								title={item.title}
								url={item.url}
								thumbnail={item.thumbnail}
							/>
						</Card>
					)}
				/>
			</Section>
			{/* <Section heading={eventCalendar}>
				<EventCalendar />
			</Section> */}
			{/* <Section
        className='bg-secondary'
        heading={'Browse by area'}
        subHeading='Area Category'
      >
        <Map />
      </Section> */}
			{/* <Section heading={'Recent Addition'}>
				<Masonry
					items={pics}
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
			</Section> */}
		</Layout>
	)
}

export default Home
