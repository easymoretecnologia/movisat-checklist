// MUI Imports
import { palette } from '@/configs/themeConfig'
import type { Theme } from '@mui/material/styles'

const tooltip: Theme['components'] = {
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        borderRadius: 'var(--mui-shape-customBorderRadius-sm)',
        /* borderColor: 'var(--port-gore)',
        borderWidth: '1px',
        borderStyle: 'solid', */
        boxShadow: 'var(--mui-customShadows-lg)',
        fontSize: theme.typography.subtitle2.fontSize,
        lineHeight: 1.539,
        color: palette.grey[900],
        paddingInline: theme.spacing(3),
        paddingBlock: 5
      }),
      popper: {
        '&[data-popper-placement*="bottom"] .MuiTooltip-tooltip': {
          marginTop: '6px !important'
        },
        '&[data-popper-placement*="top"] .MuiTooltip-tooltip': {
          marginBottom: '6px !important'
        },
        '&[data-popper-placement*="left"] .MuiTooltip-tooltip': {
          marginRight: '6px !important'
        },
        '&[data-popper-placement*="right"] .MuiTooltip-tooltip': {
          marginLeft: '6px !important'
        }
      }
    }
  }
}

export default tooltip
