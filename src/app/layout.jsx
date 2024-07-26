// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'PGOC - MIS | Admin',
  description: 'PGOC - MIS | Admin'
}

const RootLayout = ({ children }) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <ToastContainer />
        {children}
      </body>
    </html>
  )
}

export default RootLayout
