import useConstants from '@/hooks/useConstants'
import { PageSectionProps } from '@/page/Home'
import ImageAccordion from '../common/ImageAccordion'
import Section from '../common/Section'

const FeaturedCollection = ({ page, previewData, previewMode }: PageSectionProps) => {
	const sourceData = useConstants()[page]
	const data = previewMode && previewData ? (previewData as typeof sourceData) : sourceData
	const { message } = useConstants()
	return (
		<Section heading={message.featuredCollections}>
			<ImageAccordion items={data.featuredCollection} />
		</Section>
	)
}

export default FeaturedCollection
