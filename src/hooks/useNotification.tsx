import { palette } from "@/configs/themeConfig"
import { toast } from "@/utils/sweetalert"
import { Icon, IconProps } from "@iconify/react/dist/iconify.js"
import { Typography } from "@mui/material"

export default () => {
    return {
        message: (data: { icon: string, iconStyle?: IconProps['style'], message: string }) => {
            return toast.raw({
                iconHtml: <Icon icon={data.icon} fontSize={32} style={{ color: palette.primary.main, ...(data.iconStyle ?? {}) }} />,
                html: <Typography>
                    <span dangerouslySetInnerHTML={{ __html: data.message }} />
                </Typography>
            })
        }
    }
}