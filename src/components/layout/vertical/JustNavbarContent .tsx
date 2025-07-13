'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { Button } from '@mui/material'
import { Icon } from '@iconify/react'

const NavbarContent = () => {
  return (
    <div 
      className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full !bg-port-gore-950')} 
    >
      <div className='flex items-center gap-4'>
        <img src='/images/logo-2.webp' />
      </div>
      <div className='flex items-center'>
        {/* <UserDropdown /> */}
        <Button sx={{ color: '#FFF' }}>
          <Icon icon='solar:user-circle-linear' fontSize={32} className='!mr-2' />
          Entrar
        </Button>
      </div>
    </div>
  )
}

export default NavbarContent
