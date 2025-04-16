import { Toaster } from '@/components/ui/toaster'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Provider from './providers'
import './styles/index.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider>
			<App />
			<Toaster />
		</Provider>
	</React.StrictMode>
)
