import SingleSlideTemplate from "@/app/components/custom/chapter/tabPanel/template/singleSlideTemplate";
import MultiSlideTemplate from "@/app/components/custom/chapter/tabPanel/template/multiSlideTemplate";
import {BlockSlide} from "@/app/types/block";

type props = {
    onDelete: () => void
    onCopy: () => void
    isShowAddButton?: boolean
    handleGetIndex?: () => void
    handleMultiCopy?: (type: string) => void
    block: BlockSlide
}

function SlideTemplate({
                           onCopy,
                           onDelete,
                           isShowAddButton,
                           handleMultiCopy,
                           handleGetIndex,
                           block,
                       }: props) {

    let thumb = block?.data?.pageObjectId || block?.data?.slides?.[0]?.objectId
    const isRange = Boolean(thumb.includes(','))

    return (
        <div className={'min-w-[600px] h-full'}>
            {isRange
                ? <MultiSlideTemplate
                    handleMultiCopy={handleMultiCopy}
                    handleGetIndex={handleGetIndex}
                    isShowAddButton={isShowAddButton}
                    block={block}
                    onDelete={onDelete}
                    onCopy={onCopy}
                />
                : <SingleSlideTemplate
                    handleMultiCopy={handleMultiCopy}
                    handleGetIndex={handleGetIndex}
                    isShowAddButton={isShowAddButton}
                    block={block}
                    onDelete={onDelete}
                    onCopy={onCopy}
                />
            }
        </div>
    );
}

export default SlideTemplate;
