import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

export interface PageLink extends Record<string, string | boolean | undefined> {
	url: string
	active?: boolean
}

export type PagePaginationProps = {
	next?: string
	previous?: string
	items: PageLink[]
	maxItem?: number
}

const PagePagination = ({ items, maxItem = 10 }: PagePaginationProps) => {
	const activeIndex = items.findIndex((item) => item.active)
	const totalPages = items.length
	let siblingsCount = 2
	let boundaryCount = 2

	const getVisiblePageLinks = () => {
		if (totalPages <= maxItem) {
			return items
		}

		const showLeftEllipsis = activeIndex > boundaryCount + siblingsCount + 1
		const showRightEllipsis = activeIndex < totalPages - (boundaryCount + siblingsCount + 2)

		const visibleItems = []

		for (let i = 0; i < boundaryCount; i++) {
			visibleItems.push(items[i])
		}

		if (showLeftEllipsis) {
			visibleItems.push({ url: '', ellipsis: true })
		} else if (!showLeftEllipsis && activeIndex > boundaryCount) {
			for (let i = boundaryCount; i < activeIndex - siblingsCount; i++) {
				visibleItems.push(items[i])
			}
		}

		const startSibling = Math.max(
			boundaryCount,
			showLeftEllipsis ? activeIndex - siblingsCount : boundaryCount
		)
		const endSibling = Math.min(
			totalPages - boundaryCount,
			showRightEllipsis ? activeIndex + siblingsCount + 1 : totalPages - boundaryCount
		)

		for (let i = startSibling; i < endSibling; i++) {
			visibleItems.push(items[i])
		}

		if (showRightEllipsis) {
			visibleItems.push({ url: '', ellipsis: true })
		} else if (!showRightEllipsis && activeIndex < totalPages - boundaryCount - 1) {
			for (let i = endSibling; i < totalPages - boundaryCount; i++) {
				visibleItems.push(items[i])
			}
		}

		for (let i = totalPages - boundaryCount; i < totalPages; i++) {
			visibleItems.push(items[i])
		}

		return visibleItems
	}

	const visibleLinks = getVisiblePageLinks()

	return (
		<Pagination className="w-full">
			<PaginationContent className="flex-wrap justify-center">
				{activeIndex > 0 && (
					<PaginationItem className="sm:inline hidden">
						<PaginationPrevious href={items[activeIndex - 1].url} />
					</PaginationItem>
				)}

				{activeIndex > 0 && (
					<PaginationItem className="sm:hidden inline">
						<PaginationPrevious
							href={items[activeIndex - 1].url}
							className="p-2 h-8 w-8 flex items-center justify-center"
						/>
					</PaginationItem>
				)}

				{visibleLinks.map((item: PageLink, index) => (
					<PaginationItem key={index}>
						{item.ellipsis ? (
							<PaginationEllipsis />
						) : (
							<PaginationLink
								isActive={item.active}
								href={item.url}
								className={cn(
									window.innerWidth < 640 ? 'h-8 w-8 p-0' : '',
									item.active ? 'font-bold' : ''
								)}>
								<span>{items.indexOf(item as PageLink) + 1}</span>
							</PaginationLink>
						)}
					</PaginationItem>
				))}

				{activeIndex < items.length - 1 && (
					<PaginationItem className="sm:inline hidden">
						<PaginationNext href={items[activeIndex + 1].url} />
					</PaginationItem>
				)}

				{activeIndex < items.length - 1 && (
					<PaginationItem className="sm:hidden inline">
						<PaginationNext
							href={items[activeIndex + 1].url}
							className="p-2 h-8 w-8 flex items-center justify-center"
						/>
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	)
}

export default PagePagination
