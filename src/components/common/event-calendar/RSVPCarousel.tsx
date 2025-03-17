import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

import useConstants from '@/hooks/useConstants'
import {
	BD_DIS_ACC,
	BD_DIS_ACC_DETAI,
	BD_DIS_ACC_TYPE,
	Cal_event,
	ContactInfoRSVP,
	MEDIA_TYPE,
	TAG_FUNC_DATE,
	TAG_FUNC_END_T,
	TAG_FUNC_LOC_AUD,
	TAG_FUNC_LOC_MAX,
	TAG_FUNC_LOC_ROO,
	TAG_FUNC_START_T,
	TAG_NAME,
} from './Constants'
import { getContactInfo } from './Service'
import { convertToArr } from '@/lib/utils'

export interface ImageCarouselProps {
	items: any
	elm: Cal_event
	contactInfo: ContactInfoRSVP[]
}

const RSVPCarousel = ({ items, elm, contactInfo }: ImageCarouselProps) => {
	const [current, setCurrent] = React.useState(0)
	const currentMedia = items[current]
	const message = useConstants().message

	const renderPage = () => {
		if (currentMedia[MEDIA_TYPE?.IMAGE]) {
			return (
				<>
					<img
						className="w-full object-fill h-full"
						alt={elm[TAG_NAME]}
						src={`${currentMedia[MEDIA_TYPE.IMAGE]?.toLowerCase().includes('[media]') ? currentMedia[MEDIA_TYPE.IMAGE].replace(/\[media\]/i, '/media/') : currentMedia[MEDIA_TYPE.IMAGE]}`}
					/>
					<div className="pt-3 px-12 h-full overflow-y-auto absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100  items-center justify-evenly transition-opacity duration-300 ">
						<div className={'text-white overflow-hidden text-2xl'}>{elm[TAG_NAME]}</div>
						<div className={'sm:flex text-lg'}>
							<div className="text-white ml-[10px] sm:ml-0 text-md  text-gray-600 font-bold">
								&#x2022;{elm[TAG_FUNC_DATE]}
							</div>
							<div className="text-white ml-[10px] text-md text-gray-600 font-bold">
								<span>&#x2022;{elm[TAG_FUNC_START_T]?.toUpperCase()}</span>
								<span className={'mx-2'}>-</span>
								<span>{elm[TAG_FUNC_END_T]?.toUpperCase()}</span>
							</div>
							<div className="text-white ml-[10px] text-md text-gray-600 font-bold">
								&#x2022;{message.room}: {elm[TAG_FUNC_LOC_ROO]}
							</div>
						</div>
						<div className={'sm:flex text-lg mb-6'}>
							<div className="text-white sm:ml-0 ml-[10px] text-md text-gray-600 font-bold">
								&#x2022;{message.suitableFor}: {elm[TAG_FUNC_LOC_AUD]}
							</div>
							<div className="text-white ml-[10px] text-md text-gray-600 font-bold">
								&#x2022;{message.max}: {elm[TAG_FUNC_LOC_MAX]}
							</div>
						</div>
						{convertToArr(getContactInfo(BD_DIS_ACC, contactInfo, elm))?.map(
							(
								item: {
									BD_DIS_ACC_TYPE: string
									BD_DIS_ACC_DETAI: string
								},
								key: number
							) => {
								return (
									<div className={'sm:flex text-white'} key={key}>
										<div className={'mr-2 w-[65px]'}>
											{item[BD_DIS_ACC_TYPE]}:
										</div>
										<div className={'max-w-[450px]'}>
											{item[BD_DIS_ACC_DETAI]}
										</div>
									</div>
								)
							}
						)}
					</div>
				</>
			)
		} else if (currentMedia[MEDIA_TYPE.VIDEO]) {
			return (
				<video className="w-full h-full" controls controlsList="nodownload">
					<source
						src={
							currentMedia[MEDIA_TYPE.VIDEO]?.toLowerCase().includes('[media]')
								? currentMedia[MEDIA_TYPE.VIDEO].replace(/\[media\]/i, '/media/')
								: currentMedia[MEDIA_TYPE.VIDEO]
						}
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>
			)
		} else {
			return
		}
	}

	return (
		<div className="flex flex-col space-y-4 h-1/2 min-h-[370px] justify-center bg-primary">
			<div className="max-h-[370px] flex w-full h-full  group cursor-pointer relative">
				<div className="w-full h-full flex justify-center items-center bg-zinc-400">
					{currentMedia && renderPage()}
				</div>
			</div>
			<ChevronLeft
				strokeWidth={'3px'}
				className="cursor-pointer absolute bg-gray-400 bg-opacity-30 w-8 h-8 text-white hover:text-primary left-2 top-1/2 transform -translate-y-1/2 transition-all ease-in duration-400"
				onClick={() => setCurrent(current - 1 < 0 ? 0 : current - 1)}
			/>
			<ChevronRight
				strokeWidth={'3px'}
				className="cursor-pointer absolute bg-gray-400 bg-opacity-30 w-8 h-8 text-white hover:text-primary right-2 top-1/2 transform -translate-y-1/2 transition-all ease-in duration-400"
				onClick={() =>
					setCurrent(current + 1 === items.length ? items.length - 1 : current + 1)
				}
			/>
		</div>
	)
}

export default RSVPCarousel
