import { NextRequest, NextResponse } from 'next/server'
import { getDataSource } from '@/libs/typeorm.config'
import User from '@/entities/user.entity'
import Hash from '@/utils/hash'

// GET /api/usuarios - List all users
export async function GET() {
  try {
    const dataSource = await getDataSource()
    const usuarioRepository = dataSource.getRepository(User)

    const usuarios = await usuarioRepository.find({
      select: ['id', 'email', 'nome', 'cpf', 'telefone', 'created_at'], // Don't select password
      where: { status: 'active' } // Assuming you want only active users
    })

    return NextResponse.json({ 
      success: true, 
      data: usuarios 
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch users' 
    }, { status: 500 })
  }
}

// POST /api/usuarios - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, nome, cpf, telefone, id_empresa, tipo_acesso } = body

    // Validate required fields
    if (!email || !password || !nome) {
      return NextResponse.json({
        success: false,
        error: 'Email, password and nome are required'
      }, { status: 400 })
    }

    const dataSource = await getDataSource()
    const usuarioRepository = dataSource.getRepository(User)

    // Check if user already exists
    const existingUser = await usuarioRepository.findOne({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 400 })
    }

    // Hash password using Laravel-compatible hashing
    const hashedPassword = await Hash.make(password)

    // Create new user
    const newUser = usuarioRepository.create({
      email,
      password: hashedPassword, // Now properly hashed!
      nome,
      cpf,
      telefone,
      id_empresa: id_empresa || 1, // Default company ID
      tipo_acesso: tipo_acesso || 1, // Default access type
      status: 'active'
    })

    const savedUser = await usuarioRepository.save(newUser)

    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'User created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create user'
    }, { status: 500 })
  }
} 