import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useConstants from '@/hooks/useConstants'
import { convertToArr, convertXMLToJson, getImage, getSessionID } from '@/lib/utils'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LayersControl, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import 'react-leaflet-markercluster/dist/styles.min.css'
import { v4 as uuidv4 } from 'uuid'
import CollapseList from '../CollapseList'
import archiveIcon from '@/assets/icons/archive.png'
import libraryIcon from '@/assets/icons/library.png'
import museumIcon from '@/assets/icons/museum.png'
import './style.css'
import { Button } from '@/components/ui/button'

const DB_TYPE_MAP = {
	library: 'Library',
	archive: 'Archives',
	museum: 'Museum',
}

interface DataType {
	CA_NAME_OCCURRENCE?: string
	ALL_TITLE_WORD_OCCURRENCE: string
	DATABASE_TYPE: string
	ACCESSION_NUMBER?: string
	REFD?: string
	DESCRIPTION: string
	TITLE: string
	DECIMAL_LATITUDE: any
	DECIMAL_LONGITUDE: any
	ORIGIN_COUNTRY: string
	ORIGIN_PRV_STATE: string
	ORIGIN_CITY: string
	DATE: string
	IMAG_URL: string
	SISN: string
	GEN_NOTE?: string
	AUTHOR?: string
	PAUTHOR_OCCURRENCE?: string
	SCOPE: string
}

const markerIcon = (iconUrl: string, bgColor: string): L.DivIcon => {
	return L.divIcon({
		className: '',
		html: `
      <div class="${bgColor}" style="
        width: 22px;
        height: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 9999px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;
      "
           onmouseover="this.style.transform='scale(2)'"
           onmouseout="this.style.transform='scale(1)'">
        <img src="${iconUrl}" style="width: 16px; height: 16px;" />
      </div>
    `,
		iconSize: [20, 20],
		iconAnchor: [10, 10],
		popupAnchor: [0, -10],
	})
}

const COLOR_MAP: any = {
	library: 'bg-minisis-library',
	archive: 'bg-minisis-archives',
	museum: 'bg-minisis-museum',
}

const icons: Record<string, L.DivIcon> = {
	library: markerIcon(libraryIcon, COLOR_MAP.library),
	archive: markerIcon(archiveIcon, COLOR_MAP.archive),
	museum: markerIcon(museumIcon, COLOR_MAP.museum),
}

const clusterMarkerIcon = function (cluster: any, iconUrl: string, bgColor: string) {
	return L.divIcon({
		className: ``,
		html: `
      <div class='${bgColor} min-w-[60px] min-h-[60px] flex flex-col justify-center items-center rounded-full shadow-md'>
        <div><img src="${iconUrl}" class="w-5 h-5" /></div>
        <div>${cluster.getChildCount()}</div>
      </div>
    `,
	})
}

