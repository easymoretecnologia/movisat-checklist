'use client'

import Inputs from '@/components/inputs'
import sweetalert from '@/utils/sweetalert'
import { Icon } from '@iconify/react'
import { Alert, alpha, Box, Button, Card, CardContent, Grid2 as Grid, IconButton, InputAdornment, Typography, useMediaQuery, useTheme } from '@mui/material'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'

const Page = () => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [show, setShow] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    sweetalert.loading()
    const res = await signIn('signinMovisat', { email, password, redirect: false })
    sweetalert.close()
    if (res && res.ok && res.error === null) {
      router.replace('/')
    } else {
      setError(res?.error ?? 'Não foi possível realizar a autenticação')
    }
  }

  return <Box className='flex flex-col bs-full justify-center items-center'>
    <Card sx={{ width: mobile ? '100%' : 500, borderRadius: 4, background: alpha('#FFF', .95) }}>
      <CardContent>
        <form noValidate autoComplete='off' onSubmit={onSubmit}>
          <Grid container spacing={6} justifyContent='center'>
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
              <img src='/images/logo-2.png' alt='Movisat' width='90%' height='auto' />
            </Grid>

            {error && (
              <Grid size={{ xs: 12, sm: 12 }}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 8 }}>
              <Inputs.TextField 
                label='Usuário'
                size='small'
                value={email}
                focused
                onChange={(e) => { setEmail(e.target.value); setError('') }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 8 }}>
              <Inputs.TextField 
                label='Senha'
                size='small'
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                type={show ? 'text' : 'password'}
                focused
                slotProps={{
                  input: {
                      endAdornment: (
                          <InputAdornment position='end'>
                              <IconButton size='small' onClick={() => setShow(!show)}>
                                  <Icon icon={show ? 'solar:eye-closed-linear' : 'solar:eye-linear'} fontSize={20} />
                              </IconButton>
                          </InputAdornment>
                      )
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Button color='primary' variant='contained' fullWidth type='submit'>
                Continuar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  </Box>
}

export default Page
