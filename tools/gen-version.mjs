import fs from 'node:fs'
import { resolve } from 'node:path'

const base = process.cwd()
const outputPath = resolve(base, 'src/app_version.json')

// Get the current year
const currentYear = new Date().getFullYear()

// Read existing version file if it exists
let currentVersion = '00'
if (fs.existsSync(outputPath)) {
	const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
	const match = existing.APP_VERSION?.match(/^(\d{4})\.(\d{2})$/)
	if (match && match[1] === currentYear.toString()) {
		currentVersion = match[2]
	}
}

// Bump the version (e.g., 01 -> 02)
const nextVersion = String(parseInt(currentVersion, 10) + 1).padStart(2, '0')
const appVersion = `${currentYear}.${nextVersion}`

// Create the JSON object
const outputJson = {
	APP_VERSION: appVersion,
}

// Write to a JSON file
fs.writeFileSync(outputPath, JSON.stringify(outputJson, null, 2))

console.log(`App version bumped to: ${appVersion}`)
