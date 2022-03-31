import { DialogProps as MuiDialogProps } from '@mui/material/Dialog';
export declare type DialogProps = Pick<MuiDialogProps, 'open' | 'scroll'>;
export declare const Dialog: ({ scroll, ...props }: DialogProps) => JSX.Element;