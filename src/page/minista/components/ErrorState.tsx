import { ExternalLink } from 'lucide-react'

export function ErrorState() {
	return (
		<div className="flex flex-col items-center justify-center p-8">
			<div className="text-red-500 mb-2">
				<ExternalLink className="w-8 h-8" />
			</div>
			<p className="text-gray-500">Failed to load asset details</p>
		</div>
	)
}
