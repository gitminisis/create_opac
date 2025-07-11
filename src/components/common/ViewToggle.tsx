import { viewAtom } from '../../store'
import { LayoutGrid, List } from 'lucide-react'
import { Button } from '../ui/button'
import { useAtom } from 'jotai'
import { useDisplayMode } from '@/hooks/useDisplayMode'

const ViewToggle = () => {
	const { displayMode, toggleDisplayMode } = useDisplayMode()

	return (
		<div className="flex flex-row">
			<Button className="rounded-r-none" onClick={toggleDisplayMode} variant={displayMode === 'grid' ? 'default' : 'outline'} size="icon">
				<LayoutGrid className="h-4 w-4" />
			</Button>
			<Button className="rounded-l-none" onClick={toggleDisplayMode} variant={displayMode === 'list' ? 'default' : 'outline'} size="icon">
				<List className="h-4 w-4" />
			</Button>
		</div>
	)
}

export default ViewToggle
