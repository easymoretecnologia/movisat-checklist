import { PaletteColorOptions } from "@mui/material";

declare module '@mui/material/styles' {
    /* interface Palette {
        tertiary?: Palette['primary'];
        quaternary?: Palette['primary'];
    } */

    /* interface PaletteOptions {
        tertiary?: PaletteOptions['primary'];
        quaternary?: PaletteOptions['primary'];
    } */

    interface Typography {
        fontWeightBlack?: React.CSSProperties['fontWeight'];
    }

    interface TypographyOptions {
        fontWeightBlack?: React.CSSProperties['fontWeight'];
    }
}

declare module '@mui/material/Button' {
    /* interface ButtonPropsColorOverrides {
        tertiary: true;
        quaternary: true;
    } */
}

declare module '@mui/material/IconButton' {
    interface IconButtonPropsColorOverrides {
        /* tertiary: true;
        quaternary: true; */
        'gray.main': true;
    }
}