import CredentialProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import axios from '@/utils/axios'
import Http from '@/enums/http'
import ValidateException from "@/handlers/validate-exception"
import useDatabase from '@/hooks/useDatabase'
import User from '@/entities/user.entity'
import { randomBytes } from 'crypto'
import Hash from '@/utils/hash'
import useLog from '@/hooks/useLog'

// Generate a random access token
const generateAccessToken = (): string => {
  return randomBytes(40).toString('hex')
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development-only-change-in-production',
  providers: [
    CredentialProvider({
      id: 'signinMovisat',
      name: 'signinMovisat',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: '' },
        password: { label: 'Senha', type: 'password', placeholder: '' },
      },
      async authorize (credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const { email, password } = credentials

        try {
          const dataSource = await useDatabase()
          const usuarioRepository = dataSource.getRepository(User)

          // Find user by email using TypeORM Repository
          const user = await usuarioRepository.findOne({
            where: { email }
          })

          if (!user) {
            throw new Error('Usuário não encontrado')
          }

          const isValidPassword = await Hash.check(password, user.password)

          if (!isValidPassword) {
            throw new Error('Usuário ou senha inválidos')
          }

          // Generate access token
          const accessToken = generateAccessToken()

          // Save token to database for persistence (similar to Laravel Sanctum)
          await usuarioRepository.update(user.id, {
            remember_token: accessToken
          })

          // Return user object with access token
          return {
            id: user.id.toString(), // Convert to string for NextAuth compatibility
            email: user.email,
            nome: user.nome,
            tipo_acesso: user.tipo_acesso,
            id_empresa: user.id_empresa,
            accessToken
          } as any

        } catch (error) {
          console.error('Authentication error:', error)
          throw new Error(error instanceof Error ? error.message : 'Erro na autenticação')
        }
      }
    }),
  ],

  session: {
    strategy: 'jwt', // Use JWT strategy for session persistence
    maxAge: 60 * 60 * 24 * 3 // 3 days
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    async jwt ({ token, user, trigger }) {
      if (token && token.accessToken) {
        try {
          // Use dynamic import to avoid "No metadata for \"User\" was found."
          const { default: useDatabase } = await import('@/hooks/useDatabase')
          const { default: User } = await import('@/entities/user.entity')
          const dataSource = await useDatabase()
          const usuarioRepository = dataSource.getRepository(User)
          
          const dbUser = await usuarioRepository.findOne({
            where: { 
              id: token.id as number,
              remember_token: token.accessToken as string
            }
          })
          
          if (!dbUser) {
            return {
              name: undefined,
              email: undefined,
              sub: undefined
            } as any
          }

          token = {
            ...token,
            email: dbUser.email,
            nome: dbUser.nome,
            tipo_acesso: dbUser.tipo_acesso,
            id_empresa: dbUser.id_empresa,
            accessToken: token.accessToken
          }

          return token
        } catch (error) {
          useLog(error)
          console.log(error)
          return {
            name: undefined,
            email: undefined,
            sub: undefined
          } as any
        }
      } else if (user && user.accessToken && user.id) {
        token = { ...token, ...user as any }
      }

      return token
    },

    async session({ session, user, token, ...props }) {
      if (token && token.accessToken) {
        try {
          // Use dynamic import to avoid "No metadata for \"User\" was found."
          const { default: useDatabase } = await import('@/hooks/useDatabase')
          const { default: User } = await import('@/entities/user.entity')
          const dataSource = await useDatabase()
          const usuarioRepository = dataSource.getRepository(User)
          
          const dbUser = await usuarioRepository.findOne({
            where: { 
              id: token.id as number,
              remember_token: token.accessToken as string
            }
          })
  
          if (!dbUser) {
            return {
              name: undefined,
              email: undefined,
              sub: undefined
            } as any
          }

          session.accessToken = token.accessToken as string
          session.user = {
            ...session.user,
            id: dbUser.id,
            id_empresa: dbUser.id_empresa,
            nome: dbUser.nome,
            email: dbUser.email,
            tipo_acesso: dbUser.tipo_acesso,
            accessToken: token.accessToken as string
          } as any

          return session
        } catch (error) {
          useLog(error)
          console.log(error)
          return {
            name: undefined,
            email: undefined,
            sub: undefined
          } as any
        }
      }

      return session
    }
  }
}
