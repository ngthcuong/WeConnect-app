import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from "@pages/HomePage";
import { ThemeProvider } from '@emotion/react';
import theme from "@/configs/mui.config"

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}> {/*Sử dụng theme của MUI được custom */}
    <StrictMode>
      <HomePage />
    </StrictMode>
  </ThemeProvider>,
)
