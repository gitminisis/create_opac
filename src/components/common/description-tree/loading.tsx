export default function TreeSkeleton() {
	return (
		<div className="w-full max-w-3xl mx-auto animate-pulse p-4">
			{/* Root item skeleton */}
			<div className="mb-2">
				<div className="flex items-center gap-1">
					<div className="w-4 h-4 bg-gray-200 rounded" />
					<div className="h-4 w-64 bg-gray-200 rounded" />
				</div>
			</div>

			{/* First level skeleton */}
			<div className="ml-5 mb-2">
				<div className="flex items-center gap-1">
					<div className="w-4 h-4 bg-gray-200 rounded" />
					<div className="h-4 w-56 bg-gray-200 rounded" />
				</div>
			</div>

			{/* Second level items skeleton */}
			<div className="ml-10 space-y-2">
				{[...Array(8)].map((_, i) => (
					<div key={i} className="flex items-center gap-1">
						<div className="h-4 w-72 bg-gray-200 rounded" />
					</div>
				))}
			</div>

			{/* More second level items with decreasing widths */}
			<div className="ml-10 mt-2 space-y-2">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="flex items-center gap-1">
						<div className="h-4 bg-gray-200 rounded" style={{ width: `${Math.max(40, 72 - i * 8)}%` }} />
					</div>
				))}
			</div>
		</div>
	)
}
