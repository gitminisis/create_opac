import React from 'react'
import { DialogDescription } from '../../ui/dialog'
import { cn, convertToArr } from '@/lib/utils'
import {
	TAG_FUNC_DATE,
	TAG_FUNC_LOC_DEC,
	TAG_FUNC_LOC_MAX,
	TAG_FUNC_RSVP,
	TAG_FUNC_CANCEL,
	TAG_FUNC_CAN_RES,
	PATRON,
	SISN,
	TAG_FUNC_ACCESS,
	FLOC_IM_REF_GRP,
	FLOC_VD_REF_GRP,
} from './Constants'
import EventRSVPForm from './EventRSVPForm'
import EventRSVPCancel from './EventCancel'
import RSVPCarousel from './RSVPCarousel'

const EventCustomDialogContent = ({ elm, contactInfo, key }: any) => {
	const combined_VD_IMAG_Array_for_carousel = [
		...(elm[FLOC_IM_REF_GRP] || []),
		...(elm[FLOC_VD_REF_GRP] || []),
	]

	return (
		<div
			key={key++}
			className={
				'p-1 rounded border-2 border-primary w-full h-full sm:flex font-bold relative '
			}>
			{elm[TAG_FUNC_CANCEL] && <EventRSVPCancel reason={elm[TAG_FUNC_CAN_RES]} />}
			<div className={'w-full md:h-full sm:w-8/12 '}>
				<RSVPCarousel
					elm={elm}
					items={combined_VD_IMAG_Array_for_carousel}
					contactInfo={contactInfo}
				/>
				<DialogDescription
					className={'h-1/2 h-[250px] overflow-y-auto text-base font-normal p-2'}>
					{elm[TAG_FUNC_LOC_DEC]}
				</DialogDescription>
			</div>
			<div className={'w-full md:h-full md:ml-2 sm:w-4/12'}>
				<EventRSVPForm
					sisnNumber={elm[SISN]}
					capacity={elm[TAG_FUNC_LOC_MAX]}
					patrons={convertToArr(elm[PATRON])}
					event={elm}
					contactInfo={contactInfo}
				/>
			</div>
		</div>
	)
}

export default EventCustomDialogContent
