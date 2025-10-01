import { Button } from '@/components/ui/button'

interface EmptyStateProps {
	query?: string
	onReset?: () => void
}

export function EmptyState({ query, onReset }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
			<div className="max-w-[300px] space-y-6">
				<img
					src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/undraw_searching_no1g-4NMAJAqHSrA58s11HhNXhoK4msD13j.svg"
					alt="No results illustration"
					width={250}
					height={200}
					className="mx-auto"
				/>

				<div className="space-y-2">
					<h3 className="text-xl font-semibold tracking-tight">{query ? 'No matches found' : 'No results'}</h3>
					<p className="text-sm text-muted-foreground">
						{query ? (
							<>
								No matches found for "<span className="font-medium text-foreground">{query}</span>". Try adjusting your search term.
							</>
						) : (
							'Try searching for something else.'
						)}
					</p>
				</div>

				{onReset && (
					<Button variant="outline" onClick={onReset} className="mx-auto">
						Clear search
					</Button>
				)}
			</div>
		</div>
	)
}
