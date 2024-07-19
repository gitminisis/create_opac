import FAQ from '@/page/FAQ'
import Home from '@/page/Home'
import NoRecord from '@/page/NoRecord'
import NotFoundPage from '@/page/NotFoundPage'
import Admin from '@/page/admin'
import Detail from '@/page/detail'
import Summary from '@/page/summary'
import RSVP_CANCEL from '@/page/RSVP/Cancellation'
import RSVP_CONFIRM from '@/page/RSVP/Confirmation'
import Login from '@/page/login'
import Bookmark from '@/page/bookmark'
import NoBookmarkRecord from '@/page/NoBookmarkRecord'

export type TRoute = Record<string, () => React.ReactNode>

export const ROUTES: TRoute = {
	home: Home,
	summary: Summary,
	detail: Detail,
	faq: FAQ,
	admin: Admin,
	'no-record': NoRecord,
	'no-bk-record': NoBookmarkRecord,
	rsvp_cancel: RSVP_CANCEL,
	rsvp_confirm: RSVP_CONFIRM,
	login: Login,
	bookmark: Bookmark,
}

/**
 * Return the Component for the corresponding key
 * @param key
 * @returns
 */
export const getComponentFromKey = (key: string | undefined): (() => React.ReactNode) => {
	if (!key) return NotFoundPage
	if (key in ROUTES) {
		return ROUTES[key]
	}
	return NotFoundPage
}
