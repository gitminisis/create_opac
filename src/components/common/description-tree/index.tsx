import { TreeView } from '@/components/tree-view'
import { TreeNode } from '@/lib/tree'
import EmptyState from './empty-state'
import TreeSkeleton from './loading'

const DescriptionTree = ({
	loading = true,
	tree,
	selectedId,
}: {
	loading: boolean | undefined
	tree: TreeNode | undefined
	selectedId: string | undefined
}) => {
	if (loading) return <TreeSkeleton />
	if (!tree) return <EmptyState />

	return <TreeView data={tree} initialSelectedItemId={selectedId} onSelectChange={(item) => {}} />
}

export default DescriptionTree
