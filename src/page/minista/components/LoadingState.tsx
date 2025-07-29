import { Loader2 } from 'lucide-react'

export function LoadingState() {
	return (
		<div className="flex items-center justify-center h-64">
			<div className="flex flex-col items-center space-y-2">
				<Loader2 className="w-8 h-8 animate-spin text-blue-500" />
				<p className="text-sm text-gray-500">Loading asset details...</p>
			</div>
		</div>
	)
}
