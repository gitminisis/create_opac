import Link from '@/components/common/Link'
import Layout from '@/components/layouts'
import useConstants from '@/hooks/useConstants'
import { SearchX, HomeIcon as House, Archive, Landmark, Library } from 'lucide-react'

const NoRecord = () => {
	const { message } = useConstants()
	const minisisRedirect = '/scripts/mwimain.dll?logon&application=UNION_VIEW&language=144&file=[OPAC]'
	const linkRoute = [
		{
			label: 'Home',
			icon: <House />,
			link: '/',
		},
		{
			label: 'Archives',
			icon: <Archive />,
			link: minisisRedirect + 'archives.html',
		},
		{
			label: 'Museum',
			icon: <Landmark />,
			link: minisisRedirect + 'museum.html',
		},
		{
			label: 'Library',
			icon: <Library />,
			link: minisisRedirect + 'library.html',
		},
	]

	return (
		<Layout>
			<div className="flex h-screen flex-col bg-white">
				<div className="flex flex-1 items-center justify-center">
					<div className="mx-auto max-w-xl px-4 py-8 text-center">
						{/* Icon */}
						<div className="mb-6">
							<SearchX className="w-16 h-16 text-gray-400 mx-auto" />
						</div>

						{/* Heading */}
						<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">{message.noResultFound}</h1>

						{/* Description */}
						<div className="text-gray-500 mb-8 max-w-md mx-auto">
							<p className="mb-1">We've searched through our collections and we did not find any records for your search.</p>
						</div>

						{/* Navigation Links */}
						<div className="flex flex-wrap gap-3 justify-center">
							{linkRoute.map((route, index) => (
								<Link
									key={index}
									href={route.link}
									className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium no-underline ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-28">
									{route.icon} {route.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default NoRecord
