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
import useConstants from '@/hooks/useConstants'
import { convertXMLToJson, decodeObj, isDatePast } from '@/lib/utils'
import axios from 'axios'
import { useEffect, useState } from 'react'

const STATUS_TYPE = {
	Invalid: 'Invalid',
	Success: 'Success',
	Cancel: 'Cancel',
	OutDate: 'OutDate',
}

type PatronInfo = {
	TAG_FUNC_P_ATTND: string
	TAG_FUNC_P_FIRST: string
	TAG_FUNC_P_LAST: string
	TAG_FUNC_P_EMAIL: string
	TAG_NAME: string
	TAG_FUNC_START_T: string
	TAG_FUNC_END_T: string
	TAG_FUNC_ROOM: string
	TAG_FUNC_DATE: string
	TAG_FUNC_LOC: string
	SISN: string
	TAG_FUNC_P_ID: string
	TAG_FUNC_P_T: string
	BRANCH_ADDRESS: string
	occ1: string
	occ2: string
	TAG_FUNC_P_PAID: any
}

const RSVPCancelLandingPage = () => {
	const [loading, setLoading] = useState(true)
	const message: any = useConstants().message
	const [patronInfo, setPatronInfo] = useState<PatronInfo>({
		TAG_FUNC_P_ATTND: '',
		TAG_FUNC_P_FIRST: '',
		TAG_FUNC_P_LAST: '',
		TAG_FUNC_P_EMAIL: '',
		TAG_NAME: '',
		TAG_FUNC_START_T: '',
		TAG_FUNC_END_T: '',
		TAG_FUNC_ROOM: '',
		TAG_FUNC_DATE: '',
		TAG_FUNC_LOC: '',
		SISN: '',
		TAG_FUNC_P_ID: '',
		TAG_FUNC_P_T: '',
		BRANCH_ADDRESS: '',
		occ1: '',
		occ2: '',
		TAG_FUNC_P_PAID: '',
	})
	const [status, setStatus] = useState('')

	useEffect(() => {
		checkParms()
	}, [])

	const checkParms = async () => {
		const params = new URLSearchParams(window.location.search)
		let obj: any
		params.forEach((value: string, key) => {
			obj = decodeObj(value)
		})
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
				return (
					<div
						dangerouslySetInnerHTML={{
							__html: message.cancelLandingNotIntheList,
						}}></div>
				)
			case STATUS_TYPE.Success:
				return (
					<div dangerouslySetInnerHTML={{ __html: message.cancelLandingSuccess }}></div>
				)
			case STATUS_TYPE.OutDate:
				return (
					<div dangerouslySetInnerHTML={{ __html: message.confirmLandingOutDate }}></div>
				)
			case STATUS_TYPE.Cancel:
				return <CancelTmp patronInfo={patronInfo} onClick={onClick} />
			default:
				return (
					<div dangerouslySetInnerHTML={{ __html: message.confirmLandingInvalid }}></div>
				)
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

const CancelTmp = ({ patronInfo, onClick }: any) => {
	const message: any = useConstants().message
	return (
		<div className="text-center">
			<h1 className="text-l font-bold tracking-tight text-gray-900 sm:text-4xl">
				{message.pleaseCancel} :
			</h1>
			<h2 className="text-l font-bold tracking-tight text-gray-900 sm:text-4xl">
				{patronInfo?.TAG_NAME}
			</h2>
			<div className="mt-4 text-gray-500 sm:flex justify-evenly text-lg w-full">
				<div className="sm:w-1/2 max-w-[500px] text-left border-2 border-solid rounded-lg p-5 mx-2">
					<div>{patronInfo?.TAG_NAME}</div>
					<div>{patronInfo?.TAG_FUNC_DATE}</div>
					<div>
						{patronInfo?.TAG_FUNC_START_T} - {patronInfo?.TAG_FUNC_END_T}
					</div>
					<div>{patronInfo?.BRANCH_ADDRESS}</div>
					<div>
						{message.room}: {patronInfo?.TAG_FUNC_ROOM}
					</div>
				</div>
				<div className="sm:w-1/2 max-w-[500px] text-left border-2 border-solid rounded-lg p-5 mx-2">
					<div>
						{patronInfo?.TAG_FUNC_P_LAST}, {patronInfo?.TAG_FUNC_P_FIRST}
					</div>
					<div>{patronInfo?.TAG_FUNC_P_EMAIL}</div>
					<div>{message.registered}:</div>
					<div>{patronInfo?.TAG_FUNC_P_T}</div>
					<div className="border-2 border-dashed p-2">
						{patronInfo?.TAG_FUNC_P_ATTND} {message.spotReserved}
					</div>
				</div>
			</div>
			<Button
				onClick={onClick}
				className="flex items-center justify-center w-[300px] h-[50px] mt-6 inline-block rounded bg-red-600 text-lg font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring">
				<div>{message.unregistered}</div>
			</Button>
		</div>
	)
}

export default RSVPCancelLandingPage
