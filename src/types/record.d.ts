import { DBFields } from './dbfields'
import { M3Fields } from './m3fields'
import { M2AFields } from './m2afields'
import { M2LFields } from './m2lfields'

type DBFields<T extends string> = T extends 'DESCRIPTION'
	? M2AFields
	: T extends 'COLLECTIONS'
		? M3Fields
		: T extends 'BIBLIO'
			? M2LFields
			: never
export interface Media {
	im: string[]
	im_access_link?: string[]
	ad_access_link?: string[]
	vd_access_link?: string[]
	tx_access_link?: string[]
}
export interface BookmarkCheckBoxData {
	_name: string
	_type: string
	_value: string
}
export interface FieldData<T extends string> {
	[key: string]: string | number | DBFields<T> | FieldData[]
}
export interface Record {
	media?: Media
	is_bookmarked: string
	database_name: string
	record_link: string
	record: FieldData
	input?: BookmarkCheckBoxData
	link_dbname?: string
}

export type MediaType = 'im_access_link' | 'vd_access_link' | 'ad_access_link' | 'tx_access_link'

export interface BookmarkResponse {
	isSuccess: boolean
	newCount?: number
}
