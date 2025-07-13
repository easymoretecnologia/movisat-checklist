'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { useSession } from 'next-auth/react'
import Echo from 'laravel-echo'
import pusher from '@/configs/pusher'
import useNotification from '@/hooks/useNotification'
import { useEffect } from 'react'
import { IconProps } from '@iconify/react/dist/iconify.js'

const NavbarContent = () => {
  const { data:session, status } = useSession()
  const notifications = useNotification()

  useEffect(() => {
    if (typeof window === 'undefined' || status !== 'authenticated') {
      return
    }

    /* if (!window.Echo) {
      const echo = new Echo({
        ...pusher,
        auth: {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Access-Control-Allow-Origin': '*',
          },
        },
        bearerToken: session.accessToken,
        timeout: 36000,
        activityTimeout: 60000,
      })

      window.Echo = echo
    }

    const channel = session.user.tipo === 'responsavel' ? 'ecommerce.responsavel.notifications' : 'ecommerce.admin.notifications'
    const listen = session.user.tipo === 'responsavel' ? 'NotificationResponsavelEvent' : 'NotificationAdminEvent'

    window.Echo.private(channel).listen(listen, (e: { icon: string, iconStyle?: IconProps['style'], message: string }) => {
        notifications.message(e)
    }) */
  }, [session, status])

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* <ModeDropdown /> */}
      </div>
      <div className='flex items-center'>
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
