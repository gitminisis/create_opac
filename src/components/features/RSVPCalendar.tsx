import useConstants from '@/hooks/useConstants'
import { PageSectionProps } from '@/page/Home'
import EventCalendar from '../common/event-calendar'
import Section from '../common/Section'

const RSVPCalendar = ({ page, previewData, previewMode }: PageSectionProps) => {
	const sourceData = useConstants()[page]
	const data = previewMode && previewData ? (previewData as typeof sourceData) : sourceData
	const { message } = useConstants()
	const { rsvp } = data
	return (
		<Section heading={`${message.calendar}`}>
			<EventCalendar databaseType={rsvp.filterDatabase} filterTypes={rsvp.filterTypes} filterOption={rsvp.filterOption} />
		</Section>
	)
}

export default RSVPCalendar
