import { getDataFromXML, getRecordXML } from '@/hooks/useJSONData'
import { BookmarkResponse, Record } from '@/types/record'
import axios, { AxiosResponse } from 'axios'
import { deepSearchKey } from './record'

export const bookmarkSelect = async (session: string, recd: Record) => {
	const { database_name, record } = recd
	return axios({
		method: 'post',
		url: `${session}?ADDSELECTION&COOKIE=BOOKMARK`,
		data: `mcheckbox_${record.sisn}=${record.sisn}-${database_name}`,
	})
}

export const removeBookmarkFromKey = (recd: Record) => {
	const { record, input } = recd
	return axios({
		method: 'post',
		url: `?DELETEORDER&COOKIE=BOOKMARK`,
		data: `${input?._name}=${record.sisn}`,
	})
}

export const validateBookmarkResponse = (
	res: AxiosResponse<any, any>,
	prevCount: number
): BookmarkResponse => {
	if (res.status !== 200 && res.statusText !== 'OK')
		return {
			isSuccess: false,
		}

	const { data } = res
	const doc = new DOMParser().parseFromString(data, 'text/html')
	const jsonData = getDataFromXML('#xml_record', doc)
	if (!jsonData)
		return {
			isSuccess: false,
		}
	const bookmark_count = deepSearchKey(jsonData, 'bookmark_count')[0]
	return {
		isSuccess: prevCount < Number.parseInt(bookmark_count),
		newCount: Number.parseInt(bookmark_count),
	}
}

export const removeAllBookmarks = async (records: Record[]) => {
	let dataString = records.map(({ input, record }) => {
		return `${input?._name}=${record.sisn}`
	})
	return await axios({
		method: 'post',
		url: `?DELETEORDER&COOKIE=BOOKMARK`,
		data: dataString.join('&'),
	}).then((res) => {
		window.location?.reload()
	})
}
