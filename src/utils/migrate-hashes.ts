import useDatabase from '@/hooks/useDatabase'
import User from '@/entities/user.entity'

/**
 * Migration utility to convert existing Node.js bcrypt hashes ($2b$) 
 * to Laravel-compatible format ($2y$)
 * 
 * Run this if you have existing users with $2b$ hashes that need to work with Laravel
 */

export async function migrateHashesToLaravelFormat(): Promise<{
  processed: number
  converted: number
  errors: number
}> {
  const dataSource = await useDatabase()
  const userRepository = dataSource.getRepository(User)
  
  let processed = 0
  let converted = 0
  let errors = 0
  
  console.log('🔄 Starting hash migration to Laravel format...')
  
  try {
    // Get all users
    const users = await userRepository.find({
      select: ['id', 'password']
    })
    
    console.log(`📊 Found ${users.length} users to process`)
    
    for (const user of users) {
      processed++
      
      try {
        // Check if hash uses Node.js format ($2b$)
        if (user.password?.startsWith('$2b$')) {
          // Convert to Laravel format ($2y$)
          const laravelHash = user.password.replace('$2b$', '$2y$')
          
          // Update in database
          await userRepository.update(user.id, {
            password: laravelHash
          })
          
          converted++
          console.log(`✅ Converted hash for user ID: ${user.id}`)
        } else if (user.password?.startsWith('$2y$')) {
          console.log(`⏭️  User ID ${user.id} already has Laravel format`)
        } else {
          console.log(`⚠️  User ID ${user.id} has unknown hash format: ${user.password?.substring(0, 4)}`)
        }
      } catch (error) {
        errors++
        console.error(`❌ Error processing user ID ${user.id}:`, error)
      }
    }
    
    console.log('\n🎉 Migration completed!')
    console.log(`📈 Summary:`)
    console.log(`   - Processed: ${processed} users`)
    console.log(`   - Converted: ${converted} hashes`)
    console.log(`   - Errors: ${errors}`)
    
    return { processed, converted, errors }
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
    throw error
  }
}

// Export as default for easy importing
export default migrateHashesToLaravelFormat 