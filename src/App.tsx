import { getComponentFromKey } from './router'

function App() {
	// const curPage = 'detail'
	const curPage = document?.querySelector('#root')?.getAttribute('data-id') || undefined

	// look at ROUTES object to find matching key /
	// component to be render.E.G if curPage === home then render Home component and so one
	const Component = getComponentFromKey(curPage)
	return <Component />
}

export default App
