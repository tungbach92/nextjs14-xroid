'use client'

import React from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

type Props = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onClickTextButton: () => void
    onClickContainedButton: () => void
    title: string
    content: string
    titleTextButton: string
    titleContainedButton: string
}

function PageTransferConfirmationDialog({
                                            open,
                                            setOpen,
                                            onClickTextButton,
                                            onClickContainedButton,
                                            title,
                                            content,
                                            titleTextButton,
                                            titleContainedButton
                                        }: Props) {
    return (
        <Dialog
            open={open}
            fullWidth
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className='flex flex-col items-center justify-center gap-5 p-5 w-full'>
                <img src='/icons/warning-icon.svg' alt='warning-icon' className={'w-14 mb-3'}/>
                <label className={'text-base font-bold'}>{title}</label>
                <label className={'text-base font-medium'}>{content}</label>
                <div className={'w-full flex justify-center gap-6 mt-3'}>
                    <Button variant='text' onClick={onClickTextButton}>
                        {titleTextButton}
                    </Button>
                    <Button
                        variant='contained'
                        onClick={onClickContainedButton}
                        autoFocus
                    >
                        {titleContainedButton}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}

export default PageTransferConfirmationDialog;
