import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'



export default () => getServerSession(authOptions)