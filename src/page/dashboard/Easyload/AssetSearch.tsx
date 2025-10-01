import { Input } from '@/components/ui/input'
import { useAuth } from '@/providers/EasyloadAuthProvider'
import { useMutation } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axios } from '@/lib/axios'
import SearchLoading from './SearchLoading'
import { EmptySearch } from './EmptySearch'
interface Asset {
	id: string
	name: string
	createdBy: string
	createdOn: string
	link: string
	thumbnail: string
}
interface SearchResponse {
	status: string
	message: string
	// Add your response type here
	data: Asset[] // Replace 'any' with your actual response type
}

interface SearchError {
	message: string
}
const AssetSearch = () => {
	const { authToken, user } = useAuth()
	const [searchTerm, setSearchTerm] = useState('')
	const [lastSearchTerm, setLastSearchTerm] = useState('')

	// Mutation to send the search request
	const { mutate, data, isPending, reset } = useMutation<SearchResponse, SearchError, string>({
		mutationFn: async (term) => {
			const response = await axios.post(
				'/easyload/search',
				{
					query: term,
					token: authToken,
					tenant: user,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)

			if (!response.data) {
				throw new Error('Search request failed')
			}

			return response.data
		},
	})

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && searchTerm.trim()) {
			mutate(searchTerm.trim())
			setLastSearchTerm(searchTerm.trim())
		}
	}

	return (
		<div className="relative">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					disabled={!authToken}
					placeholder="Search by phrase or use * for all"
					className="pl-9 pr-4 py-2 w-full bg-muted"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
			</div>

			{isPending && <SearchLoading />}
			{!isPending && data?.data && data.data.length > 0 && <AssetGrid assets={data.data} />}
			{!isPending && data?.data && data.data.length === 0 && lastSearchTerm.trim() !== '' && (
				<EmptySearch
					query={lastSearchTerm}
					onReset={() => {
						reset()
						setSearchTerm('')
						setLastSearchTerm('')
					}}
				/>
			)}
		</div>
	)
}

function AssetGrid({ assets }: { assets: Asset[] }) {
	return (
		<div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
			{assets.map((asset) => (
				<Card key={asset.id} className="overflow-hidden">
					<div className="aspect-video relative">
						<a href={asset.link} target="_blank" rel="noopener noreferrer" className="block aspect-video relative">
							<img
								src={asset.thumbnail || '/placeholder.svg'}
								alt={asset.name}
								className="object-cover transition-opacity duration-300 hover:opacity-80"
							/>
						</a>
					</div>
					<CardHeader className="space-y-1">
						<CardTitle className="text-base truncate">
							<a href={asset.link} target="_blank" rel="noopener noreferrer">
								{asset.name}
							</a>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 text-sm">
							<div>
								<span className="font-medium">Created by: </span>
								{asset.createdBy}
							</div>
							<div>
								<span className="font-medium">Created on: </span>
								{new Date(asset.createdOn).toLocaleDateString()}
							</div>
							<div className="truncate">
								<span className="font-medium">ID: </span>
								{asset.id}
							</div>
							<a
								href={asset.link}
								className="inline-block mt-2 text-sm text-primary hover:underline"
								target="_blank"
								rel="noopener noreferrer">
								Download Asset
							</a>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}

export default AssetSearch
