import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function SkeletonCard() {
	return (
		<Card>
			<div className="p-4 flex flex-col items-center space-y-4">
				<div className="space-y-1 w-full">
					<Skeleton className="h-4 w-full " />
					<Skeleton className="h-2 w-1/3" />
					<Skeleton className="h-2 w-1/3" />
				</div>
				<Skeleton className="h-36 w-full rounded-lg border" />
			</div>
		</Card>
	)
}
