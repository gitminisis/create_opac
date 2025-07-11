'use client'
import { BookOpen, Clock, Truck, FileText, DollarSign, Bookmark, Search, HelpCircle, Home, X } from 'lucide-react'

// Menu items for the library dashboard
const menuItems = [
	{
		title: 'Dashboard Home',
		url: '#',
		icon: Home,
		isActive: true,
	},
	{
		title: 'Checked Out',
		url: '#',
		icon: BookOpen,
	},
	{
		title: 'On Hold',
		url: '#',
		icon: Clock,
	},
	{
		title: 'In Transit',
		url: '#',
		icon: Truck,
	},
	{
		title: 'On Request',
		url: '#',
		icon: FileText,
	},
	{
		title: 'Fees',
		url: '#',
		icon: DollarSign,
	},
	{
		title: 'Bookmark',
		url: '#',
		icon: Bookmark,
	},
	{
		title: 'Search',
		url: '#',
		icon: Search,
	},
	{
		title: 'Help',
		url: '#',
		icon: HelpCircle,
	},
]

interface CustomSidebarProps {
	isOpen: boolean
	onToggle: () => void
}

export function CustomSidebar({ isOpen, onToggle }: CustomSidebarProps) {
	return (
		<>
			{/* Mobile overlay - only show on mobile when sidebar is open */}
			{isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />}

			{/* Sidebar - Always visible on desktop, collapsible on mobile */}
			<div
				className={`
        fixed top-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        lg:relative lg:translate-x-0 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-200">
					<div className="flex items-center gap-2">
						<BookOpen className="h-6 w-6 text-blue-600" />
						<span className="font-semibold text-lg text-gray-900">Library Portal</span>
					</div>
					{/* Close button only visible on mobile */}
					<button onClick={onToggle} className="lg:hidden p-1 rounded-md hover:bg-gray-100">
						<X className="h-5 w-5 text-gray-500" />
					</button>
				</div>

				{/* Navigation */}
				<nav className="p-4">
					<ul className="space-y-2">
						{menuItems.map((item) => (
							<li key={item.title}>
								<a
									href={item.url}
									className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${item.isActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                  `}>
									<item.icon className="h-4 w-4" />
									<span>{item.title}</span>
								</a>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</>
	)
}
