import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
	title: string
	count: number
	icon: LucideIcon
	color: string
}

export function StatsCard({ title, count, icon: Icon, color }: StatsCardProps) {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
				</div>
				<div className={`p-3 rounded-full ${color}`}>
					<Icon className="h-6 w-6 text-white" />
				</div>
			</div>
		</div>
	)
}