const InteractiveMap = ({ page }: { page: string }) => {
	const { archives, museum, library } = useConstants()
	const { message } = useConstants()
	const [allData, setAllData] = useState<any>([])
	const [filteredData, setFilteredData] = useState<any>([])
	const [selectedDatabases, setSelectedDatabases] = useState<string[]>([])
	const [selectedCountries, setSelectedCountries] = useState<string[]>([])
	const [selectedProvinces, setSelectedProvinces] = useState<string[]>([])
	const [selectedCities, setSelectedCities] = useState<string[]>([])
	const [ckTypes, setCkTypes] = useState<any>({
		databases: [],
		countries: [],
	})

	useEffect(() => {
		fetch_get()
	}, [])

	useEffect(() => {
		if (
			selectedDatabases.length > 0 ||
			selectedCountries.length > 0 ||
			selectedProvinces.length > 0 ||
			selectedCities.length > 0
		) {
			const nData = allData.filter((item: DataType) => {
				const matchesDatabase =
					selectedDatabases.length > 0
						? selectedDatabases.includes(item.DATABASE_TYPE)
						: true
				const matchesCountry =
					selectedCountries.length > 0
						? selectedCountries.includes(item.ORIGIN_COUNTRY)
						: true
				const matchesProvince =
					selectedProvinces.length > 0
						? selectedProvinces.includes(item.ORIGIN_PRV_STATE)
						: true
				const matchesCity =
					selectedCities.length > 0 ? selectedCities.includes(item.ORIGIN_CITY) : true

				return matchesDatabase && matchesCountry && matchesProvince && matchesCity
			})
			setFilteredData(nData)
		} else {
			setFilteredData(allData)
		}
	}, [selectedDatabases, selectedCountries, selectedProvinces, selectedCities, allData])

	const fetch_get = async () => {
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
		} catch (error) {
			console.warn('Error fetching files:', error)
		}
		const updatedRecords = files.map((record: DataType) => {
			if (record?.DECIMAL_LATITUDE && record?.DECIMAL_LONGITUDE) {
				record.DECIMAL_LATITUDE = parseFloat(record?.DECIMAL_LATITUDE ?? 0)
				record.DECIMAL_LONGITUDE = parseFloat(record?.DECIMAL_LONGITUDE ?? 0)
				return record
			}
			return ''
		})
		setAllData(updatedRecords ?? [])
		setFilteredData(updatedRecords ?? [])
		const countries = Array.from(
			new Set(updatedRecords?.map((item: any) => item.ORIGIN_COUNTRY))
		)
		setCkTypes({ countries })
	}

	const getFilePaths = (page: string): string[] => {
		switch (page) {
			case 'library':
				return ['/preprocessing/BIBLIO_WEB_MAP.html']
			case 'museum':
				return ['/preprocessing/COLLECTIONS_WEB_MAP.html']
			case 'archives':
				return ['/preprocessing/DESCRIPTION_WEB_MAP.html']
			case 'home':
				return [
					'/preprocessing/BIBLIO_WEB_MAP.html',
					'/preprocessing/COLLECTIONS_WEB_MAP.html',
					'/preprocessing/DESCRIPTION_WEB_MAP.html',
				]
			default:
				return []
		}
	}

	const handleDatabaseChange = (database: string) => {
		setSelectedDatabases((prev) =>
			prev.includes(database) ? prev.filter((d) => d !== database) : [...prev, database]
		)
		setSelectedCountries([])
		setSelectedProvinces([])
		setSelectedCities([])
	}

	const handleCountryChange = (country: string) => {
		setSelectedCountries((prev) =>
			prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
		)
		setSelectedProvinces([])
		setSelectedCities([])
	}

	const handleProvinceChange = (province: string) => {
		setSelectedProvinces((prev) =>
			prev.includes(province) ? prev.filter((p) => p !== province) : [...prev, province]
		)
		setSelectedCities([])
	}

	const handleCityChange = (city: string) => {
		setSelectedCities((prev) =>
			prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
		)
	}

	const getUniqueValuesP = () => {
		const nData = allData.filter((item: any) => {
			const matchesDatabase =
				selectedDatabases.length > 0
					? selectedDatabases.includes(item?.DATABASE_TYPE)
					: true
			const matchesCountry =
				selectedCountries.length > 0
					? selectedCountries.includes(item.ORIGIN_COUNTRY)
					: true

			return matchesDatabase && matchesCountry
		})
		const uniqueValues = Array.from(new Set(nData?.map((item: any) => item.ORIGIN_PRV_STATE)))
		return uniqueValues
	}

	const getUniqueValuesC = () => {
		const nData = allData.filter((item: any) => {
			const matchesDatabase =
				selectedDatabases.length > 0
					? selectedDatabases.includes(item?.DATABASE_TYPE)
					: true
			const matchesCountry =
				selectedCountries.length > 0
					? selectedCountries.includes(item.ORIGIN_COUNTRY)
					: true
			const matchesProvince =
				selectedProvinces.length > 0
					? selectedProvinces.includes(item.ORIGIN_PRV_STATE)
					: true

			return matchesDatabase && matchesCountry && matchesProvince
		})
		const uniqueValues = Array.from(new Set(nData?.map((item: any) => item.ORIGIN_CITY)))
		return uniqueValues
	}

	const resetMap = () => {
		setSelectedDatabases([])
		setSelectedCountries([])
		setSelectedProvinces([])
		setSelectedCities([])
		setFilteredData(allData)
	}

	const getNumberofType = (type: string, fileterType: string) => {
		let arr = allData.filter((item: any) => item[type] === fileterType) ?? []
		return `(${arr.length})`
	}

	return (
		<div className="w-full relative md:flex">
			<div className="mb-2 md:mb-0 md:w-1/4 rounded border border-primary mr-2 relative">
				<div className="flex justify-between items-center bg-primary p-2">
					<div className={'text-white'}>{message.filterBy}</div>
					<Button
						onClick={resetMap}
						className={'bg-primary text-white'}
						variant={'secondary'}>
						<RefreshCw />
					</Button>
				</div>
				<div className="flex flex-col space-y-4 max-h-[90vh] mb-2 p-2 overflow-y-auto custom-scrollbar">
					{page === 'home' && (
						<CollapseList title={message.type} expand={true}>
							<div className="space-y-3 border-t p-4">
								<div className="flex">
									<div className={'flex items-center space-x-2'}>
										<Checkbox
											onClick={(e) =>
												handleDatabaseChange(DB_TYPE_MAP.archive)
											}
											checked={selectedDatabases.includes(
												DB_TYPE_MAP.archive
											)}
										/>
										<div
											className={`w-[30px] h-[30px] flex justify-center items-center rounded-full shadow-md ${COLOR_MAP.archive}`}>
											<img src={archiveIcon} className="w-5 h-5" />
										</div>
										<Label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
											{message.archives}
										</Label>
										<div>
											{getNumberofType('DATABASE_TYPE', DB_TYPE_MAP.archive)}
										</div>
									</div>
								</div>
								<div className="flex">
									<div className={'flex items-center space-x-2'}>
										<Checkbox
											onClick={() => handleDatabaseChange(DB_TYPE_MAP.museum)}
											checked={selectedDatabases.includes(DB_TYPE_MAP.museum)}
										/>
										<div
											className={`w-[30px] h-[30px] flex justify-center items-center rounded-full shadow-md ${COLOR_MAP.museum}`}>
											{' '}
											<img src={museumIcon} className="w-5 h-5" />
										</div>
										<Label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
											{message.museum}
										</Label>
										<div>
											{getNumberofType('DATABASE_TYPE', DB_TYPE_MAP.museum)}
										</div>
									</div>
								</div>
								<div className="flex">
									<div className={'flex items-center space-x-2'}>
										<Checkbox
											onClick={() =>
												handleDatabaseChange(DB_TYPE_MAP.library)
											}
											checked={selectedDatabases.includes(
												DB_TYPE_MAP.library
											)}
										/>
										<div
											className={`w-[30px] h-[30px] flex justify-center items-center rounded-full shadow-md ${COLOR_MAP.library}`}>
											{' '}
											<img src={libraryIcon} className=" w-5 h-5" />
										</div>
										<Label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
											{message.library}
										</Label>
										<div>
											{getNumberofType('DATABASE_TYPE', DB_TYPE_MAP.library)}
										</div>
									</div>
								</div>
							</div>
						</CollapseList>
					)}
					<CollapseList title={message.country} expand={true}>
						<div className="space-y-3 border-t p-4">
							{ckTypes?.countries?.map((item: string, key: number) => {
								if (item) {
									return (
										item && (
											<div
												className={'flex items-center space-x-2'}
												key={key}>
												<Checkbox
													onClick={() => handleCountryChange(item)}
													checked={selectedCountries.includes(item)}
												/>
												<Label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													{item}
												</Label>
												<div>{getNumberofType('ORIGIN_COUNTRY', item)}</div>
											</div>
										)
									)
								}
								return
							})}
						</div>
					</CollapseList>
					<CollapseList expand={true} title={message.provinceState}>
						<div className="space-y-3 border-t p-4">
							{selectedCountries.length > 0 ? (
								getUniqueValuesP()?.map((item: any, key: number) => {
									return (
										item && (
											<div
												className={'flex items-center space-x-2'}
												key={key}>
												<Checkbox
													onClick={() => handleProvinceChange(item)}
													checked={selectedProvinces.includes(item)}
												/>
												<Label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													{item}
												</Label>
												<div>
													{getNumberofType('ORIGIN_PRV_STATE', item)}
												</div>
											</div>
										)
									)
								})
							) : (
								<div className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									{message.selectTheCountry}
								</div>
							)}
						</div>
					</CollapseList>
					<CollapseList expand={true} title={message.city}>
						<div className="space-y-3 border-t p-4">
							{selectedProvinces.length > 0 ? (
								getUniqueValuesC()?.map((item: any, key: number) => {
									return (
										<div className={'flex items-center space-x-2'} key={key}>
											<Checkbox
												onClick={() => handleCityChange(item)}
												checked={selectedCities.includes(item)}
											/>
											<Label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
												{item}
											</Label>
											<div>{getNumberofType('ORIGIN_CITY', item)}</div>
										</div>
									)
								})
							) : (
								<div className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									{message.selectTheProvince}
								</div>
							)}
						</div>
					</CollapseList>
				</div>
			</div>
			<div className="md:w-3/4">
				<MapContainer
					className="markercluster-map"
					center={[49.1044, -122.8011]}
					zoom={3}
					maxZoom={18}
					style={{
						height: '90vh',
						borderRadius: '0.25rem',
						boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
						zIndex: 8,
					}}>
					<LayersControl position="topright">
						<LayersControl.BaseLayer checked name="Street Map">
							<TileLayer
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							/>
						</LayersControl.BaseLayer>
						<LayersControl.BaseLayer name="Topology Map">
							<TileLayer
								url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
								attribution='&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors'
							/>
						</LayersControl.BaseLayer>
						<LayersControl.BaseLayer name="Light Map">
							<TileLayer
								url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
								attribution='&copy; <a href="https://www.carto.com/">CARTO</a>'
							/>
						</LayersControl.BaseLayer>
						<LayersControl.BaseLayer name="Satellite Map">
							<TileLayer
								url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
								attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
							/>
						</LayersControl.BaseLayer>
					</LayersControl>
					{/* @ts-ignore */}
					<MarkerClusterGroup
						key={`L${uuidv4()?.substring(15)}`}
						spiderfyDistanceMultiplier={1}
						showCoverageOnHover={false}
						iconCreateFunction={(cluster) =>
							clusterMarkerIcon(cluster, libraryIcon, COLOR_MAP.library)
						}>
						{filteredData?.map((marker: DataType, key: number) => {
							if (marker.DATABASE_TYPE === DB_TYPE_MAP.library) {
								return (
									<Marker
										key={`L${marker.DATABASE_TYPE}-${uuidv4().substring(10)}`}
										position={[
											marker?.DECIMAL_LATITUDE,
											marker?.DECIMAL_LONGITUDE,
										]}
										eventHandlers={{
											mouseover: (e) => e.target.openPopup(),
											mouseout: (e) => e.target.closePopup(),
											click: () => {
												const url = `/SCRIPTS/MWIMAIN.DLL?UNIONSEARCH&SIMPLE_EXP=Y&KEEP=Y&ERRMSG=[MESSAGES]no-record.html&APPLICATION=UNION_VIEW&DATABASE=${library.database_name}&language=144&REPORT=WEB_UNION_DETAIL&EXP=ACCESSION_NUMBER%20${marker.ACCESSION_NUMBER}`
												window.location.href = url
											},
										}}
										icon={icons['library']}>
										<Popup
											className="hidden md:block border-minisis-library  border-2 rounded-[14px]"
											offset={[2, 0]}>
											<div className="w-[300px] ">
												<h3 className="text-lg font-bold text-black  pb-2">
													{typeof marker.ALL_TITLE_WORD_OCCURRENCE !==
													'object'
														? marker?.ALL_TITLE_WORD_OCCURRENCE
														: 'n/a'}
												</h3>
												{marker?.IMAG_URL && (
													<div className="bg-slate-100 h-48 mb-4 rounded-[14px]">
														<img
															src={getImage(marker.IMAG_URL)}
															alt="Library"
															className="w-full h-full object-contain rounded-[14px]"
														/>
													</div>
												)}
												<table className="w-full text-sm">
													<tbody>
														{marker.ACCESSION_NUMBER && (
															<tr className="border-b">
																<td className="font-semibold">
																	{message.accessionNumber}
																</td>
																<td>{marker.ACCESSION_NUMBER}</td>
															</tr>
														)}
														<tr className="border-b">
															<td className="font-semibold py-1 pr-2">
																{message.author}
															</td>
															<td>
																{marker.PAUTHOR_OCCURRENCE ||
																	marker.CA_NAME_OCCURRENCE}
															</td>
														</tr>
														<tr className="border-b">
															<td className="font-semibold py-1 pr-2">
																{message.location}
															</td>
															<td>
																{marker.ORIGIN_CITY},
																{marker.ORIGIN_PRV_STATE}
															</td>
														</tr>
														{marker.GEN_NOTE && (
															<tr className="border-b">
																<td className="font-semibold py-1 pr-2">
																	{message.generalNote}
																</td>
																<div className="max-h-[150px] overflow-y-auto custom-scrollbar">
																	<td>{marker.GEN_NOTE}</td>
																</div>
															</tr>
														)}
													</tbody>
												</table>
											</div>
										</Popup>
									</Marker>
								)
							}
						})}
					</MarkerClusterGroup>
					{/* @ts-ignore */}
					<MarkerClusterGroup
						key={`A${uuidv4()?.substring(15)}`}
						spiderfyDistanceMultiplier={1}
						showCoverageOnHover={false}
						iconCreateFunction={(cluster) =>
							clusterMarkerIcon(cluster, archiveIcon, COLOR_MAP.archive)
						}>
						{filteredData?.map((marker: DataType, key: number) => {
							if (marker.DATABASE_TYPE === DB_TYPE_MAP.archive) {
								return (
									<Marker
										key={`A${marker.DATABASE_TYPE}-${uuidv4().substring(10)}`}
										position={[
											marker?.DECIMAL_LATITUDE,
											marker?.DECIMAL_LONGITUDE,
										]}
										eventHandlers={{
											mouseover: (e) => e.target.openPopup(),
											mouseout: (e) => e.target.closePopup(),
											click: () => {
												const url = `/SCRIPTS/MWIMAIN.DLL?UNIONSEARCH&SIMPLE_EXP=Y&KEEP=Y&ERRMSG=[MESSAGES]no-record.html&APPLICATION=UNION_VIEW&DATABASE=${archives.database_name}&language=144&REPORT=WEB_UNION_DETAIL&EXP=refd%20${marker.REFD}`
												window.location.href = url
											},
										}}
										icon={icons['archive']}>
										<Popup
											className="hidden md:block border-minisis-archives  border-2 rounded-[14px]"
											offset={[2, 0]}>
											<div className="w-[300px]">
												<h3 className="text-lg font-bold text-black   pb-2">
													{typeof marker.TITLE !== 'object'
														? marker.TITLE
														: 'n/a'}
												</h3>
												{marker?.IMAG_URL && (
													<div className="bg-slate-100 h-48 mb-4 rounded-[14px]">
														<img
															src={getImage(marker.IMAG_URL)}
															alt="Archive"
															className="w-full h-full object-contain rounded-t-lg rounded-[14px]"
														/>
													</div>
												)}
												<table className="w-full text-sm">
													<tbody>
														{marker.REFD && (
															<tr className="border-b">
																<td className="font-semibold">
																	REFD
																</td>
																<td>{marker.REFD} </td>
															</tr>
														)}
														<tr className="border-b">
															<td className="font-semibold py-1 pr-2">
																{message.location}
															</td>
															<td>
																{marker.ORIGIN_CITY},
																{marker.ORIGIN_PRV_STATE}
															</td>
														</tr>
														{marker.SCOPE && (
															<tr className="border-b">
																<td className="font-semibold py-1 pr-2">
																	{message.description}
																</td>
																<div className="max-h-[150px] overflow-y-auto custom-scrollbar">
																	<td>{marker.SCOPE}</td>
																</div>
															</tr>
														)}
													</tbody>
												</table>
											</div>
										</Popup>
									</Marker>
								)
							}
						})}
					</MarkerClusterGroup>
					{/* @ts-ignore */}
					<MarkerClusterGroup
						key={`M${uuidv4()?.substring(15)}`}
						spiderfyDistanceMultiplier={1}
						showCoverageOnHover={false}
						iconCreateFunction={(cluster) =>
							clusterMarkerIcon(cluster, museumIcon, COLOR_MAP.museum)
						}>
						{filteredData?.map((marker: DataType) => {
							if (marker.DATABASE_TYPE === DB_TYPE_MAP.museum) {
								return (
									<Marker
										key={`M${marker.DATABASE_TYPE}-${uuidv4().substring(10)}`}
										position={[
											marker?.DECIMAL_LATITUDE,
											marker?.DECIMAL_LONGITUDE,
										]}
										eventHandlers={{
											mouseover: (e) => e.target.openPopup(),
											mouseout: (e) => e.target.closePopup(),
											click: () => {
												const url = `/SCRIPTS/MWIMAIN.DLL?UNIONSEARCH&SIMPLE_EXP=Y&KEEP=Y&ERRMSG=[MESSAGES]no-record.html&APPLICATION=UNION_VIEW&DATABASE=${museum.database_name}&language=144&REPORT=WEB_UNION_DETAIL&EXP=ACCESSION_NUMBER%20${marker.ACCESSION_NUMBER}`
												window.location.href = url
											},
										}}
										icon={icons['museum']}>
										<Popup
											className="hidden md:block border-minisis-museum border-2 rounded-[14px]"
											offset={[2, 0]}>
											<div className="w-[300px]">
												<h3 className="text-lg font-bold text-black pb-2 overflow-x-auto">
													{marker.TITLE !== 'object'
														? marker.TITLE
														: 'n/a'}
												</h3>
												{marker?.IMAG_URL && (
													<div className="bg-slate-100 h-48 mb-4 rounded-[14px]">
														<img
															src={getImage(marker.IMAG_URL)}
															alt="Museum"
															className="w-full h-full object-contain rounded-t-lg rounded-[14px]"
														/>
													</div>
												)}
												<table className="w-full text-sm">
													<tbody>
														{marker.ACCESSION_NUMBER && (
															<tr className="border-b">
																<td className="font-semibold">
																	{message.accessionNumber}
																</td>
																<td className="overflow-x-auto">
																	{marker.ACCESSION_NUMBER}
																</td>
															</tr>
														)}

														<tr className="border-b">
															<td className="font-semibold py-1 pr-2">
																{message.location}
															</td>
															<td className="overflow-x-auto">
																{marker.ORIGIN_CITY},
																{marker.ORIGIN_PRV_STATE}
															</td>
														</tr>
														{marker.DESCRIPTION && (
															<tr className="border-b">
																<td className="font-semibold py-1 pr-2">
																	{message.description}
																</td>
																<div className="max-h-[150px] overflow-y-auto custom-scrollbar">
																	<td>{marker.DESCRIPTION}</td>
																</div>
															</tr>
														)}
													</tbody>
												</table>
											</div>
										</Popup>
									</Marker>
								)
							}
						})}
					</MarkerClusterGroup>
				</MapContainer>
			</div>
		</div>
	)
}

export default InteractiveMap
