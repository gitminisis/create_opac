import Hero from '@/components/common/Hero'
import SearchForm from '@/components/common/SearchForm'
import Layout from '@/components/layouts'
import useConstants from '@/hooks/useConstants'

const NoBookmarkRecord = () => {
	const { home, message } = useConstants()
	const { heading, heroBanner } = home
	return (
		<Layout>
			<Hero
				className=""
				title={message.noBookmark}
				backgroundImage={heroBanner}
				description="">
				<SearchForm className="w-full mt-6 max-w-2xl" inputName={'KEYWORD_CLUSTER'} />
			</Hero>
		</Layout>
	)
}

export default NoBookmarkRecord
