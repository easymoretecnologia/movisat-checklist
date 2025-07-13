// Component Imports
import LayoutFooter from '@layouts/components/vertical/Footer'
import FooterContent from './FooterContent'
import { palette } from '@/configs/themeConfig'

const Footer = () => {
  return (
    <LayoutFooter overrideStyles={{ backgroundColor: palette.primary.main, '& .ts-vertical-layout-footer-content-wrapper': { borderTopRightRadius: 10, borderTopLeftRadius: 10 } }}>
      <FooterContent />
    </LayoutFooter>
  )
}

export default Footer
