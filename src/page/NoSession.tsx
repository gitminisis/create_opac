import Hero from '@/components/common/Hero'
import SearchForm from '@/components/common/SearchForm'
import Layout from '@/components/layouts'
import useConstants from '@/hooks/useConstants'

const NoSession = () => {
	const { home, message } = useConstants()
	const { heroBanner } = home
	return (
		<Layout>
			<Hero
				className=""
				title={message.noResultFound}
				backgroundImage={heroBanner}
				description="">
				<SearchForm className="w-full mt-6 max-w-2xl" inputName={'KEYWORD_CLUSTER'} />
			</Hero>
		</Layout>
	)
}

export default NoSession
