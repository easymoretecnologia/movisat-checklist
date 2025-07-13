import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import axios from '@/utils/axios'

export const useAuth = () => {
    const { data: session, status, update } = useSession()
    const router = useRouter()
  
    const login = useCallback(async (email: string, password: string) => {
      try {
        const result = await signIn('signinMovisat', {
          email,
          password,
          redirect: false,
        })
  
        if (result?.error) {
          throw new Error(result.error)
        }
  
        if (result?.ok) {
          // Refresh session to get the new token
          await update()
          return { success: true }
        }
  
        throw new Error('Falha na autenticação')
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    }, [update])
  
    const logout = useCallback(async (allDevices = false) => {
      try {
        // Call our custom logout API to clear token from database
        if (allDevices) {
          await axios.delete({ url: '/api/auth/logout' })
        } else {
          await axios.post({ url: '/api/auth/logout' })
        }
      } catch (error) {
        console.error('Token cleanup error:', error)
        // Continue with logout even if token cleanup fails
      }
  
      // Sign out from NextAuth
      await signOut({ redirect: false })
      
      // Redirect to login page
      router.push('/login')
    }, [router])
  
    const logoutAllDevices = useCallback(async () => {
      await logout(true)
    }, [logout])
  
    const refreshSession = useCallback(async () => {
      await update()
    }, [update])
  
    return {
      user: session?.user,
      accessToken: session?.accessToken,
      isAuthenticated: !!session?.user,
      isLoading: status === 'loading',
      login,
      logout,
      logoutAllDevices,
      refreshSession,
      session
    }
  }