// encode_string()
// Purpose: convert plain-text string to web-encoded string
export function encodeString(inputString: string): string {
	// Convert plain-text string to MINISIS encoded string
	const minisisEncodedString = minisisEncoding(inputString)

	// Convert MINISIS encoded string to web-encoded string
	const webString = webEncoding(minisisEncodedString)

	// Return web-encoded string
	return webString
}

// minisis_encoding()
// Purpose: encode plain-text to MINISIS encoded string
// Processing: Splits byte into two 4-bit values, adds sum value to 4-bit values, swaps values, and adds a check digit.
export function minisisEncoding(inputString: string): string {
	let mEncodedString = ''
	const tempArray: number[] = []
	const stringLength = inputString.length

	// Input string size must be less than or equal to 96 characters
	if (stringLength <= 96) {
		// Split byte to 2 4-bit values and then add sum value
		for (let ix = 0; ix < stringLength; ix++) {
			const charValue = inputString.charCodeAt(ix)
			const value2 = Math.floor(charValue / 16)
			const value1 = charValue % 16

			tempArray[ix * 2] = value1 + ix * 2 + 1 + 48 // 48 = ASCII code for '0'
			tempArray[ix * 2 + 1] = value2 + ix * 2 + 2 + 48
		}

		// Swap characters
		const limit = Math.floor(stringLength / 2)
		let lastLoc = stringLength * 2 - 2
		for (let ix = 0; ix < limit; ix++) {
			const temp = tempArray[ix * 2]
			tempArray[ix * 2] = tempArray[lastLoc]
			tempArray[lastLoc] = temp
			lastLoc -= 2
		}

		// Set check digit
		tempArray[stringLength * 2] = stringLength + 65 // 65 = ASCII code for 'A'

		// Convert byte array to string
		const totalLength = stringLength * 2 + 1
		for (let ix = 0; ix < totalLength; ix++) {
			mEncodedString += String.fromCharCode(tempArray[ix])
		}
	}

	return mEncodedString
}

// web_encoding()
// Purpose: encode text string to web-encoded string
// Processing: Maps 256-base character codes to one or more 62-base character codes
export function webEncoding(inputString: string): string {
	const base62Code = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
	const multiplierChar = '|?@['
	const MAX_WEB_CHARS = base62Code.length
	let wEncodedString = ''

	for (let ix = 0; ix < inputString.length; ix++) {
		const charValue = inputString.charCodeAt(ix)
		let webCharString: string

		if (charValue < MAX_WEB_CHARS) {
			webCharString = base62Code[charValue]
		} else {
			const multiplier = Math.floor(charValue / MAX_WEB_CHARS) - 1
			webCharString = multiplierChar[multiplier] + base62Code[charValue % MAX_WEB_CHARS]
		}

		wEncodedString += webCharString
	}

	return wEncodedString
}

export function decodeString(inputString: string): string {
	let resultString: string
	const tempArray: number[] = []
	let ix = 0
	let tempIx = 0
	let charValue: number
	let charSize: number
	let numChar: number
	let limit: number
	let length = inputString.length

	// Undo MWI encoding
	while (ix < length) {
		charValue = inputString.charCodeAt(ix)
		if (getMultiplier(charValue) !== 0) {
			if (ix + 1 < length) {
				charValue = decodeWebChar(charValue, inputString.charCodeAt(ix + 1))
				charSize = 2
			} else {
				charValue = decodeWebChar(charValue, 0)
				charSize = 1
			}
		} else {
			charValue = decodeWebChar(charValue, 0)
			charSize = 1
		}

		if (charValue !== -1) {
			tempArray[tempIx] = charValue
			tempIx++
		}
		ix += charSize
	}

	// Undo MINISIS encoding
	length = tempIx
	numChar = (length - 1) / 2
	limit = tempArray[length - 1] - 65 // 65 = "A"

	if (limit !== numChar) {
		resultString = inputString
	} else {
		limit = Math.floor(limit / 2)
		tempIx = (numChar - 1) * 2
		for (ix = 0; ix < limit; ix++) {
			// Swap characters
			charValue = tempArray[ix * 2]
			tempArray[ix * 2] = tempArray[tempIx]
			tempArray[tempIx] = charValue
			tempIx -= 2
		}

		resultString = ''
		for (ix = 0; ix < numChar; ix++) {
			// Convert two byte values to one byte value
			charValue = tempArray[ix * 2] - ix * 2 - 1 - 48 // 48 = "0"
			charValue += (tempArray[ix * 2 + 1] - ix * 2 - 2 - 48) * 16 // 48 = "0"
			resultString += String.fromCharCode(charValue)
		}
	}

	return resultString
}

function getMultiplier(charValue: number): number {
	switch (charValue) {
		case 124: // "|"
			return 62
		case 63: // "?"
			return 124
		case 64: // "@"
			return 186
		case 91: // "["
			return 248
		default:
			return 0
	}
}

function decodeWebChar(char1: number, char2: number): number {
	let charValue = -1

	const multiplier = getMultiplier(char1)
	if (multiplier !== 0) {
		charValue = mapWebChar(char2)
		if (charValue >= MAX_BYTE2_VALUE) {
			charValue = -1
		}
		if (charValue !== -1) {
			charValue += multiplier
		}
	} else {
		charValue = mapWebChar(char1)
	}

	return charValue
}

function mapWebChar(webChar: number): number {
	if (webChar >= 48 && webChar <= 57) {
		// 0-9
		return webChar - 48
	} else if (webChar >= 65 && webChar <= 90) {
		// A-Z
		return 10 + (webChar - 65)
	} else if (webChar >= 97 && webChar <= 122) {
		// a-z
		return 36 + (webChar - 97)
	} else {
		// Invalid base-62 characters
		return -1
	}
}

// Constants
const MAX_BYTE2_VALUE = 62 // Define MAX_BYTE2_VALUE based on your requirements
