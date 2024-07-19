import {
	CANCEL_CONFIRMATION_EMAIL_T,
	FUNC_LOC_P_GRP,
	MAIN_MWI_APPLICATION,
	MONTH_REPORT,
	RSVP_LOG_P_STATUS,
	SISN,
	TAG_FUNC_DATE,
	TAG_FUNC_DTE_GRP,
	TAG_FUNC_END_T,
	TAG_FUNC_LOC_GRP,
	TAG_FUNC_P_ATTND,
	TAG_FUNC_P_EMAIL,
	TAG_FUNC_P_ID,
	TAG_FUNC_P_PAID,
	TAG_FUNC_P_T,
	TAG_FUNC_START_T,
	TAG_NAME,
	TAG_P_STATUS,
	TAG_RSVP_PATRON_LOG,
} from '@/components/common/event-calendar/Constants'
import Spinner from '@/components/common/event-calendar/Spinner'
import Layout from '@/components/layouts'
import { Button } from '@/components/ui/button'
import { convertXMLToJson, decodeObj, isDatePast } from '@/lib/utils'
import axios from 'axios'
import { useEffect, useState } from 'react'
import useConstants from '@/hooks/useConstants'
import { PatronInfo, STATUS_TYPE, initialPatronInfo } from '@/types/patroninfo'
import { CancelTmp } from './ActionComponent'
import LandingPageMessage from './LandingPageMessage'

