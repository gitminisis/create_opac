/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldsJson } from '@/types/fields.json'
import { Record } from '@/types/record'
import axios from 'axios'
import copy from 'copy-to-clipboard'
export const DEFAULT_DETAIL_REPORT = 'WEB_UNION_DETAIL'
const DEFAULT_SUM_REPORT = 'WEB_UNION_SUM'

export type RENDERED_COMPONENT = React.ReactNode | object | null

export type GenericObject = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}

export function deepSearchKey<T extends GenericObject>(obj: T, targetKey: string): any[] {
	const result: any[] = []

	function search(obj: GenericObject, targetKey: string) {
		for (const key in obj) {
			if (key?.toLowerCase() === targetKey?.toLowerCase()) {
				result.push(obj[key])
			} else if (typeof obj[key] === 'object' && obj[key] !== null) {
				search(obj[key], targetKey)
			}
		}
	}

	search(obj, targetKey)
	return result
}

export const getListOfFields = (fields: FieldsJson, database: string) => {
	const databaseFields = fields.find((f: FieldsJson) => f.database === database)
	return databaseFields
}

export const getFieldsFromRecord = (
	record: Record,
	fields: FieldsJson,
	filterFn: (e: any) => boolean,
	componentFn: (data: any[], item: any) => RENDERED_COMPONENT
) => {
	let database = record.link_dbname ?? record.database_name
	const listOfFields = getListOfFields(fields, database)
	return listOfFields?.items
		?.filter((item: FieldsJson) => filterFn(item))
		.map((item: FieldsJson) => {
			const name = item.name || 'TITLE'
			const data = deepSearchKey(record, name)
			if (data?.length > 0 && item.label !== 'Title') return componentFn(data, item)
		})
		.filter((item: any) => item)
}
export const getFieldDataByLabel = (
	record: Record,
	fields: FieldsJson,
	database: string,
	label = 'Title'
) => {
	const fieldLabel = getListOfFields(fields, database)?.items?.filter((e) => e.label === label)[0]
		?.name
	return fieldLabel ? deepSearchKey(record, fieldLabel)[0] : null
}

export const truncateString = (text: string, maxChars = 50, postfix = '...') => {
	return text.length < maxChars ? text : text.substring(0, maxChars) + postfix
}

export const bookmarkRecord = async (sessionId: string, database: string, sisn: string) => {
	return axios({
		method: 'post',
		url: `${sessionId}?ADDSELECTION&COOKIE=BOOKMARK`,
		data: `mcheckbox_${sisn}=${sisn}-${database}`,
	})
		.then((res) => {
			window.location.reload()
		})
		.catch((err) => {
			console.error('Error while bookmarking record', err)
		})
}

export const getRecordPermalink = ({
	database,
	value,
	report = DEFAULT_DETAIL_REPORT,
	lang = 144,
	key = 'SISN',
}: {
	database: string
	value: string
	report?: string
	lang?: number
	key?: string
}) => {
	return `https://${window.location.hostname}/scripts/mwimain.dll/${lang}/${database}/${report}?sessionsearch&exp=${key}+${value}`
}

export const copyRecordURL = ({
	database,
	value,
	report = DEFAULT_DETAIL_REPORT,
	urlOnly = false,
}: {
	database: string
	value: string
	report?: string
	urlOnly?: boolean
}) => {
	const url = getRecordPermalink({ database, value, report })
	if (urlOnly) return url
	try {
		copy(url)
		return url
	} catch (error) {
		console.error(error)
		return url
	}
}

export const handleCopyRecordURL = (record: Record, urlOnly = false) => {
	debugger;
	const LINK_DBNAME_MAP = {
		DESCRIPTION_WEB: 'refd',
		COLLECTIONS_WEB: 'accession_number',
		BIBLIO_WEB: 'accession_number',
	}
	const db = record.record.link_dbname as keyof typeof LINK_DBNAME_MAP
	const key = record.record[LINK_DBNAME_MAP[db]]
	if (record.database_name && record.database_name !== 'SELECTION_LIST') {
		// union summary
		return copyRecordURL({
			database: record.database_name,
			value: record.record?.sisn,
			report: DEFAULT_DETAIL_REPORT,
			urlOnly,
		})
	}
	if (record.link_dbname && record.record?.link_sisn) {
		// bookmark summary
		return copyRecordURL({
			database: record.link_dbname,
			value: record.record?.link_sisn,
			report: DEFAULT_DETAIL_REPORT,
			urlOnly,
		})
	}
	if (record.record?.link_dbname && record.record?.link_sisn) {
		//bookmark detail
		return copyRecordURL({
			database: record.record.link_dbname,
			value: record.record.link_sisn,
			report: DEFAULT_DETAIL_REPORT,
			urlOnly,
		})
	}
	if (record.record?.link_dbname) {
		//bookmark summary
		return copyRecordURL({
			database: record.record.link_dbname,
			value: key,
			report: DEFAULT_DETAIL_REPORT,
			urlOnly,
		})
	}

	return ''
}
