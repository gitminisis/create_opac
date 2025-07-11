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

export interface CopyrightData {
	req_order_num: string
	req_patron_name: string
	req_patron_id: string
	req_patron_email: string
	req_topic: string
	req_topic_gl: string
	req_repro_type_occurrence: string
	req_title: string
	req_paid_amt: string
	req_tax: string
	req_handling: string
	req_loc_code: string
	req_tax_percent: string
	req_charge_amt: string
}
export interface EnquiryData {
	enq_id: string
	enq_patron_email: string
	enq_telephone: string
	enq_title: string
	enq_topic_detail: string
	enq_topic: string
	enq_user: string
}
export interface ReproductionData {
	req_order_num: string
	req_patron_name: string
	req_patron_id: string
	req_patron_email: string
	req_topic: string
	req_topic_gl: string
	req_repro_type_occurrence: string
	req_title: string
	req_paid_amt: string
	req_tax: string
	req_handling: string
	req_loc_code: string
	req_tax_percent: string
	req_charge_amt: string
}
export interface RequestData {
	req_db_link3: string | number | readonly string[] | undefined
	req_db_link1: string | number | readonly string[] | undefined
    action_later: string
	action: string
	auto_approve: string
	item_req_time: string
	method_request: string
	rec_status: string
	req_acc_number: string
	req_appl_name: string
	req_back_to_record: string
	req_db_link2: string
	req_db_name: string
	req_db_recid: string
	req_item_id: string
	req_item_title: any
	req_loc_code: string
	req_process_date: string
	req_queue: string
	req_status: string
	req_title: string
	req_topic: string
	sentence_1: string
	sentence_2: string
	time_needed: string
	is_requested_by_client:string
}
export interface Record {
	biblio_r_count: any
	action: string
	biblio_count: string
	bookmark_count: string
	calendar_count: string
	collection_count: string
	copyright_count: string
	copyright: CopyrightData
	crowdsource_count: string
	database_name: string
	description_count: string
	email?: any
	enquiries_count: string
	enquiry: EnquiryData
	first_name: string
	full_name: string
	input?: BookmarkCheckBoxData
	is_bookmarked: string
	last_name: string
	link_dbname?: string
	media?: Media
	orders_count: string
	record_link: string
	record: FieldData
	reproductions_count: string
	reproduction: ReproductionData
	reproductiondetail: ReproductionData
	request: RequestData
	req_status: string
	rec_status: string
	save_n_stop_record?: string // for client registration
	skip_n_stop_record?: string // for client registration
	book_input:string
	book_record_link:string
	refd_lowerexist:string
	container:any
}

export type MediaType = 'im_access_link' | 'vd_access_link' | 'ad_access_link' | 'tx_access_link'

export interface BookmarkResponse {
	isSuccess: boolean
	newCount?: number
}
