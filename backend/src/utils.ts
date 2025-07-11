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

export function rebuildOPAC() {
	const base = path.dirname(path.dirname(__dirname))

	const process = exec(`cd ${base} && npx vite build`, (error, stdout, stderr) => {
		if (error) {
			console.error(`Build error: ${error.message}`)
			return
		}

		if (stderr) {
			console.error(`Build stderr: ${stderr}`)
		}

		console.log(`Build stdout:\n${stdout}`)

		// Get the current branch name
		exec(`cd ${base} && git rev-parse --abbrev-ref HEAD`, (err, branchStdout) => {
			if (err) {
				console.error(`Error getting branch name: ${err.message}`)
				return
			}

			const branch = branchStdout.trim()

			// Run git commands sequentially
			exec(`cd ${base} && git add . && git commit -m "admin: CMS update" && git push origin ${branch}`, (gitError, gitStdout, gitStderr) => {
				if (gitError) {
					console.error(`Git error: ${gitError.message}`)
					return
				}

				if (gitStderr) {
					console.error(`Git stderr: ${gitStderr}`)
				}

				console.log(`Git stdout:\n${gitStdout}`)
			})
		})
	})

	process.on('spawn', () => {
		console.log('Build started')
	})
	process.on('exit', () => {
		console.log('Build process exited')
	})
	process.on('disconnect', () => {
		console.log('Build process disconnected')
	})
	process.on('close', () => {
		console.log('Build process closed')
	})
	process.on('error', (err) => {
		console.error('Build process error:', err)
	})

	return process
}
