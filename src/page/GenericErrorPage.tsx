import Hero from '@/components/common/Hero'
import SearchForm from '@/components/common/search-form/SearchForm'
import Layout from '@/components/layouts'
import useConstants from '@/hooks/useConstants'
import { getSearchURL } from '@/lib/utils'

const GenericErrorPage = () => {
	const { home, message } = useConstants()
	const { heroBanner, searchURL } = home
	return (
		<Layout>
			<Hero
				className=""
				title={message.genericError}
				backgroundImage={heroBanner}
				description="">
				<SearchForm className="w-full mt-6 max-w-2xl" action={getSearchURL(searchURL)} />
			</Hero>
		</Layout>
	)
}

export default GenericErrorPage
