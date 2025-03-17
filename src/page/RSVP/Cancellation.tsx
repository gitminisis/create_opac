import {
	CANCEL_CONFIRMATION_EMAIL_T,
	FUNC_LOC_P_GRP,
	MAIN_MWI_APPLICATION,
	MONTH_REPORT,
	RSVP_LOG_P_STATUS,
	SISN,
	MAIN_EVENT_CAL_DB,
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
	MAIN_EVENT_CAL_LOG_DB,
} from '@/components/common/event-calendar/Constants'
import Spinner from '@/components/common/event-calendar/Spinner'
import Layout from '@/components/layouts'
import useConstants from '@/hooks/useConstants'
import { convertXMLToJson, decodeObj, getHomeSessionID, isDatePast } from '@/lib/utils'
import { PatronInfo, STATUS_TYPE, initialPatronInfo } from '@/types/patroninfo'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { CancelTmp } from './ActionComponent'
import LandingPageMessage from './LandingPageMessage'

const RSVPCancel = () => {
	const [loading, setLoading] = useState(true)
	const rsvp = useConstants().rsvp
	const [patronInfo, setPatronInfo] = useState<PatronInfo>(initialPatronInfo)
	const [status, setStatus] = useState('')
	const { logo } = useConstants().config

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
		isRecordValidate(jsonObj.TAG_FUNC_P_ID, jsonObj.TAG_FUNC_DATE).then((res) => {
			setLoading(false)
			if (res) {
				setPatronInfo(jsonObj)
				return setStatus(STATUS_TYPE.Cancel)
			}
			setStatus(STATUS_TYPE.Invalid)
		})
	}

	const isRecordValidate = async (id: string, date: string) => {
		setLoading(true)
		return await axios
			.get(
				`/scripts/mwimain.dll/144/${MAIN_MWI_APPLICATION}/${MONTH_REPORT}?commandsearch&exp=${TAG_FUNC_P_ID} ${id} AND ${TAG_FUNC_DATE} ${date}`,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
					withCredentials: true,
				}
			)
			.then((res) => {
				let result = convertXMLToJson(res.data)
				if (result.div) {
					return true
				}
				return false
			})
	}

	const onClick = () => {
		setLoading(true)
		getLogon()
			.then((res) => removeRecord(res, patronInfo))
			.then((res) => {
				setStatus(STATUS_TYPE.Success)
				return sendCancelConfirmEmail(res)
			})
	}

	const getLogon = async () => {
		let urlForSessionID = `/scripts/mwimain.dll?logon&application=${MAIN_MWI_APPLICATION}&file=[OPAC]rsvp-cancel.html`;
	
		try {
			await axios.post(urlForSessionID, {}, {
				headers: { 'Content-Type': 'text/xml' },
				withCredentials: true,
			});
	
			return await waitForHomeSessionID(); 
		} catch (error) {
			return false;
		}
	};
	
	const waitForHomeSessionID = () => {
		return new Promise((resolve, reject) => {
			let attempts = 0;
			const maxAttempts = 10; 
			const interval = 100; 
	
			const checkSessionID = () => {
				let HOME_SESSID = getHomeSessionID();
				if (HOME_SESSID) {
					resolve(HOME_SESSID);
				} else if (attempts < maxAttempts) {
					attempts++;
					setTimeout(checkSessionID, interval);
				} else {
					reject(new Error('Failed to get HOME_SESSID'));
				}
			};
	
			checkSessionID();
		});
	};
	
	

	const removeRecord = async (
		HOME_SESSID: any,
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
				`${HOME_SESSID}?manipxmlrecord&database=${MAIN_EVENT_CAL_DB}&READ=N&KEY=${SISN}&VALUE=${PatronInfo?.SISN}`,
				xmlFormDelete,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
					withCredentials: true,
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
				`${HOME_SESSID}?SAVE_MAIL_FORM&TEMPLATE=[OPAC_EMAIL_TMP]RSVPCancelConfirmTmp.txt&FROM_DEFAULT=noreply@minisisinc.com&TO_DEFAULT=${patronInfo[TAG_FUNC_P_EMAIL]}&SUBJECT_DEFAULT=${CANCEL_CONFIRMATION_EMAIL_T}:${patronInfo[TAG_NAME]}`,
				{
					...patronInfo,
					EVENT_EMAIL_LOGO: logo,
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
				`${obj.HOME_SESSID}?manipxmlrecord&database=${MAIN_EVENT_CAL_LOG_DB}&READ=N`,
				xmlFormAdd,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
					withCredentials: true,
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
			<img
				src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
				alt=""
				className="h-64 w-full object-cover"
			/>
			{loading ? (
				<div className="flex h-full items-center justify-center">
					<Spinner
						height={'h-full'}
						spinHeight={'h-20'}
						spinWidth={'w-20'}
						background={'bg-white'}
					/>
				</div>
			) : (
				showRegStatus()
			)}
		</Layout>
	)
}

export default RSVPCancel
