'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuthClient'
import { Button, TextField, Box, Typography, Alert, CircularProgress } from '@mui/material'

export default function AuthExample() {
  const { user, isAuthenticated, isLoading, login, logout, logoutAllDevices } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError('')

    try {
      await login(email, password)
      setEmail('')
      setPassword('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleLogoutAllDevices = async () => {
    try {
      await logoutAllDevices()
    } catch (error) {
      console.error('Logout all devices error:', error)
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (isAuthenticated && user) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Bem-vindo, {user.nome}!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Email: {user.email}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Tipo de Acesso: {user.tipo_acesso}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" gutterBottom>
          ID da Empresa: {user.id_empresa}
        </Typography>

        <Box mt={2} display="flex" gap={2}>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
          <Button variant="outlined" color="warning" onClick={handleLogoutAllDevices}>
            Logout de Todos os Dispositivos
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box p={3} maxWidth={400}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          disabled={loginLoading}
        />
        
        <TextField
          fullWidth
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          disabled={loginLoading}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          disabled={loginLoading}
        >
          {loginLoading ? <CircularProgress size={24} /> : 'Entrar'}
        </Button>
      </form>
    </Box>
  )
} 