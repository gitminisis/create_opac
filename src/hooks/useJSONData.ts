import { GenericObject, deepSearchKey } from '@/lib/record'
import { FilterItem } from '@/types/filter'
import { Pagination } from '@/types/pagination'
import { Record } from '@/types/record'
import { useState } from 'react'
import X2JS from 'x2js'
type Props = {
	selector?: string
	defaultData?: GenericObject
}
export const SORT_DATABASE = {
	default: {
		UNION_VIEW: 'WEB_UNION_SUM',
		COLLECTIONS_WEB: 'WEB_UNION_SUM_COL',
		DESCRIPTION_WEB: 'WEB_UNION_SUM_DESC',
	},
	id_asc: {
		UNION_VIEW: 'WEB_UNION_SUM_AID',
		COLLECTIONS_WEB: 'WEB_UNION_SUM_COL_AID',
		DESCRIPTION_WEB: 'WEB_UNION_SUM_COL_AID',
	},
	date_asc: {
		UNION_VIEW: 'WEB_UNION_SUM_ADATE',
		COLLECTIONS_WEB: 'WEB_UNION_SUM_COL_ADATE',
		DESCRIPTION_WEB: 'WEB_UNION_SUM_DESC_ADATE',
	},
	date_dsc: {
		UNION_VIEW: 'WEB_UNION_SUM_DDATE',
		COLLECTIONS_WEB: 'WEB_UNION_SUM_COL_DDATE',
		DESCRIPTION_WEB: 'WEB_UNION_SUM_DESC_DDATE',
	},
	title_asc: {
		UNION_VIEW: 'WEB_UNION_SUM_ATITLE',
		COLLECTIONS_WEB: 'WEB_UNION_SUM_COL_ATITLE',
		DESCRIPTION_WEB: 'WEB_UNION_SUM_DESC_ATITLE',
	},
	title_dsc: {
		UNION_VIEW: 'WEB_UNION_SUM_DTITLE',
		COLLECTIONS_WEB: 'WEB_UNION_SUM_COL_DTITLE',
		DESCRIPTION_WEB: 'WEB_UNION_SUM_DESC_DTITLE',
	},
}

export type SORT_TYPE = keyof typeof SORT_DATABASE
export type APPLICATION_TYPE = keyof typeof SORT_DATABASE.default
export const COMMON_FIELDS = [
	'session',
	'bookmark_count',
	'query_statement',
	'search_statement',
	'first_record_seq',
	'last_record_seq',
	'bookmark_url',
	'total_record',
	'pagesize_12',
	'pagesize_25',
	'pagesize_50',
	'pagesize_100',
	'sort',
] as const

export type COMMON_FIELDS_TYPE = (typeof COMMON_FIELDS)[number]

export type COMMON_FIELDS_OBJECT = {
	[key in COMMON_FIELDS_TYPE]?: string | number
}

const ARRAY_ACCESS_PATHS = [
	'xml.xml_record',
	'xml.div.xml.filter.item_group',
	'xml.xml_record.media.im_access_link',
	'xml.xml_record.media.ad_access_link',
	'xml.xml_record.media.vd_access_link',
	'xml.xml_record.media.tx_access_link',
	'xml.xml_record.media.image_caption',
]

export const getRecordXML = (id: string) => {
	return document.querySelector(id) || null
}

export const getDataFromXML = (id: string) => {
	if (!id) return null
	const xml = getRecordXML(id)
	if (xml) {
		try {
			const x2js = new X2JS({
				arrayAccessFormPaths: ARRAY_ACCESS_PATHS,
			})
			const xmlString = new XMLSerializer().serializeToString(xml)
			const json = x2js.xml2js(xmlString) as GenericObject
			return json
		} catch (error) {
			console.error(error)
		}
	}
	return null
}

const useJSONData = ({ selector, defaultData }: Props) => {
	const [data] = useState<GenericObject | null>(
		defaultData && !selector ? defaultData : selector ? getDataFromXML(selector) : null
	)

	const getCommonFields = () => {
		const object: COMMON_FIELDS_OBJECT = {}
		if (!data) return object
		COMMON_FIELDS.map((key) => {
			const value = deepSearchKey(data, key)
			if (value?.length > 0) {
				object[key] = value[0] as string
			}
		})

		return object
	}

	const getPaginations = (): Pagination | null => {
		if (!data) return null

		const pagination: Pagination = deepSearchKey(data, 'pagination')[0]
		if (!pagination) {
			return null
		}

		return pagination
	}

	const getFilter = (): FilterItem[] => {
		if (!data) return []

		const filterList: FilterItem[] = deepSearchKey(data, 'filter')[0]
		if (!filterList) {
			return []
		}
		return filterList
	}

	const getRecords = (): Record[] => {
		if (!data) return []

		const records: Record[] = deepSearchKey(data, 'xml_record')[0]
		if (!records) {
			return []
		}

		return records
	}

	const getBackToSummary = (): string => {
		if (!data) return ''
		const url = deepSearchKey(data, 'back_to_summary')[0]
		if (!url) return ''

		return url.a._href
	}

	const getNextRecord = (): string | null => {
		if (!data) return null
		const url = deepSearchKey(data, 'next_record')[0]
		if (!url) return null

		return url.a._href
	}

	const getPreviousRecord = (): string | null => {
		if (!data) return null
		const url = deepSearchKey(data, 'previous_record')[0]
		if (!url) return null

		return url.a._href
	}

	const getMedia = (
		record: Record,
		type: 'im_access_link' | 'vd_access_link' | 'ad_access_link' | 'tx_access_link'
	) => {
		if (!record.media || !record.media[type] || !Array.isArray(record.media[type])) return []
		return record.media[type]
	}

	const getSortURL = (application: APPLICATION_TYPE, sort: SORT_TYPE) => {
		const { bookmark_url } = getCommonFields()
		const url = `${bookmark_url}/${SORT_DATABASE[sort][application]}?RECLIST&DATABASE=${application}`
		return url
	}

	const common = getCommonFields()
	const pagination = getPaginations()
	const filter = getFilter()
	const records = getRecords()
	const backToSummary = getBackToSummary()
	const nextRecord = getNextRecord()
	const previousRecord = getPreviousRecord()

	return {
		data,
		common,
		pagination,
		filter,
		records,
		backToSummary,
		nextRecord,
		previousRecord,
		getMedia,
		getSortURL,
	}
}

export default useJSONData
