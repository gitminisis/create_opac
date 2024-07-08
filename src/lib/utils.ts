import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import X2JS from 'x2js'
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
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
	return type?.replace(/\s+/g, '')?.toLowerCase()
}

/**
 *
 * @param elm
 * @returns Array
 */
export const convertToArr = (elm: Object | Array<any>) => {
	if (Array.isArray(elm)) {
		return elm
	}
	return [elm]
}

export const convertXMLToJson = (response: any) => {
	const x2js = new X2JS()
	const jsonData: any = x2js.xml2js(response.data)
	return jsonData
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

export function deleteCookie(cname: string) {
	document.cookie = cname + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export function deleteAllCookies() {
	var cookies = document.cookie.split(';')
	var cookie = ''
	for (var i = 0; i < cookies.length; i++) {
		deleteCookie(cookies[i].split('=')[0])
	}
}

export function getHOMESESSID() {
	let match = document.cookie.match(/HOME_SESSID=(http:\/\/[^;]+)/) ?? ''
	let HOME_SESSID = match[0]?.split('=')[1]
	return HOME_SESSID
}

export function setCookie(name: string, value: string, days: number) {
	var expires = ''
	if (days) {
		var date = new Date()
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
