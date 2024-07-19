/**
 * EventCalendarFilter: Filter option list buttons at the EventCalendar
 */
import React, { useState } from 'react'
import { Cal_event, FILTER_TYPE_COLORS } from './Constants'
import CheckboxWithLabel from '../CheckboxWithLabel'
import { RefreshCw } from 'lucide-react'

interface MyComponentProps {
	setCurrentFilter: React.Dispatch<React.SetStateAction<string[]>>
}

type SelectType = {
	[key: string]: number
}

const EventCalendarFilter: React.FC<MyComponentProps> = ({ setCurrentFilter }) => {
	const [selectType, setSelectedType] = useState<SelectType>({})

	/**
	 *
	 * @param e
	 * @returns user filter event map
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.id) return
		let map = selectType
		if (map[e.target.id] > 0) {
			delete map[e.target.id]
		} else {
			map[e.target.id] = 1
		}
		setSelectedType(map)
		setCurrentFilter(Object.keys(map))
	}

	const resetFilter = () => {
		setSelectedType({})
		setCurrentFilter([])
	}

	return (
		<div
			className={
				'flex-none sm:flex flex-wrap w-100 justify-evenly items-center my-2 h-16 overflow-auto'
			}>
			{FILTER_TYPE_COLORS.map((item, key) => {
				return (
					<div className={'mx-1 my-1'} key={key}>
						<CheckboxWithLabel
							label={item.type}
							callback={handleChange}
							checked={selectType[item.type] === 1}
							className={`${item.color} ${item.icon}`}
						/>
					</div>
				)
			})}
			<button
				className={'bg-primary h-8 w-8 text-white flex justify-center items-center rounded'}
				onClick={resetFilter}>
				<RefreshCw />
			</button>
		</div>
	)
}

export default EventCalendarFilter
