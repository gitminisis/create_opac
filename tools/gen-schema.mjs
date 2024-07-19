import fs from 'fs'
import path, { resolve } from 'path'
import { getFiles } from './index.mjs'

// eslint-disable-next-line no-undef
const base = process.cwd()

const inputDir = resolve(base, 'src/constants/en')
const outDir = resolve(base, 'src/schema')

function main() {
	try {
		console.log('Generating schemas .......')
		console.time('gen-schema')
		const files = getFiles(inputDir, 'json')

		files.forEach((file) => {
			const filePath = resolve(inputDir, file)
			generateSchema(filePath, outDir)
		})

		console.log('Schemas successfully generated!')
		console.timeEnd('gen-schema')
	} catch (error) {
		console.log(error)
	}
}

main()

/**
 *
 * @param {string} filePath
 */
function generateSchema(filePath = './', outDir = './schema') {
	try {
		const fileContent = fs.readFileSync(filePath, 'utf8')

		// If file content is empty, exits
		if (fileContent.trim() === '') {
			return
		}

		try {
			const fileName = path.basename(filePath)

			const json = JSON.parse(fileContent)
			const rootType = getType(json)
			const root = getStructure(rootType, fileName)
			traverseObject(json, root)
			const metadata = {
				$schema: 'http://json-schema.org/draft-07/schema#',
			}
			const schemaContent = JSON.stringify({ ...metadata, ...root })
			const schemaPath = resolve(`${outDir}/${fileName}`)

			if (!fs.existsSync(outDir)) {
				fs.mkdirSync(outDir)
			}

			if (fs.existsSync(schemaPath)) {
				fs.unlinkSync(schemaPath)
			}

			fs.writeFileSync(schemaPath, schemaContent)
		} catch (error) {
			throw new Error("File can't be parsed into JSON Object")
		}
	} catch (err) {
		throw new Error('File not found')
	}
}

/**
 * Simple bare minimum getType
 * @param {any} object
 * @returns {string}
 */
function getType(object) {
	if (Array.isArray(object)) {
		return 'array'
	}
	const type = typeof object
	return type
}

/**
 * Check if type is primitive
 * @param {string} type
 * @returns {boolean}
 */
function isPrimitive(type) {
	return type === 'string' || type === 'number' || type === 'boolean'
}

/**
 * Return the structure based on type
 * @param {string} type
 * @param {string} key
 * @returns {Map<string, any>}
 */
function getStructure(type, key) {
	const struct = {
		type: type,
		title: isNaN(key) ? camelCaseToRegularString(key) : '',
	}
	if (isPrimitive(type)) {
		return {
			...struct,
		}
	}
	if (type === 'object') {
		return { ...struct, properties: {} }
	}
	if (type === 'array') {
		return { ...struct, items: {} }
	}

	// throw new Error('Unknown type')
}

/**
 *
 * @param {Map<string,any>} root
 * @param {string} prop
 * @param {Map<string,any>} struct
 * @returns {Map<string,any>}
 */
function insertStructure(root, prop, struct) {
	const type = root.type
	if (isPrimitive(type)) {
		return
	}
	if (type === 'object') {
		root['properties'][prop] = struct
	}

	if (type === 'array') {
		root['items'] = struct
	}

	return root
}

/**
 *
 * @param {Map<string,any>} object
 * @param {Map<string,any>} root
 */
function traverseObject(object, root) {
	for (let key in object) {
		const value = object[key]
		const type = getType(value)
		const structure = getStructure(type, key)
		if (!isPrimitive(type)) {
			traverseObject(value, structure)
		}
		insertStructure(root, key, structure)
	}
}

/**
 *
 * @param {string} camelCaseString
 * @returns string
 */
function camelCaseToRegularString(camelCaseString) {
	const regularString = camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2')

	return regularString.charAt(0).toUpperCase() + regularString.slice(1)
}
