import axios from 'axios'
import { clone, findIndex, flatten, isEmpty } from 'lodash'
import X2JS from 'x2js'
import { deepSearchKey, DEFAULT_DETAIL_REPORT, GenericObject, getRecordPermalink } from './record'

export type TreeNode = {
	id: string
	key: string
	title: string | null
	hasChildren: boolean
	isChildrenLoaded: boolean
	isRoot: boolean
	parentId?: string // Optional because it might not be present for root nodes
	children?: TreeNode[] // Recursive type to define nested children
}

export type TreeResponse = {
	openKeyPath: string[]
	tree: TreeNode
	noTree?: boolean
}

export const getXMLTreeRecord = (xml: string) => {
	try {
		const x2js = new X2JS()
		const json = x2js.xml2js(xml)
		return json
	} catch (error) {
		console.error('Error while processing the XML record from getXMLTreeRecord', error)
		return false
	}
}
/**
 * Returns the search URL to the record with the corresponding REFD
 */
export const getChildrenSearchLink = (session: string, database: string, refd: string, report = 'EXTRACT_TREE_PAGE'): string => {
	return `${session}/${database}/REFD/${report}?JUMP&DATABASE=${database}&SHOWSINGLE=Y&SHARE_SESSID=LMA_SHARE_SESSID&M_GVAR1=TREE_FORMAT:XML&M_GVAR2=STARTENTRY:1&KEY=${refd}`
}

/**
 * Return a request to search the requested record
 */
export const getXMLTree = (session: string, database: string, id: string): Promise<any> => {
	return axios.get(getChildrenSearchLink(session, database, id))
}

/**
 * Returns the JSON Object for each record in the lower level record XML section
 */
export const mapLowerLevelXMLToNode = (xml: any[], parentId: string): any[] => {
	return xml
		.filter((e) => deepSearchKey(e, 'lower_security')[0] !== 'No')
		.map((e) => {
			const hasChildren = deepSearchKey(e, 'has-children')[0] !== 'false'
			const isNextPage = deepSearchKey(e, 'next-page-link')[0]
			const isPrevPage = deepSearchKey(e, 'previous-page-link')[0]

			if (isNextPage !== undefined) {
				return {
					id: `${parentId}-next-page-link`,
					key: `${parentId}-next-page-link`,
					title: 'Load next 500 records ...',
					parentId,
					isRoot: false,
					hasChildren: false,
					children: null,
					isChildrenLoaded: true,
					loadMore: isNextPage,
				}
			}

			if (isPrevPage !== undefined) {
				return {
					id: `${parentId}-prev-page-link`,
					key: `${parentId}-prev-page-link`,
					title: 'Load previous 500 records ...',
					parentId,
					isRoot: false,
					hasChildren: false,
					children: null,
					isChildrenLoaded: true,
					loadMore: isPrevPage,
				}
			}

			return {
				id: deepSearchKey(e, 'refd')[0],
				key: deepSearchKey(e, 'refd')[0],
				title: deepSearchKey(e, 'title')[0],
				parentId,
				isRoot: false,
				hasChildren,
				children: hasChildren ? [] : null,
				isChildrenLoaded: !hasChildren,
				onClick: () =>
					window.open(
						getRecordPermalink({
							database: 'DESCRIPTION_WEB',
							value: deepSearchKey(e, 'refd')[0],
							report: DEFAULT_DETAIL_REPORT,
							lang: 144,
							key: 'REFD',
						})
					),
			}
		})
}

/**
 * Returns the JSON Object for the main record from the XML search results.
 */
export const mapXMLToNode = (xml: any, id: string): any => {
	let lower_level_occurrence: any = deepSearchKey(xml, 'link')[0]
	if (lower_level_occurrence !== undefined) {
		lower_level_occurrence = Array.isArray(lower_level_occurrence) ? lower_level_occurrence : [lower_level_occurrence]
	}

	const hasChildren = typeof lower_level_occurrence !== 'undefined'
	const parentId = deepSearchKey(xml, 'refd_higher')[0]

	return {
		id,
		key: id,
		title: deepSearchKey(xml, 'record_title')[0],
		parentId: parentId === undefined ? null : parentId,
		isRoot: parentId === undefined,
		hasChildren,
		isChildrenLoaded: true,
		children: hasChildren ? mapLowerLevelXMLToNode(lower_level_occurrence, id) : null,
		onClick: () =>
			window.open(
				getRecordPermalink({
					database: 'DESCRIPTION_WEB',
					value: id,
					report: DEFAULT_DETAIL_REPORT,
					lang: 144,
					key: 'REFD',
				})
			),
	}
}

