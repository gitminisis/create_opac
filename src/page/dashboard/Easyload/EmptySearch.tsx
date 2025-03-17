import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptySearchProps {
	query: string
	onReset: () => void
}

export function EmptySearch({ query, onReset }: EmptySearchProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
			<div className="flex flex-col items-center gap-4">
				<div className="rounded-full bg-muted p-4">
					<SearchX className="h-8 w-8 text-muted-foreground" />
				</div>
				<div className="space-y-2">
					<h3 className="text-lg font-semibold">No results found</h3>
					<p className="text-sm text-muted-foreground max-w-[300px]">
						No results found for "
						<span className="font-medium text-foreground">{query}</span>". Please try a
						different search term.
					</p>
				</div>
				<Button onClick={onReset} variant="outline" className="mt-2">
					Clear search
				</Button>
			</div>
		</div>
	)
}
