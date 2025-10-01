'use client'

import { useState, useRef, useEffect } from 'react'
import { User, Settings, ChevronDown } from 'lucide-react'

interface DesktopHeaderProps {
	userName: string
}

export function DesktopHeader({ userName }: DesktopHeaderProps) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}

	const handleMenuClick = (action: string) => {
		console.log(`${action} clicked`)
		setIsDropdownOpen(false)
		// Add your navigation logic here
	}

	return (
		<header className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4 justify-between items-center">
			<div>
				<h1 className="text-xl font-semibold text-gray-900">Library Dashboard</h1>
				<p className="text-sm text-gray-500">Library Management System</p>
			</div>

			<div className="flex items-center gap-4">
				{/* User Info */}
				<div className="flex items-center gap-3">
					<div className="text-right">
						<p className="text-sm font-medium text-gray-900">{userName}</p>
						<p className="text-xs text-gray-500">Patron</p>
					</div>
				</div>

				{/* Dropdown Menu */}
				<div className="relative" ref={dropdownRef}>
					<button onClick={toggleDropdown} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
								<User className="h-4 w-4 text-blue-600" />
							</div>
							<Settings className="h-4 w-4 text-gray-600" />
							<ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
						</div>
					</button>

					{/* Dropdown Menu */}
					{isDropdownOpen && (
						<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
							<button
								onClick={() => handleMenuClick('Client Dashboard')}
								className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
								Client Dashboard
							</button>
							<button
								onClick={() => handleMenuClick('Account Settings')}
								className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
								Account Settings
							</button>
							<hr className="my-1 border-gray-100" />
							<button
								onClick={() => handleMenuClick('Logout')}
								className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
								Logout
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	)
}
