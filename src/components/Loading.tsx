import { Box, Skeleton, SkeletonProps } from "@mui/material";
import { memo } from "react"

export type LoadingProps = {
    count: number;
    height: number;
    skeletonProps?: Omit<SkeletonProps, 'height'|'animation'|'variant'>;
}

export default memo(({ count, height, skeletonProps }: LoadingProps) => {
    const { sx = {}, ...sketprops } = skeletonProps || {};

    return <Box>
        {[...Array(count)].map((_, index) => (
            <Skeleton 
                key={index}
                variant='rectangular'
                animation='wave'
                height={height}
                sx={{ my: 3, bgcolor: "primary.100", borderRadius: 2, ...sx }}
                {...sketprops}
            />
        ))}
    </Box>
});