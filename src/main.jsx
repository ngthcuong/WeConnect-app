import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from '@pages/HomePage'
import { ThemeProvider } from '@emotion/react'
import theme from '@/configs/mui.config'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from 'pages/RootLayout'
import ModalProvider from 'context/ModalProvider'

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
        ],
    },
])

createRoot(document.getElementById('root')).render(
    //Sử dụng theme của MUI được custom
    <ThemeProvider theme={theme}>
        <ModalProvider>
            <RouterProvider router={router} />
        </ModalProvider>
    </ThemeProvider>,
)
