import { Grid2, Grid2Props } from "@mui/material"
import React from "react"

export type PageHeaderProps = {
    title: string | React.ReactNode
    subtitle?: string | React.ReactNode
} & Omit<Grid2Props, 'container'|'spacing'|'item'|'title'|'subtitle'>

export default (props: PageHeaderProps) => {
    const { title, subtitle = '', ...rest } = props

    return (
        <Grid2 size={{ xs: 12 }} {...rest}>
            {title}
            {subtitle || null}
        </Grid2>
    )
}