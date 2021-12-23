import React, { ComponentProps, Ref } from 'react'

import './loading-theme.scss';

export interface LoadingButtonProps extends ComponentProps<'button'> {
    forwardedRef?: Ref<any>;
    loading?: boolean;
    text?: any;
}

export default function LoadingButton(props: LoadingButtonProps) {
    const {forwardedRef, loading, text, children, ...args} = props;
    
    return (
        <button
            {...args}
            ref={forwardedRef}
        >
            {children ?
                (loading ?
                    <div className={loading ? "loading" : ""}>
                        <div>{children}</div>
                        {loading && <div className="spinner"></div>}
                    </div>
                    :
                    children
                )
                :
                <div className={loading ? "loading" : ""}>
                    <div>{text}</div>
                    {loading && <div className="spinner"></div>}
                </div>
            }
        </button>
    )
}