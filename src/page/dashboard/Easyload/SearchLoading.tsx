import { Skeleton } from '@/components/ui/skeleton'

function LoadingSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<div key={i} className="bg-white rounded-lg shadow-sm p-4 space-y-4">
					{/* Image placeholder */}
					<Skeleton className="w-full aspect-square rounded-md" />

					{/* Filename */}
					<Skeleton className="h-6 w-3/4" />

					{/* Created by */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-4 w-1/3" />
					</div>

					{/* ID */}
					<Skeleton className="h-4 w-full" />

					{/* Download button */}
					<Skeleton className="h-8 w-32" />
				</div>
			))}
		</div>
	)
}

const SearchLoading = () => {
	return <LoadingSkeleton />
}

export default SearchLoading
