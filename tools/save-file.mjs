const fs = require('fs')
const path = require('path')

/**
 * Saves content to a file at the specified path.
 * @param {string} filePath - The path where the file should be saved.
 * @param {string} fileContent - The content to be written to the file.
 */
export function saveFile(filePath, fileContent) {
	// Ensure the directory exists
	const dir = path.dirname(filePath)
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}

	// Write content to the file
	fs.writeFile(filePath, fileContent, (err) => {
		if (err) {
			console.error(`Error writing file at ${filePath}:`, err)
		} else {
			console.log(`File successfully written to ${filePath}`)
		}
	})
}
