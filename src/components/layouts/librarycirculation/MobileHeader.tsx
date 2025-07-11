'use client'

import { Menu } from 'lucide-react'

interface MobileHeaderProps {
	onMenuToggle: () => void
}

export function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
	return (
		<header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
			<div className="flex items-center justify-between">
				<button onClick={onMenuToggle} className="p-2 rounded-md hover:bg-gray-100">
					<Menu className="h-5 w-5 text-gray-600" />
				</button>
				<h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
				<div className="w-9" /> {/* Spacer for centering */}
			</div>
		</header>
	)
}
