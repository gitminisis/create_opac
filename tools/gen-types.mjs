import { compileFromFile } from 'json-schema-to-typescript'
import fs from 'fs'
import path, { resolve } from 'path'
import { getFiles } from './index.mjs'

// eslint-disable-next-line no-undef
const base = process.cwd()

const inputDir = resolve(base, 'src/schema')
const outDir = resolve(base, 'src/types')

function main() {
	try {
		console.log('Generating types .......')
		console.time('gen-types')
		const files = getFiles(inputDir, 'json')
		files.forEach((file) => {
			const filePath = resolve(inputDir, file)
			generateTypeFile(filePath, outDir)
		})
		console.log('Types successfully generated!')
		console.timeEnd('gen-types')
	} catch (error) {
		console.log(error)
	}
}

main()

/**
 *
 * @param {string} filePath
 */
function generateTypeFile(filePath = './', outDir = './types') {
	try {
		if (!fs.existsSync(outDir)) {
			fs.mkdirSync(outDir)
		}
		const fileName = path.basename(filePath)

		const typedPath = resolve(outDir, `${fileName}.d.ts`)
		compileFromFile(filePath).then((ts) => fs.writeFileSync(typedPath, ts))
	} catch (err) {
		throw new Error('File not found')
	}
}
