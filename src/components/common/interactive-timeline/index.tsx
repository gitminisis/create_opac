import React, { useState, useEffect, useRef } from 'react'
import * as Popover from '@radix-ui/react-popover'
import archiveIcon from '../../../assets/icons/archive.png'
import libraryIcon from '../../../assets/icons/library.png'
import museumIcon from '../../../assets/icons/museum.png'
import { convertToArr, convertXMLToJson, getImage } from '@/lib/utils'
import useConstants from '@/hooks/useConstants'
import axios from 'axios'

interface DataType {
	LEGAL_TITLE: string
	SISN: string
	TIME_INDEX: string
	DATE: string
	ID: string
	DATABASE_TYPE: string
	IMAG_URL: string
	CENTURY?: string
	ALL_TITLE_WORD_OCCURRENCE: string
	ACCESSION_NUMBER?: string
	REFD?: string
	DESCRIPTION: string
	TITLE: string
	DECIMAL_LATITUDE: any
	DECIMAL_LONGITUDE: any
	ORIGIN_COUNTRY: string
	ORIGIN_PRV_STATE: string
	ORIGIN_CITY: string
	GEN_NOTE?: string
	AUTHOR?: string
	PAUTHOR_OCCURRENCE?: string
	CA_NAME_OCCURRENCE?: string
}

