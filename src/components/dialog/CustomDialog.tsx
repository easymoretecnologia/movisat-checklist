import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, SxProps, Theme, Typography, TypographyProps } from "@mui/material";
import { ReactNode, useCallback, useState } from "react";

export interface CustomDialogProps {
    open: boolean;
    title?: string;
    titleProps?: TypographyProps;
    content: string|ReactNode;
    hasAction?: boolean;
    onAction?: () => void;
    actionTitle?: string;
    actionColor?: "primary" | "secondary" | "error" | "inherit" | "success" | "info" | "warning";
    hasSecondaryAction?: boolean;
    onSecondaryAction?: () => void;
    secondaryActionTitle?: string;
    secondaryActionColor?: "primary" | "secondary" | "error" | "inherit" | "success" | "info" | "warning";
    hasCancel?: boolean;
    onClose?: () => void;
    cancelTitle?: string;
    cancelColor?: "primary" | "secondary" | "error" | "inherit" | "success" | "info" | "warning";
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    dialogProps?: Omit<DialogProps, 'open' | 'onClose' | 'children'>;
    fullScreen?: boolean;
    actionSize?: 'large' | 'medium' | 'small';
}

export default ({ 
    open, 
    title = '', 
    titleProps = {},
    content, 
    hasAction = true, 
    onAction = () => {}, 
    actionTitle = 'Confirmar', 
    actionColor = 'primary', 
    hasSecondaryAction = false,
    onSecondaryAction = () => {},
    secondaryActionTitle = 'Confirmar',
    secondaryActionColor = 'primary',
    hasCancel = true, 
    onClose = () => {}, 
    cancelTitle = 'Cancelar', 
    cancelColor = 'error',
    maxWidth = 'sm',
    dialogProps = {},
    fullScreen = false,
    actionSize = 'medium',
}: CustomDialogProps) => {
    const { sx: sxTitle = {}, ...restTitleProps } = titleProps;
    const { sx: sxDialog = {}, ...restDialogProps } = dialogProps;
    
    return <Dialog fullWidth fullScreen={fullScreen} maxWidth={maxWidth} open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { border: 'none', boxShadow: 'none', borderRadius: fullScreen ? 0 : 2 }, ...sxDialog }} {...restDialogProps}>
        {title ? <DialogTitle {...restTitleProps} sx={{ fontWeight: '700 !important', fontSize: '1.5rem !important', color: theme => theme.palette.primary.main, ...sxTitle }}>
            {title}
        </DialogTitle> : null}
        <DialogContent>
            {content}
        </DialogContent>
        {(hasAction || hasCancel || hasSecondaryAction) && (
            <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                {hasCancel && (
                    <Button onClick={onClose} color={cancelColor} size={actionSize}>
                        {cancelTitle}
                    </Button>
                )}
                {hasSecondaryAction && (
                    <Button onClick={onSecondaryAction} color={secondaryActionColor} size={actionSize}>
                        {secondaryActionTitle}
                    </Button>
                )}
                {hasAction && (
                    <Button onClick={onAction} color={actionColor} size={actionSize}>
                        {actionTitle}
                    </Button>
                )}
            </DialogActions>
        )}
    </Dialog>
}

export type useDialogProps = CustomDialogProps & { openDialog: (props: CustomDialogProps) => void; closeDialog: () => void; };

export const useDialog = (): useDialogProps => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [titleProps, setTitleProps] = useState<TypographyProps>({});
    const [content, setContent] = useState<string|ReactNode>('');
    const [hasAction, setHasAction] = useState(true);
    const [onAction, setOnAction] = useState(() => {});
    const [actionTitle, setActionTitle] = useState('Confirmar');
    const [actionColor, setActionColor] = useState('primary');
    const [hasSecondaryAction, setHasSecondaryAction] = useState(false);
    const [onSecondaryAction, setOnSecondaryAction] = useState(() => {});
    const [secondaryActionTitle, setSecondaryActionTitle] = useState('Confirmar');
    const [secondaryActionColor, setSecondaryActionColor] = useState('primary');
    const [hasCancel, setHasCancel] = useState(true);
    const [onClose, setOnClose] = useState(() => {});
    const [cancelTitle, setCancelTitle] = useState('Cancelar');
    const [cancelColor, setCancelColor] = useState('error');
    const [maxWidth, setMaxWidth] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('sm');
    const [dialogProps, setDialogProps] = useState<Omit<DialogProps, 'open' | 'onClose' | 'children'>>({});
    const [fullScreen, setFullScreen] = useState(false);
    const [actionSize, setActionSize] = useState<'large' | 'medium' | 'small'>('medium');

    const openDialog = useCallback((props: CustomDialogProps) => {
        setOpen(true);
        setTitle(props.title ?? '');
        setTitleProps(props.titleProps ?? {});
        setContent(props.content);
        setHasAction(props.hasAction ?? true);
        setOnAction(() => props.onAction ?? (() => {})); // Set the function in a callback to avoid immediate invocation
        setActionTitle(props.actionTitle ?? 'Confirmar');
        setActionColor(props.actionColor ?? 'primary');
        setHasSecondaryAction(props.hasSecondaryAction ?? false);
        setOnSecondaryAction(() => props.onSecondaryAction ?? (() => {}));
        setSecondaryActionTitle(props.secondaryActionTitle ?? 'Confirmar');
        setSecondaryActionColor(props.secondaryActionColor ?? 'primary');
        setHasCancel(props.hasCancel ?? true);
        setOnClose(() => props.onClose ?? (() => {})); // Wrap in a callback as well
        setCancelTitle(props.cancelTitle ?? 'Cancelar');
        setCancelColor(props.cancelColor ?? 'error');
        setMaxWidth(props.maxWidth ?? 'sm');
        setDialogProps(props.dialogProps ?? {});
        setFullScreen(props.fullScreen ?? false);
        setActionSize(props.actionSize ?? 'medium');
    }, []);

    const closeDialog = useCallback(() => {
        setOpen(false);
        setTitle('');
        setTitleProps({});
        setContent('');
        setHasAction(true);
        setOnAction(() => {});
        setActionTitle('Confirmar');
        setActionColor('primary');
        setHasSecondaryAction(false);
        setOnSecondaryAction(() => {});
        setSecondaryActionTitle('Confirmar');
        setSecondaryActionColor('primary');
        setHasCancel(true);
        setOnClose(() => {});
        setCancelTitle('Cancelar');
        setCancelColor('error');
        setMaxWidth('sm');
        setDialogProps({});
        setFullScreen(false);
        setActionSize('medium');
    }, []);

    return { 
        open, 
        title, 
        titleProps,
        content, 
        hasAction, 
        onAction, 
        actionTitle, 
        actionColor, 
        hasSecondaryAction,
        onSecondaryAction,
        secondaryActionTitle,
        secondaryActionColor,
        hasCancel, 
        onClose, 
        cancelTitle, 
        cancelColor, 
        openDialog, 
        closeDialog,
        maxWidth, 
        dialogProps,
        fullScreen,
        actionSize,
    } as useDialogProps;
}

export const defaultDialogSx: SxProps<Theme> = {
    '& .MuiPaper-root': { 
        border: 'none', 
        boxShadow: 'none', 
        borderRadius: '1rem' 
    } 
}