import Link from '@/components/common/Link'
import Layout from '@/components/layouts'
import useConstants from '@/hooks/useConstants'

const NoRecord = () => {
	const { message } = useConstants()
	return (
		<Layout>
			<div className="flex h-screen flex-col bg-white">
				<div className="flex flex-1 items-center justify-center">
					<div className="mx-auto max-w-xl px-4 py-8 text-center">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
							{message.noResultFound}
						</h1>

						<Link href="/">Go Back Home</Link>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default NoRecord
