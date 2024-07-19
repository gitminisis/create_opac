import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'

export interface PageLink extends Record<string, string | boolean | undefined> {
	url: string
	active?: boolean
}

export type PagePaginationProps = {
	next?: string
	previous?: string
	items: PageLink[]
	maxItem?: number
	renderItem: (item: PageLink, index: number) => string | React.ReactNode
}

const PagePagination = ({ items, maxItem = 10, renderItem }: PagePaginationProps) => {
	const activeIndex = items.findIndex((item) => item.active)

	return (
		<Pagination>
			<PaginationContent>
				{activeIndex > 0 && (
					<PaginationItem>
						<PaginationPrevious href={items[activeIndex - 1].url} />
					</PaginationItem>
				)}
				{items
					.filter((e, i) => i < maxItem)
					.map((item, index) => (
						<PaginationItem key={index}>
							<PaginationLink isActive={item.active} href={item.url}>
								{renderItem(item, index)}
							</PaginationLink>
						</PaginationItem>
					))}

				{activeIndex < items.length - 1 && (
					<PaginationItem>
						<PaginationNext href={items[activeIndex + 1].url} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	)
}

export default PagePagination
