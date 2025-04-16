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
	let database =  record.link_dbname ?? record.database_name
	const listOfFields = getListOfFields(fields, database)
	return listOfFields?.items
		?.filter((item:FieldsJson) => filterFn(item))
		.map((item:FieldsJson) => {
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

export const getRecordPermalink = (
	database: string,
	sisn: string,
	report = DEFAULT_DETAIL_REPORT,
	lang = 144,
	key = 'SISN'
) => {
	return `https://${window.location.hostname}/scripts/mwimain.dll/${lang}/${database}/${report}?sessionsearch&exp=${key}+${sisn}`
}

export const copyRecordURL = (database: string, sisn: string, report = DEFAULT_DETAIL_REPORT, urlOnly = false) => {
	const url = getRecordPermalink(database, sisn, report)
	if(urlOnly) return url
	try {
		copy(url)
		return url;
	} catch (error) {
		console.error(error)
		return url;
	}
}

export const handleCopyRecordURL = (record: Record, urlOnly = false) => {
	if (record.database_name && record.database_name !== 'SELECTION_LIST') {
		// union summary
		return copyRecordURL(record.database_name, record.record.sisn,DEFAULT_DETAIL_REPORT,urlOnly)
	} else if (record.link_dbname && record.record.link_sisn) {
		// bookmark summary
		return copyRecordURL(record.link_dbname, record.record.link_sisn,DEFAULT_DETAIL_REPORT,urlOnly)
	} else if (record.record.link_dbname && record.record.link_sisn) {
		//bookmark detail
		return copyRecordURL(record.record.link_dbname, record.record.link_sisn,DEFAULT_DETAIL_REPORT,urlOnly)
	}
}
