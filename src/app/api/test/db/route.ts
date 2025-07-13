import { NextRequest, NextResponse } from 'next/server'
import useDatabase from '@/hooks/useDatabase'
import User from '@/entities/user.entity'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...')
    
    // Test database connection
    const dataSource = await useDatabase()
    
    if (!dataSource.isInitialized) {
      throw new Error('Database not initialized')
    }
    
    console.log('Database connected successfully')
    
    // Test basic query
    const usuarioRepository = dataSource.getRepository(User)
    const userCount = await usuarioRepository.count()
    
    console.log(`Found ${userCount} users in database`)
    
    return NextResponse.json(
      { 
        message: 'Database connection successful',
        userCount,
        isConnected: dataSource.isInitialized,
        databaseName: dataSource.options.database
      },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Database test error:', error)
    
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 