let tree: any = {}
let openKeyPath: string[] = []
let noTree = false

/**
 * Build the tree from the current record using bottom-up approach
 */
export const getJSONTree = async (session: string, database: string, id: string): Promise<TreeResponse | undefined> => {
	openKeyPath.push(id)

	while (!tree.isRoot) {
		const res = await getXMLTree(session, database, id)
		const { data } = res

		const curNodeJSON = getCurNodeFromXML(data, id)
		if (curNodeJSON === null) {
			noTree = true
			return { tree, openKeyPath, noTree }
		}

		const { xml, curNode, lower_level_occurrence } = curNodeJSON
		const hasChildren = lower_level_occurrence !== undefined && lower_level_occurrence.length > 0

		if (hasChildren) {
			curNode.children = mapLowerLevelXMLToNode(lower_level_occurrence, curNode.id)
		}

		if (isEmpty(tree)) {
			tree = clone(curNode)
		} else {
			const cloneTree = clone(curNode)
			const curRefd = tree.id
			const index = findIndex(cloneTree.children, { id: curRefd })

			if (index !== -1) {
				cloneTree.children[index].children = tree.children
			}
			tree = cloneTree
		}

		if (tree.isRoot) {
			return { tree, openKeyPath }
		} else {
			const higherLevelCode = deepSearchKey(xml as GenericObject, 'refd_higher')[0]
			return getJSONTree(session, database, higherLevelCode)
		}
	}
}

/**
 * Returns the searching record and all its children in JSON format
 */
export const fetchNode = async (session: string, database: string, id: string): Promise<any> => {
	const res = await getXMLTree(session, database, id)
	const { data } = res

	const cur = getCurNodeFromXML(data, id)
	if (!cur) return
	const { curNode, lower_level_occurrence } = cur
	const hasChildren = lower_level_occurrence !== undefined && lower_level_occurrence.length > 0

	if (hasChildren) {
		curNode.children = mapLowerLevelXMLToNode(lower_level_occurrence, curNode.id)
	}
	return curNode
}

/**
 * Appends children to the current node of the tree.
 */
export const appendChildrenToNode = async (url: string, tree: any[], id: string): Promise<any> => {
	const res = await axios.get(url)
	const { data } = res
	const curNode = getCurNodeFromXML(data, id)

	if (!curNode) return
	return addChildrenToNode(tree, id, curNode.curNode.children)
}

export const getCurNodeFromXML = (data: string, id: string) => {
	const dom = new DOMParser().parseFromString(data, 'text/html')
	if (dom.getElementById('MWI-error')) return null

	const xml = getXMLTreeRecord(data)
	const curNode = mapXMLToNode(xml, id)
	const lower_level_occurrence = flatten(deepSearchKey(xml as GenericObject, 'link'))

	return { xml, curNode, lower_level_occurrence }
}

/**
 * Returns node object from the tree using the ID
 */
export const getNodeFromTree = (tree: any, id: string): any | null => {
	const curNode = clone(tree)
	if (curNode.id === id) return curNode

	if (curNode.hasChildren && curNode.isChildrenLoaded) {
		for (const child of curNode.children) {
			const res = getNodeFromTree(child, id)
			if (res !== null) return res
		}
	}

	return null
}

/**
 * Add children to the current node of the tree.
 */
export const addChildrenToNode = (tree: any[], id: string, children: any[]): any[] => {
	if (!children) return tree

	return tree.map((node) =>
		node.id === id
			? { ...node, children, isChildrenLoaded: true }
			: node.hasChildren
				? { ...node, children: addChildrenToNode(node.children, id, children) }
				: node
	)
}
