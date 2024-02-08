import React, {ReactNode} from 'react';

type Props = {
    children: ReactNode,
}

function BlankLayout({children}: Props) {
    return (
        <div className='w-full h-full bg-gray-200'>
            {children}
        </div>
    );
}

export default BlankLayout;
