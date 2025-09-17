import useConstants from '@/hooks/useConstants'
import { PageSectionProps } from '@/page/Home'
import ThumbnailCard from '../common/ThumbnailCard'
import { Card } from '../ui/card'
import Slide from '../common/slide'
import Section from '../common/Section'
import { getSearchURL } from '@/lib/utils'
import CategoryByTitle from './CategoryByTitle'

const Categories = ({ page, previewData, previewMode }: PageSectionProps) => {
	const sourceData = useConstants()[page]
	const data = previewMode && previewData ? (previewData as typeof sourceData) : sourceData
	const { archives } = useConstants()

	return (
		<Section heading={data.browseByCategoryTitle}>
			<div>
				<Slide
					itemsPerSlide={{ lg: 4 }}
					items={data.categoriesItems}
					renderItem={(item, index: any) => (
						<Card className="max-w-md mx-auto border-none cursor-pointer hover:shadow-lg" key={index}>
							<ThumbnailCard
								title={item.title}
								url={`${getSearchURL(`UNIONSEARCH&SIMPLE_EXP=Y&ERRMSG=[MESSAGES]no-record.html&REPORT=WEB_UNION_SUM&APPLICATION=UNION_VIEW&exp=${item.url}`)}`}
								thumbnail={item.thumbnail}
							/>
						</Card>
					)}
				/>
				{data.database_name === archives.database_name && <CategoryByTitle />}
			</div>
		</Section>
	)
}

export default Categories
