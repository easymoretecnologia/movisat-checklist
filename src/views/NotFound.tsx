'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const NotFound = () => {
  return (
    <div className='flex items-center flex-col text-center justify-center min-bs-[100dvh] p-6'>
      <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6'>
        <Typography variant='h1' className='text-8xl'>
          404
        </Typography>
        <Typography variant='h4'>Página Não encontrada ⚠️</Typography>
        <Typography>Não conseguindos encontrar a página que você procura.</Typography>
      </div>
      <Button href='/' component={Link} variant='contained'>
        Voltar para a página inicial
      </Button>
    </div>
  )
}

export default NotFound
