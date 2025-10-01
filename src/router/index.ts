import Archives from '@/page/Archives'
import FAQ from '@/page/FAQ'
import GenericErrorPage from '@/page/GenericErrorPage'
import Home from '@/page/Home'
import Library from '@/page/Library'
import Museum from '@/page/Museum'
import NoBookmarkRecord from '@/page/NoBookmarkRecord'
import NoRecord from '@/page/NoRecord'
import NoSession from '@/page/NoSession'
import NotFoundPage from '@/page/NotFoundPage'
import RSVPCancel from '@/page/RSVP/Cancellation'
import RSVPConfirm from '@/page/RSVP/Confirmation'
import Admin from '@/page/admin'
import AdminBiblio from '@/page/admin/Biblio'
import AdminCollections from '@/page/admin/Collections'
import AdminDescription from '@/page/admin/Description'
import Fields from '@/page/admin/Fields'
import AdminHome from '@/page/admin/Home'
import AdminLogin from '@/page/admin/Login'
import AdminMessage from '@/page/admin/Message'
import AdminRSVP from '@/page/admin/RSVP'
import AdminSettings from '@/page/admin/Settings'
import AdminStyles from '@/page/admin/Styles'
import Bookmark from '@/page/bookmark'
import BookmarkProfile from '@/page/dashboard/BookmarkProfile'
import Calendar from '@/page/dashboard/Calendar'
import Copyright from '@/page/dashboard/Copyright'
import Crowdsource from '@/page/dashboard/Crowdsource'
import EasyLoad from '@/page/dashboard/Easyload'
import Relogin from '@/page/dashboard/Easyload/Relogin'
import Enquiry from '@/page/dashboard/Enquiry'
import Orders from '@/page/dashboard/Orders'
import PatronProfile from '@/page/dashboard/PatronProfile'
import Reproductions from '@/page/dashboard/Reproductions'
import Detail from '@/page/detail'
import EnquiryConfirmed from '@/page/enquiry/EnquiryConfirmed'
import EnquiryForm from '@/page/enquiry/EnquiryForm'
import Login from '@/page/login'
import ClientLoginError from '@/page/login/ClientLoginError'
import ForgotPin from '@/page/login/ForgotPin'
import Register from '@/page/login/Register'
import ResetPin from '@/page/login/ResetPin'
import ReproductionConfirmed from '@/page/reproduction/ReproductionConfirmed'
import ReproductionDetail from '@/page/reproduction/ReproductionDetail'
import ReproductionForm from '@/page/reproduction/ReproductionForm'
import Request from '@/page/request'
import RequestConfirmed from '@/page/request/RequestConfirmed'
import Summary from '@/page/summary'
import EnquiryReplyForm from '@/page/enquiry/EnquiryReplyForm'
import CopyrightConfirmed from '@/page/copyright/CopyrightConfirmed'
import CopyrightForm from '@/page/copyright/CopyrightForm'
import LibraryCirculation from '@/page/dashboard/LibraryCirculation'
import RequestLater from '@/page/request-later'
import AccountSettings from '@/page/dashboard/AccountSettings'
import Minista from '@/page/minista'
export type TRoute = Record<string, (props?: any) => JSX.Element>

const ADMIN_ROUTES: TRoute = {
	admin: Admin,
	'admin-login': AdminLogin,
	'admin-fields': Fields,
	'admin-home': AdminHome,
	'admin-biblio': AdminBiblio,
	'admin-description': AdminDescription,
	'admin-collections': AdminCollections,
	'admin-rsvp': AdminRSVP,
	'admin-message': AdminMessage,
	'admin-styles': AdminStyles,
	'admin-settings': AdminSettings,
}

export const ROUTES: TRoute = {
	home: Home,
	summary: Summary,
	detail: Detail,
	faq: FAQ,
	admin: Admin,
	login: Login,
	register: Register,
	archives: Archives,
	library: Library,
	museum: Museum,
	patronprofile: PatronProfile,
	orders: Orders,
	copyright: Copyright,
	reproductions: Reproductions,
	enquiry: Enquiry,
	bookmarkprofile: BookmarkProfile,
	crowdsource: Crowdsource,
	calendar: Calendar,
	request: Request,
	minista: Minista,
	'request-later': RequestLater,
	easyload: EasyLoad,
	'easyload-login': Relogin,
	requestconfirmed: RequestConfirmed,
	'forgot-pin': ForgotPin,
	'reset-pin': ResetPin,
	'rsvp-cancel': RSVPCancel,
	'rsvp-confirm': RSVPConfirm,
	'no-record': NoRecord,
	'no-bk-record': NoBookmarkRecord,
	'no-bookmark': NoBookmarkRecord,
	'no-session': NoSession,
	error: GenericErrorPage,
	bookmark: Bookmark,
	enquiryform: EnquiryForm,
	enquiryreplyform: EnquiryReplyForm,
	enquiryconfirmed: EnquiryConfirmed,
	reproductionform: ReproductionForm,
	reproductionconfirmed: ReproductionConfirmed,
	reproductiondetail: ReproductionDetail,
	copyrightform: CopyrightForm,
	copyrightconfirmed: CopyrightConfirmed,
	'client-login-error': ClientLoginError,
	'library-circulation': LibraryCirculation,
	'account-settings': AccountSettings,
	...ADMIN_ROUTES,
}

export const getComponentFromKey = (key: string | undefined): (() => React.ReactNode) => {
	if (!key) return NotFoundPage
	if (key in ROUTES) {
		return ROUTES[key]
	}
	return NotFoundPage
}
