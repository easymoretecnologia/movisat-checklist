import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { clearUserToken } from '@/utils/auth'

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !session?.accessToken) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Clear the token from database
    const cleared = await clearUserToken(session.user.id, session.accessToken)
    
    if (cleared) {
      return NextResponse.json(
        { message: 'Logout realizado com sucesso' },
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      return NextResponse.json(
        { error: 'Erro ao fazer logout' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Handle logout from all devices
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Clear all tokens for the user
    const cleared = await clearUserToken(session.user.id)
    
    if (cleared) {
      return NextResponse.json(
        { message: 'Logout de todos os dispositivos realizado com sucesso' },
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      return NextResponse.json(
        { error: 'Erro ao fazer logout de todos os dispositivos' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Logout all error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 