const Timeline = ({ page }: { page: string }) => {
	const [data, setData] = useState<DataType[]>([])
	const { message, archives, library, museum } = useConstants()
	const [openPopoverId, setOpenPopoverId] = useState<number | null>()
	const popoverRef = useRef<HTMLDivElement | null>(null)
	const scrollRef = useRef<HTMLDivElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)
	let count = 0

	useEffect(() => {
		getData()
	}, [])

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleMouseDown = (e: React.MouseEvent) => {
		if (!scrollRef.current) return
		setIsDragging(true)
		setStartX(e.pageX - scrollRef.current.offsetLeft)
		setScrollLeft(scrollRef.current.scrollLeft)
	}

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !scrollRef.current) return
		const x = e.pageX - scrollRef.current.offsetLeft
		const walk = (x - startX) * 2
		scrollRef.current.scrollLeft = scrollLeft - walk
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
			setOpenPopoverId(null)
		}
	}

	const getData = async () => {
		let centuries: any[] = []
		let currentCenturyLabel: string | null = null
		const filePaths = getFilePaths(page)
		let files: DataType[] = []
		try {
			const responses = await Promise.allSettled(filePaths.map((path) => axios.get(path)))
			const validResponses = responses
				.filter((res) => res.status === 'fulfilled' && res.value?.data?.trim())
				.map((res) => (res as PromiseFulfilledResult<any>).value.data)

			if (validResponses.length === 0) {
				console.warn('All files are empty or invalid.')
			} else {
				validResponses.forEach((response) => {
					const json = convertXMLToJson(response)
					let arr = convertToArr(json.xml.record)
					files.push(...arr)
				})
			}
			const records = files
				.map((record: DataType) => ({
					...record,
					TIME_INDEX: record.TIME_INDEX?.split('--')[0],
				}))
				.sort((a: any, b: any) => a.TIME_INDEX - b.TIME_INDEX)

			records.forEach((item) => {
				const timeIndex = parseInt(item.TIME_INDEX)
				let centuryLabel
				if (timeIndex >= 10000) {
					const century = Math.floor((timeIndex - 10000) / 100) * 100
					centuryLabel = century === 0 ? 'AD 0' : `AD ${century}`
				} else {
					const offset = 10000 - timeIndex
					const century = Math.floor(offset / 1000) * 1000
					centuryLabel = century ? `BC ${century + 1000}` : 'BC 0'
				}
				if (centuryLabel !== currentCenturyLabel && !(centuryLabel === 'BC 0' && currentCenturyLabel?.startsWith('BC'))) {
					centuries.push({ century: centuryLabel })
					currentCenturyLabel = centuryLabel
				}
				centuries.push(item)
			})

			setData(centuries)
		} catch (error) {
			console.error('Error fetching files:', error)
		}
	}

	const getFilePaths = (page: string): string[] => {
		switch (page) {
			case 'library':
				return ['/preprocessing/BIBLIO_WEB_TIMELINE.html']
			case 'museum':
				return ['/preprocessing/COLLECTIONS_WEB_TIMELINE.html']
			case 'archives':
				return ['/preprocessing/DESCRIPTION_WEB_TIMELINE.html']
			case 'home':
				return [
					'/preprocessing/BIBLIO_WEB_TIMELINE.html',
					'/preprocessing/COLLECTIONS_WEB_TIMELINE.html',
					'/preprocessing/DESCRIPTION_WEB_TIMELINE.html',
				]
			default:
				return []
		}
	}

	const getIconForType = (databaseType: string) => {
		switch (databaseType) {
			case 'Archives':
				return {
					borderColor: 'border-minisis-archives',
					icon: archiveIcon,
					bgColor: 'bg-minisis-archives',
					keyName: 'REFD',
					key: 'REFD',
					database: archives.database_name,
					description_keyname: message.description,
					description_key: 'SCOPE',
					title_key: 'TITLE',
				}
			case 'Library':
				return {
					borderColor: 'border-minisis-library',
					icon: libraryIcon,
					bgColor: 'bg-minisis-library',
					keyName: message.accessionNumber,
					key: 'ACCESSION_NUMBER',
					database: library.database_name,
					description_keyname: message.generalNote,
					description_key: 'GEN_NOTE',
					title_key: 'ALL_TITLE_WORD_OCCURRENCE',
				}
			case 'Museum':
				return {
					borderColor: 'border-minisis-museum',
					icon: museumIcon,
					bgColor: 'bg-minisis-museum',
					keyName: message.accessionNumber,
					key: 'ACCESSION_NUMBER',
					database: museum.database_name,
					description_keyname: message.description,
					description_key: 'DESCRIPTION',
					title_key: 'LEGAL_TITLE',
				}
		}
	}

	return (
		<div className="w-full relative md:flex my-2">
			<div className="absolute top-3 right-0 z-20 w-[5px] h-[100px] bg-gray-600" />
			<div className="absolute top-3 left-0 z-20 w-[5px] h-[100px] bg-gray-600" />
			<div className="absolute top-[45%] z-0 w-full h-[7px] bg-gray-400" />
			<div
				className="w-full relative flex items-center h-40 justify-around overflow-x-auto px-2 cursor-grab active:cursor-grabbing"
				ref={scrollRef}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseUp}
				onMouseUp={handleMouseUp}>
				{data.map((item: any, idx: number) => {
					if (item.century) {
						count++
						return (
							<div key={idx} className="z-10 pr-1 mb-[15px] w-[20px] h-[110px] mb-1 mx-1">
								<div className="text-left text-[10px] w-[25px] h-[20px] font-bold bottom-[10px]">
									{count % 2 === 1 && item.century}
								</div>
								<div className="w-[5px] h-[70px] transition-transform bg-gray-500" />
								<div className="text-left text-[10px] w-[25px] h-[20px] top-[5px] font-bold">{count % 2 === 0 && item.century}</div>
							</div>
						)
					} else {
						const { borderColor, bgColor, title_key, key, keyName, database, description_keyname, description_key }: any = getIconForType(
							item?.DATABASE_TYPE
						)
						return (
							<div key={idx} className="relative flex flex-col items-center w-full min-w-[10px]">
								<Popover.Root open={openPopoverId === idx}>
									<Popover.Trigger
										className={`z-10 w-[5px] h-[50px] cursor-pointer hover:scale-150 bg-gray-400 focus:outline-none ${bgColor} box-border`}
										onPointerEnter={() => setOpenPopoverId(idx)}>
										<div className="w-full h-full" />
									</Popover.Trigger>
									<Popover.Content
										onMouseLeave={() => setOpenPopoverId(null)}
										side="top"
										align="center"
										className={`p-4 bg-white shadow-lg rounded-[14px] z-30 focus:outline-none border-2 ${borderColor}`}
										sideOffset={20}>
										<Popover.Arrow className={`fill-white w-[18px] h-[15px] transform -translate-x-1 `} />
										<div className="w-[300px]" ref={popoverRef}>
											<a
												href={`/SCRIPTS/MWIMAIN.DLL?UNIONSEARCH&SIMPLE_EXP=Y&KEEP=Y&ERRMSG=[MESSAGES]no-record.html&APPLICATION=UNION_VIEW&DATABASE=${database}&language=144&REPORT=WEB_UNION_DETAIL&EXP=${key}%20${item.ID}`}
												target="_blank">
												<h3 className="text-lg font-bold text-black pb-2">{item[title_key] ?? 'n/a'}</h3>

												{item?.IMAG_URL && (
													<div className="bg-slate-100 h-48 mb-4 rounded-[14px]">
														<img
															src={getImage(item.IMAG_URL)}
															alt={description_keyname}
															className="w-full h-full object-contain rounded-[14px]"
														/>
													</div>
												)}
											</a>
											<table className="w-full text-sm">
												<tbody>
													<tr className="border-b">
														<td className="font-semibold">Type</td>
														<td>{item.DATABASE_TYPE}</td>
													</tr>
													<tr className="border-b">
														<td className="font-semibold">{keyName}</td>
														<td className="max-w-[200px] overflow-x-auto custom-scrollbar whitespace-nowrap">
															{item.ID}
														</td>
													</tr>
													{item.DATE && (
														<tr className="border-b">
															<td className="font-semibold py-1 pr-2">Date</td>
															<td>{item.DATE}</td>
														</tr>
													)}
													{item[description_key] && (
														<tr className="border-b">
															<td className="font-semibold py-1 pr-2">{description_keyname}</td>
															<td>
																<div className="max-h-[150px] overflow-y-auto custom-scrollbar">
																	{item[description_key]}
																</div>
															</td>
														</tr>
													)}

													{item?.DATABASE_TYPE === 'Library' && (
														<tr className="border-b">
															<td className="font-semibold py-1 pr-2">Author</td>
															<td>{item.PAUTHOR_OCCURRENCE || item.CA_NAME_OCCURRENCE}</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>
										<Popover.Arrow className="fill-white" />
									</Popover.Content>
								</Popover.Root>
							</div>
						)
					}
				})}
			</div>
		</div>
	)
}

export default Timeline
