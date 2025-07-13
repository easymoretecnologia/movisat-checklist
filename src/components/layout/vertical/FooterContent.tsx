'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { Icon } from '@iconify/react'
import { Box, Grid2 as Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import Visa from '@/svg/visa'
import Mastercard from '@/svg/mastercard'
import Dinersclub from '@/svg/dinersclub'

const FooterContent = () => {
  const theme = useTheme()
  const { isBreakpointReached } = useVerticalNav()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  return <Grid container spacing={mobile ? 3 : 1} justifyContent={mobile ? 'center' : 'space-between'} alignItems='center'>
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography fontWeight={700} fontSize={mobile ? '.8rem' : '.9rem'} sx={{ textAlign: mobile ? 'center' : 'left' }}>
        <span className='text-textSecondary !text-white'>{`Movisat`}</span>
        <span className='text-textSecondary !text-white'>{` © ${new Date().getFullYear()}. `}</span>
        <span className='text-textSecondary !text-white'>{`Todos os direitos reservados.`}</span>
      </Typography>
    </Grid>
  </Grid>
}

export default FooterContent
