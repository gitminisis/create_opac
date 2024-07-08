import Hero from '@/components/common/Hero'
import SearchForm from '@/components/common/SearchForm'
import Layout from '@/components/layouts'
import useConstants from '@/hooks/useConstants'
import React from 'react'

const NoRecord = () => {
	const { home } = useConstants()
	const { heading, heroBanner } = home
	return (
		<Layout>
			<Hero className="" title={heading} backgroundImage={heroBanner} description="">
				<SearchForm className="w-full mt-6 max-w-2xl" inputName={'KEYWORD_CLUSTER'} />

				{/* <CommandDemo /> */}
			</Hero>
			<div className="flex h-screen flex-col bg-white">
				<div className="flex flex-1 items-center justify-center">
					<div className="mx-auto max-w-xl px-4 py-8 text-center">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
							No Records Found
						</h1>

						<p className="mt-4 text-gray-500">
							Try searching again, or return home to start from the beginning.
						</p>

						<a
							href="/"
							className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring">
							Go Back Home
						</a>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default NoRecord
