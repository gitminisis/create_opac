import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import X2JS from 'x2js'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getImage = (image: string) => {
	if (Array.isArray(image)) {
		return image[0]?.toLowerCase().includes('[media]')
			? image[0].replace(/\[media\]/i, '/media/')
			: image
	} else {
		return image?.toLowerCase().includes('[media]')
			? image.replace(/\[media\]/i, '/media/')
			: image
	}
}

/**
 * Ensure type-safe for config
 * @returns
 */
export const getJSONType = <T>(json: T): typeof json => {
	return json
}

/**
 * Copy text to clipboard
 * @param text
 */
export const copyToClipboard = (text: string): void => {
	try {
		Promise.resolve(navigator.clipboard.writeText(text))
	} catch (err) {
		console.error('Failed to copy: ', err)
	}
}

/**
 *
 * @param text original string
 * @param maxLength maximum number of chars
 * @param appendText text to be appened after truncation
 * @returns truncated word
 */
export const truncateWords = (
	text: string,
	maxLength: number = 20,
	appendText: string = '...'
): string => {
	if (text.length <= maxLength) return text

	return `${text.substring(0, maxLength)}${appendText}`
}

/**
 * Removes leading and trailing spaces from a string and converts it to lowercase.
 * @param {string} type The input string to be processed.
 * @returns {string} The processed string with leading and trailing spaces removed and converted to lowercase.
 */
export const convertLowerTrim = (type: string): string => {
	return type?.replace(/\s/g, '')?.toLowerCase()
}

/**
 *
 * @param elm
 * @returns Array
 */
export const convertToArr = (elm: any) => {
	if (Array.isArray(elm)) {
		return elm
	}
	return elm ? [elm] : []
}

export const convertXMLToJson = (response: string) => {
	const x2js = new X2JS()
	const cleaned = escapeBrTags(response)
	const jsonData: any = x2js.xml2js(cleaned)
	return jsonData
}

const escapeBrTags = (xml: string): string => {
	return xml.replace(/<br\s*\/?>/gi, '');
}

export const encodeObj = (input: string) => {
	return btoa(input) ?? ''
}

export const decodeObj = (input: string) => {
	return atob(input) ?? ''
}

export const isDatePast = (dateString: string) => {
	const givenDate = new Date(dateString)
	const currentDate = new Date()
	currentDate.setHours(0, 0, 0, 0)

	return givenDate < currentDate
}

/**
 * Cookie
 */

export function isLogin() {
	const cookies = document.cookie.split(';')
	let hasId = false
	let hasName = false
	cookies.forEach((cookie) => {
		const [name, value] = cookie.trim().split('=')
		if (name === 'M2L_PATRON_ID' && value) {
			hasId = true
		}
		if (name === 'M2L_PATRON_NAME' && value) {
			hasName = true
		}
	})
	return hasId && hasName
}

export function getCookieValue(name: string) {
	const cookies = document.cookie.split(';')
	for (let cookie of cookies) {
		const [cookieName, cookieValue] = cookie.trim().split('=')

		if (cookieName === name) {
			return cookieValue
		}
	}
	return null
}

export const clearCookies = () => {
	let cookies = document.cookie.split(';')
	for (let i = 0; i < cookies.length; i++) {
		//delete each cookie
		deleteCookie(cookies[i].split('=')[0])
	}
	window.location.href = '/'
}

export function deleteCookie(cname: string) {
	document.cookie = cname + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export function deleteAllCookies() {
	let cookies = document.cookie.split(';')
	let cookie = ''
	for (let i = 0; i < cookies.length; i++) {
		deleteCookie(cookies[i].split('=')[0])
	}
}

export function getHomeSessionID() {
	let match = document.cookie.match(/HOME_SESSID=(https?:\/\/[^;]+)/) ?? ''
	let HOME_SESSID = match[0]?.split('=')[1]
	return HOME_SESSID
}

export function setCookie(name: string, value: string, days?: number) {
	let expires = ''
	if (days) {
		let date = new Date()
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = '; expires=' + date.toUTCString()
	}
	document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

export const getCurrentDate = () => {
	const currentDate = new Date()
	const year = currentDate.getFullYear()
	const month = String(currentDate.getMonth() + 1).padStart(2, '0')
	const day = String(currentDate.getDate()).padStart(2, '0')
	const hours = String(currentDate.getHours()).padStart(2, '0')
	const minutes = String(currentDate.getMinutes()).padStart(2, '0')
	const seconds = String(currentDate.getSeconds()).padStart(2, '0')

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const getSessionID = () => {
	const domSessionId = document.querySelector('#session-id')?.textContent
	if (document && domSessionId !== '^sessid^') return domSessionId
	const cookieSessionId = getHomeSessionID()
	if (cookieSessionId === '') return null
	return cookieSessionId
}

export const getSearchURL = (url: string) => {
	const sessionID = getSessionID()
	if (sessionID) return `${sessionID}?${url}`
	const hostname = window.location.protocol + '//' + window.location.host
	return `${hostname}/SCRIPTS/MWIMAIN.DLL?${url}`
}

export const getPatronID = () => {
	return getCookieValue('M2L_PATRON_ID')?.split(']')[1]
}

export const getLanguageID = () => {
	return getCookieValue('$LANG')?.split(']')[1]
}

export const encodeURIStringToMinisisSpecialCharacter = (originalString: string) => {
	return encodeURIComponent(originalString).replace(/%/g, '~')
}

export const isDescriptionDatabase = (database: string) => {
	return database.toLocaleUpperCase() === 'DESCRIPTION_WEB'
}

export function getClassName(databaseName?: string, type?: 'text' | 'border' | 'bg'): string {
	const normalizedDbName = databaseName?.toLowerCase()

	if (normalizedDbName === 'description_web') {
		return `${type}-minisis-archives`
	} else if (normalizedDbName === 'collections_web') {
		return `${type}-minisis-museum`
	} else if (normalizedDbName === 'biblio_web') {
		return `${type}-minisis-library`
	}

	return '' // Return an empty string or handle other cases as needed
}
