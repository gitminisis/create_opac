import en from './en'
import fr from './fr'
import theme from '@/themes/index.json'

export const CONSTANTS = {
	EN: {
		config: en.config,
		home: en.home,
		theme: theme,
		styles: en.styles,
		faq: en.faq,
		fields: en.fields,
		message: en.message,
	},
	FR: {
		config: fr.config,
		home: fr.home,
		theme: theme,
		styles: fr.styles,
		faq: fr.faq,
		fields: fr.fields,
		message: en.message,
	},
}
