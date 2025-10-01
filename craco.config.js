const path = require('path')
const DotEnv = require('dotenv')
const webpack = require('webpack')
const env = DotEnv.config({ path: `./.env.local` }).parsed || {}
const TerserPlugin = require('terser-webpack-plugin')

const envKeys = Object.keys(env).reduce((prev, next) => {
	prev[`process.env.${next.trim()}`] = env[next] ? JSON.stringify(env[next].trim()) : JSON.stringify(env[next].trim())
	return prev
}, {})

const overrideWebpackConfig = ({ webpackConfig }) => {
	// Enhanced caching configuration
	webpackConfig.cache = {
		type: 'filesystem',
		buildDependencies: {
			config: [__filename],
		},
		name: 'development-cache',
	}

	webpackConfig.output.path = path.resolve('dist')
	webpackConfig.output.filename = 'main.js'
	webpackConfig.output.clean = true
	webpackConfig.resolve.alias = {
		'@': path.resolve(__dirname, 'src'),
	}

	// Faster source maps for development
	webpackConfig.devtool = 'eval-cheap-module-source-map'

	// Optimize module resolution
	webpackConfig.resolve.symlinks = false

	// Add thread-loader for parallel processing
	const jsRule = webpackConfig.module.rules.find((rule) => rule.test && rule.test.toString().includes('jsx'))

	if (jsRule && jsRule.use) {
		const babelLoaderIndex = jsRule.use.findIndex((loader) => loader.loader && loader.loader.includes('babel-loader'))

		if (babelLoaderIndex !== -1) {
			jsRule.use.unshift({
				loader: 'thread-loader',
				options: {
					workers: require('os').cpus().length - 1,
				},
			})
		}
	}

	// Limit transpilation scope
	webpackConfig.module.rules.forEach((rule) => {
		if (rule.oneOf) {
			rule.oneOf.forEach((oneOfRule) => {
				if (oneOfRule.include) {
					if (!oneOfRule.exclude) {
						oneOfRule.exclude = /node_modules/
					}
				}
			})
		}
	})

	return webpackConfig
}

module.exports = {
	devServer: {
		devMiddleware: {
			writeToDisk: true,
		},
		// Speed up hot module replacement
		hot: true,
		client: {
			overlay: false, // Disable error overlay for better performance
		},
	},

	webpack: {
		configure: {
			entry: './src/index.tsx',
			optimization: {
				removeAvailableModules: false,
				removeEmptyChunks: false,
				splitChunks: false,
				minimizer: [
					new TerserPlugin({
						parallel: true,
					}),
				],
			},
		},
		plugins: [
			// Add DefinePlugin to avoid process.env access cost
			new webpack.DefinePlugin(envKeys),
		],
	},
	plugins: [
		{
			plugin: { overrideWebpackConfig },
		},
	],
}
