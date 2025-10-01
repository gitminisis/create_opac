'use client'

import { AlertCircle, X } from 'lucide-react'

interface NotificationBannerProps {
	message: string
	type: 'info' | 'warning' | 'success'
	onDismiss?: () => void
}

export function NotificationBanner({ message, type, onDismiss }: NotificationBannerProps) {
	const styles = {
		info: 'bg-blue-50 border-blue-200 text-blue-800',
		warning: 'bg-amber-50 border-amber-200 text-amber-800',
		success: 'bg-green-50 border-green-200 text-green-800',
	}

	return (
		<div className={`border rounded-lg p-4 flex items-center justify-between ${styles[type]}`}>
			<div className="flex items-center gap-3">
				<AlertCircle className="h-5 w-5 flex-shrink-0" />
				<span className="text-sm font-medium">{message}</span>
			</div>
			{onDismiss && (
				<button onClick={onDismiss} className="p-1 hover:bg-black hover:bg-opacity-10 rounded">
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	)
}
