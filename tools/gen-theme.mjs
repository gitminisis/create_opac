import { getFiles, setFileContent } from './index.mjs'
import { EOL } from 'os'

const inputDir = './src/themes'

const styleMapPath = './src/themes/index.json'

const mainCSSPath = './src/styles/index.css'

function main() {
	try {
		console.log('Generating theme .......')
		console.time('gen-theme')
		const files = getFiles(inputDir, 'css')

		const mainCSSContent = files.map((file) => getImportedCSS(file)).join(EOL)
		const styleMapContent = files.map((file) => getStyleMapObject(file))
		console.log('Generating index.css content .......')

		setFileContent(mainCSSPath, mainCSSContent)
		setFileContent(styleMapPath, JSON.stringify(styleMapContent))

		console.log('Themes successfully generated!')
		console.timeEnd('gen-theme')
	} catch (error) {
		console.log(error)
	}
}

/**
 *
 * @param {string} file
 * @returns {string}
 */
function getImportedCSS(file) {
	return `@import '@/themes/${file}';`
}

/**
 *
 * @param {string} file
 * @returns {string}
 */
function getStyleMapObject(file) {
	return file.replace('.css', '')
}
main()
