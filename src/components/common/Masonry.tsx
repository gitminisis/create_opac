export interface MasonryProps<T> extends React.HTMLAttributes<HTMLDivElement> {
	items: T[]
	renderItem: (item: T, index: number) => React.ReactNode
}

const Masonry = <T,>({ items, renderItem }: MasonryProps<T>) => {
	return (
		<div className="w-full masonry sm:masonry-sm md:masonry-md column-gap-2">
			{items.map((item, index) => renderItem(item, index))}
		</div>
	)
}

export default Masonry
