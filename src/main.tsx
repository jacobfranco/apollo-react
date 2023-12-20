import React from 'react'
import ReactDOM from 'react-dom/client'
import 'src/styles/Theme.css'
import 'src/styles/Fonts.css'
import AppRouter from './Router.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)
