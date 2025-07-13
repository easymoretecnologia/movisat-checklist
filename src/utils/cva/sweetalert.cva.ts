import { cva } from 'class-variance-authority'

export default cva([], {
    variants: {
        color: {
            success: 'btn-emerald',
            error: 'btn-scarlet',
            warning: 'btn-amber',
            info: 'btn-alice-blue-400',
            common: 'btn-tangaroa',
        },
        outline: {
            true: 'outline',
            false: ''
        }
    },
    defaultVariants: {
        color: 'common',
        outline: false
    }
})