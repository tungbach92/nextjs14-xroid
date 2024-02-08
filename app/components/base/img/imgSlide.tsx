import React, {memo} from "react";

export const SlidePageThumb: React.FC<{ pageThumbnail: string, className?: string }> = memo(function _T({
                                                                                                            pageThumbnail,
                                                                                                            className
                                                                                                        }: { pageThumbnail: string, className?: string }) {
    if (!pageThumbnail)
        return null;
    return <img src={pageThumbnail} className={`${className}`} alt={""}/>
})
