import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import useDatabase from '@/hooks/useDatabase'
import User from '@/entities/user.entity'

/**
 * Clear user's remember token from database (similar to Laravel Sanctum token revocation)
 */
export async function clearUserToken(userId: number, accessToken?: string) {
  try {
    const dataSource = await useDatabase()
    const usuarioRepository = dataSource.getRepository(User)
    
    const updateData: Partial<User> = { remember_token: '' }
    
    if (accessToken) {
      // Clear specific token
      await usuarioRepository.update(
        { id: userId, remember_token: accessToken },
        updateData
      )
    } else {
      // Clear all tokens for user
      await usuarioRepository.update(userId, updateData)
    }
    
    return true
  } catch (error) {
    console.error('Error clearing user token:', error)
    return false
  }
}

/**
 * Get current authenticated user session
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    return session?.user || null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Validate if user token exists in database
 */
export async function validateUserToken(userId: number, accessToken: string): Promise<boolean> {
  try {
    const dataSource = await useDatabase()
    const usuarioRepository = dataSource.getRepository(User)
    
    const user = await usuarioRepository.findOne({
      where: { 
        id: userId,
        remember_token: accessToken
      }
    })
    
    return !!user
  } catch (error) {
    console.error('Error validating user token:', error)
    return false
  }
}

/**
 * Revoke all tokens for a user (useful for logout from all devices)
 */
export async function revokeAllUserTokens(userId: number): Promise<boolean> {
  return await clearUserToken(userId)
} 