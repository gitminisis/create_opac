import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReactNode } from 'react'

const TabsWrapper = ({ children }: { children?: ReactNode }) => {
	return (
		<Tabs defaultValue="en" className="w-full max-w-6xl">
			<TabsList className="grid w-[200px] grid-cols-2">
				<TabsTrigger value="en">English</TabsTrigger>
				<TabsTrigger value="fr">French</TabsTrigger>
			</TabsList>
			{children}
		</Tabs>
	)
}

export default TabsWrapper
