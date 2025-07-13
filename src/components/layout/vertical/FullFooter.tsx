// Component Imports
import LayoutFooter from '@layouts/components/vertical/Footer'
import FooterContent from './FooterContent'
import { palette } from '@/configs/themeConfig'

const Footer = () => {
  return (
    <LayoutFooter overrideStyles={{ backgroundColor: palette.primary.main, width: '100%', maxInlineSize: '100% !important' }}>
      <FooterContent />
    </LayoutFooter>
  )
}

export default Footer
