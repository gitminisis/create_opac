import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

export function setFileContent(fp: string, content: string) {
	try {
		if (fs.existsSync(fp)) {
			fs.unlinkSync(fp)
		}
		fs.writeFileSync(fp, content)
	} catch (error) {
		console.error('Error writing file:', error)
	}
}

export function rebuildOPAC(): Promise<{ success: boolean; message: string }> {
	const base = path.dirname(path.dirname(__dirname))

	return new Promise((resolve) => {

		// Due to git duvious ownership error shown, hide this error 20251022 Don Ryu
		// const process = exec(`cd ${base} && npx vite build`, (error, stdout, stderr) => {
		// 	if (error) {
		// 		console.error(`Build error: ${error.message}`)
		// 		resolve({ success: false, message: `Build error: ${error.message}` })
		// 		return
		// 	}

		// 	if (stderr) {
		// 		console.error(`Build stderr: ${stderr}`)
		// 	}

		// 	console.log(`Build stdout:\n${stdout}`)

		// 	// Get the current branch name
		// 	exec(`cd ${base} && git rev-parse --abbrev-ref HEAD`, (err, branchStdout) => {
		// 		if (err) {
		// 			console.error(`Error getting branch name: ${err.message}`)
		// 			resolve({ success: false, message: `Error getting branch name: ${err.message}` })
		// 			return
		// 		}

		// 		const branch = branchStdout.trim()

		// 		// Run git commands sequentially
		// 		exec(`cd ${base} && git add . && git commit -m "admin: CMS update" && git push origin ${branch}`, (gitError, gitStdout, gitStderr) => {
		// 			if (gitError) {
		// 				console.error(`Git error: ${gitError.message}`)
		// 				// Still consider it a success if git fails, as the build itself succeeded
		// 				resolve({ success: true, message: 'Build completed successfully, but git operations failed' })
		// 				return
		// 			}

		// 			if (gitStderr) {
		// 				console.error(`Git stderr: ${gitStderr}`)
		// 			}

		// 			console.log(`Git stdout:\n${gitStdout}`)
		// 			resolve({ success: true, message: 'Build and deployment completed successfully' })
		// 		})
		// 	})
		// })

		process.on('spawn', () => {
			console.log('Build started')
		})
		process.on('error', (err) => {
			console.error('Build process error:', err)
			resolve({ success: false, message: `Build process error: ${err.message}` })
		})
	})
}
