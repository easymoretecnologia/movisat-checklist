import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import 'react-perfect-scrollbar/dist/css/styles.css'
import type { ChildrenType } from '@core/types'
import { getSystemMode } from '@core/utils/serverHelpers'
import '@/styles/tailwind-colors-root.scss'
import '@/styles/tailwind-bg-colors.scss'
import '@/styles/tailwind-border-colors.scss'
import '@/styles/tailwind-class-colors.scss'
import '@/styles/tailwind-buttons-colors.scss'
import '@/app/globals.css'
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Movisat',
  description: 'Movisat'
}

const RootLayout = async (props: ChildrenType) => {
  const { children } = props

  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (
    <html id='__next' lang='pt-BR' dir={direction} suppressHydrationWarning>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap'/>
        <link rel="icon" href="/images/logomarca.png" sizes="32x32" />
        <link rel="icon" href="/images/logomarca.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/images/logomarca.png" />
        <meta name="msapplication-TileImage" content="/images/logomarca.png" />
      </head>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
        {children}
      </body>
    </html>
  )
}

export default RootLayout
