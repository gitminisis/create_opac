/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldsJson } from '@/types/fields.json'
import { Record } from '@/types/record'
import axios from 'axios'
import copy from 'copy-to-clipboard'
const DEFAULT_DETAIL_REPORT = 'WEB_UNION_DETAIL'
const DEFAULT_SUM_REPORT = 'WEB_UNION_SUM'
const WEB_DNS = 'https://camsdev-sfopho.minisisinc.com/'

export type RENDERED_COMPONENT = React.ReactNode | object | null

export type GenericObject = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}

export function deepSearchKey<T extends GenericObject>(obj: T, targetKey: string): any[] {
	const result: any[] = []

	function search(obj: GenericObject, targetKey: string) {
		for (const key in obj) {
			if (key.toLowerCase() === targetKey.toLowerCase()) {
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
	const databaseFields = fields.find((f: any) => f.database === database)
	return databaseFields
}

export const getFieldsFromRecord = (
	record: Record,
	fields: FieldsJson,
	filterFn: (e: any) => boolean,
	componentFn: (data: any[], item: any) => RENDERED_COMPONENT
) => {
	// Try to tell the databases for different page, DonR 20240705
	const database =
		!record.database_name || record.database_name === 'SELECTION_LIST'
			? record.record.link_dbname // for bookmark's sum, detail page
			: record.database_name // for normal sum, detail page
	const listOfFields = getListOfFields(fields, database)
	return listOfFields?.items
		?.filter((item) => filterFn(item))
		.map((item) => {
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
		.then((res) => res)
		.catch((err) => {
			console.error('Error while bookmarking record', err)
		})
}

export const getRecordPermalink = (
	database: string,
	sisn: string,
	report = DEFAULT_DETAIL_REPORT,
	lang = 144
) => {
	return `${WEB_DNS}/scripts/mwimain.dll/${lang}/${database}/${report}?sessionsearch&exp=SISN+${sisn}`
}

export const copyRecordURL = (database: string, sisn: string, report = DEFAULT_DETAIL_REPORT) => {
	try {
		const url = getRecordPermalink(database, sisn, report)
		copy(url)
	} catch (error) {
		console.error(error)
	}
}