const RSVP_CANCEL = () => {
	const [loading, setLoading] = useState(true)
	const rsvp = useConstants().rsvp
	const [patronInfo, setPatronInfo] = useState<PatronInfo>(initialPatronInfo)
	const [status, setStatus] = useState('')

	useEffect(() => {
		checkParms()
	}, [])

	const checkParms = async () => {
		const params = new URLSearchParams(window.location.search)
		let obj: any
		params?.forEach((value: string, key) => {
			obj = decodeObj(value)
		})
		if (!obj) {
			setLoading(false)
			setStatus(STATUS_TYPE.Invalid)
			return
		}
		let jsonObj = JSON.parse(obj)
		if (isDatePast(jsonObj.TAG_FUNC_DATE)) {
			setStatus(STATUS_TYPE.OutDate)
			return
		}
		isRecordValidate(jsonObj.TAG_FUNC_P_ID).then((res) => {
			setLoading(false)
			if (res) {
				setPatronInfo(jsonObj)
				return setStatus(STATUS_TYPE.Cancel)
			}
			setStatus(STATUS_TYPE.Invalid)
		})
	}

	const isRecordValidate = async (id: string) => {
		setLoading(true)
		return await axios
			.get(
				`/scripts/mwimain.dll/144/${MAIN_MWI_APPLICATION}/${MONTH_REPORT}?commandsearch&exp=${TAG_FUNC_P_ID} ${id}`,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
				}
			)
			.then((res) => {
				let result = convertXMLToJson(res)
				if (result.div) {
					return true
				}
				return false
			})
	}

	const onClick = () => {
		setLoading(true)
		getSessionID()
			.then((res) => removeRecord(res, patronInfo))
			.then((res) => {
				setStatus(STATUS_TYPE.Success)
				return sendCancelConfirmEmail(res)
			})
			.then((res) => storeAtLog(res))
	}

	const getSessionID = async () => {
		let urlForSessionID = `/scripts/mwimain.dll?logon&application=${MAIN_MWI_APPLICATION}`

		return await axios
			.post(
				urlForSessionID,
				{},
				{
					headers: {
						'Content-Type': 'text/xml',
					},
				}
			)
			.then(() => {
				let match = document.cookie.match(/HOME_SESSID=(http:\/\/[^;]+)/) ?? ''
				let HOME_SESSID = match[0]?.split('=')[1]
				return HOME_SESSID
			})
			.catch(() => {
				return false
			})
	}

	const removeRecord = async (
		HOME_SESSID: string | boolean,
		PatronInfo: PatronInfo | undefined
	) => {
		let xmlFormDelete = `<?xml version="1.0" encoding="UTF-8"?>
    <RECORD>
      <${TAG_FUNC_LOC_GRP} occ="${PatronInfo?.occ1}" op="chg">
        <${TAG_FUNC_DTE_GRP} occ="${PatronInfo?.occ2}" op="chg">
          <${FUNC_LOC_P_GRP} op="del" search="${PatronInfo?.TAG_FUNC_P_ID}">
          </${FUNC_LOC_P_GRP}>
        </${TAG_FUNC_DTE_GRP}>
      </${TAG_FUNC_LOC_GRP}>
    </RECORD>`

		return await axios
			.post(
				`${HOME_SESSID}?manipxmlrecord&database=M2L_TAG&READ=N&KEY=${SISN}&VALUE=${PatronInfo?.SISN}`,
				xmlFormDelete,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
					timeout: 5000,
				}
			)
			.then((res) => {
				return HOME_SESSID
			})
			.catch((error) => {
				// error
				setStatus(STATUS_TYPE.Invalid)
				return ''
			})
	}

	const sendCancelConfirmEmail = async (HOME_SESSID: string | boolean) => {
		return await axios
			.post(
				`${HOME_SESSID}?SAVE_MAIL_FORM&TEMPLATE=[CALENDAR]RSVPCancelConfirmTmp.txt&FROM_DEFAULT=noreply@minisisinc.com&TO_DEFAULT=${patronInfo[TAG_FUNC_P_EMAIL]}&SUBJECT_DEFAULT=${CANCEL_CONFIRMATION_EMAIL_T}:${patronInfo[TAG_NAME]}`,
				{
					...patronInfo,
				},
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			.then(async (res) => {
				setLoading(false)
				return { HOME_SESSID, ID: patronInfo[TAG_FUNC_P_ID] }
			})
	}

	const storeAtLog = async (obj: { HOME_SESSID: string | boolean; ID: string }) => {
		let xmlFormAdd = `<?xml version="1.0" encoding="UTF-8"?>
		<RECORD>
			<${TAG_NAME} op="add">${patronInfo[TAG_NAME]}</${TAG_NAME}>
			<${TAG_FUNC_P_ID} op="add">${obj.ID}</${TAG_FUNC_P_ID}>
			<${TAG_FUNC_P_EMAIL} op="add">${patronInfo[TAG_FUNC_P_EMAIL]}</${TAG_FUNC_P_EMAIL}>
			<${TAG_FUNC_P_PAID} op="add">${patronInfo[TAG_FUNC_P_PAID]}</${TAG_FUNC_P_PAID}>
			<${TAG_FUNC_P_T} op="add">${patronInfo[TAG_FUNC_P_T]}</${TAG_FUNC_P_T}>
			<${TAG_FUNC_P_ATTND} op="add">${patronInfo[TAG_FUNC_P_ATTND]}</${TAG_FUNC_P_ATTND}>
			<${TAG_P_STATUS} op="add">${RSVP_LOG_P_STATUS.CANCEL}</${TAG_P_STATUS}>
			<${TAG_FUNC_DATE} op="add">${patronInfo[TAG_FUNC_DATE]}</${TAG_FUNC_DATE}>
			<${TAG_FUNC_START_T} op="add">${patronInfo[TAG_FUNC_START_T]}</${TAG_FUNC_START_T}>
			<${TAG_FUNC_END_T} op="add">${patronInfo[TAG_FUNC_END_T]}</${TAG_FUNC_END_T}>
		</RECORD>`

		return await axios
			.post(
				`${obj.HOME_SESSID}?manipxmlrecord&database=${TAG_RSVP_PATRON_LOG}&READ=N`,
				xmlFormAdd,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
				}
			)
			.then((res) => {
				return
			})
			.catch((error) => {
				throw error
			})
	}

	const showRegStatus = () => {
		switch (status) {
			case STATUS_TYPE.Invalid:
				return <LandingPageMessage {...rsvp.cancelLandingNotIntheList} />
			case STATUS_TYPE.Success:
				return <LandingPageMessage {...rsvp.cancelLandingSuccess} />
			case STATUS_TYPE.OutDate:
				return <LandingPageMessage {...rsvp.confirmLandingOutDate} />
			case STATUS_TYPE.Cancel:
				return <CancelTmp patronInfo={patronInfo} onClick={onClick} />
			default:
				return <LandingPageMessage {...rsvp.confirmLandingInvalid} />
		}
	}

	return (
		<Layout>
			<div className="flex flex-col bg-white h-[800px]">
				<img
					src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
					alt=""
					className="h-64 w-full object-cover"
				/>
				{loading ? (
					<div className={'h-[500px]'}>
						<Spinner
							height={'h-full'}
							spinHeight={'h-20'}
							spinWidth={'w-20'}
							background={'bg-white'}
						/>
					</div>
				) : (
					<div className={'h-full min-h-[550px] flex items-center justify-center'}>
						{showRegStatus()}
					</div>
				)}
			</div>
		</Layout>
	)
}

export default RSVP_CANCEL
