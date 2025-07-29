import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { ReactNode } from 'react'

interface IntegrationLinkItemProps {
	icon: ReactNode
	title: string
	url: string
	iconBgColor: string
	iconTextColor: string
}

export function IntegrationLinkItem({ icon, title, url, iconBgColor, iconTextColor }: IntegrationLinkItemProps) {
	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(url)
	}

	return (
		<div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
			<div className="flex items-center space-x-3">
				<div className={`p-2 ${iconBgColor} rounded-full`}>
					<div className={iconTextColor}>{icon}</div>
				</div>
				<div>
					<p className="text-sm font-medium">{title}</p>
					<p className="text-xs text-gray-500 truncate max-w-[300px]">{url}</p>
				</div>
			</div>
			<Button variant="ghost" size="sm" className="p-2 h-auto" onClick={handleCopyToClipboard}>
				<Copy className="w-4 h-4" />
			</Button>
		</div>
	)
}
