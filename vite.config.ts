import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from 'tailwindcss'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
// https://vitejs.dev/config/
export default defineConfig({
	
	plugins: [react(), cssInjectedByJsPlugin()],
	css: {
		postcss: {
			plugins: [tailwindcss()],
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	build: {
		chunkSizeWarningLimit: 1000, // Increase the warning limit
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'src/index.tsx'), // Specify the entry file
			},
			output: {
				manualChunks: undefined, // Avoid code splitting into separate chunks
				inlineDynamicImports: true, // Inline dynamic imports into a single file
				entryFileNames: '[name].js', // Set entry file names to plain `.js`
				chunkFileNames: '[name].js', // Set chunk file names to plain `.js`
				assetFileNames: '[name].[ext]', // Ensure assets keep their original extensions
			},
		},
		sourcemap: false, // Disable sourcemaps for cleaner output
		minify: 'esbuild', // Use esbuild for faster builds (or use 'terser' for legacy support)
		target: 'esnext', // Ensure modern syntax for your JavaScript output
		outDir: 'dist', // Set the output directory
		emptyOutDir: true, // Clear the output directory before building
	},
})
