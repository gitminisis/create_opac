import Hero from '@/components/common/Hero'
import HomeSearchForm from '@/components/common/search-form/HomeSearchForm'
import Layout from '@/components/layouts'
import useConstants from '@/hooks/useConstants'
import { getSearchURL } from '@/lib/utils'
import { UNION_SEARCH_CL } from './Home'

const NoSession = () => {
	const { home, message } = useConstants()
	const { heroBanner, searchURL } = home
	return (
		<Layout>
			<Hero className="" title={message.noResultFound} backgroundImage={heroBanner} description="">
				<div className={'w-full mx-auto flex space-x-4 justify-center mt-6 max-w-2xl'}>
					<HomeSearchForm title={message.searchAllCollections} inputName={UNION_SEARCH_CL} action={getSearchURL(searchURL)} />
				</div>
			</Hero>
		</Layout>
	)
}

export default NoSession
