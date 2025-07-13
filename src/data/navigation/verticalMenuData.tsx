// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Home',
    href: '/',
    icon: 'bx-home'
  },
  {
    label: 'About',
    href: '/about',
    icon: 'bx-info-circle'
  }
]

export default verticalMenuData
