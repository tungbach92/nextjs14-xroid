import {useEffect, useMemo, useState} from "react";
import {useCollection, useDocumentData} from "react-firebase-hooks/firestore";
import {blocksColRef, chaptersRef} from "@/app/common/firebase/dbRefs";
import {isEmpty, isEqual, orderBy} from "lodash";
import chapterPurchaseSetting, {ChapterWithPurChaseSetting} from "@/app/common/chapterPurchaseSetting";
import {CubeOptions} from "@/app/types/content";
import {doc, getDocs} from "firebase/firestore";
import {db} from "@/app/configs/firebase";
import {toDate} from "../../common/date";

export const useGetChapterByContentId = (contentId: string, cubeOptionsDraft?: CubeOptions) => {
    const docRef = contentId && doc(db, "contents", contentId);
    const [content] = useDocumentData(docRef);
    const [chapters, setChapters] = useState<ChapterWithPurChaseSetting[]>([])
    const [cubeOptions, setCubeOptions] = useState<CubeOptions>({})
    const _chaptersRef = contentId && chaptersRef(contentId)
    const [values, loadingChapters, error] = useCollection(_chaptersRef)

    useEffect(() => {
        if (!content || cubeOptionsDraft) return
        if (!isEqual(cubeOptions, content?.cubeOptions)) setCubeOptions(content?.cubeOptions)
    }, [content?.cubeOptions, cubeOptionsDraft])

    useEffect(() => {
        (async () => {
            if (error || loadingChapters || (!loadingChapters && !values))
                return setChapters(null);

            const _chapters = await Promise.all(values.docs.map(async (document) => {
                    const blocks = await getBlocks(document.data())
                    return {
                        ...document.data(),
                        id: document.id,
                        blocks
                    }
                }
            ))
            const sortedChapters = orderBy(_chapters, ["chapterIndex"], ["asc"])
            const chaptersWithNewIndex = sortedChapters?.map((item, index) => {
                return {
                    ...item,
                    chapterIndex: index
                }
            })
            // @ts-ignore
            setChapters(chaptersWithNewIndex)
        })()
    }, [values, error, loadingChapters])

    const getBlocks = async (_chapter) => {
        try {
            const snapshots = await getDocs(_chapter && blocksColRef(_chapter.id))
            if (!snapshots.empty) {
                const blocks = snapshots.docs.map(doc => ({
                    ...doc.data(),
                    updatedAt: toDate(doc.data().updatedAt),
                    createdAt: toDate(doc.data().createdAt)
                }))
                return blocks
            }
            return []
        } catch (e) {
            console.log(e);
            return []
        }
    }

    const chaptersWithCubeSetting = useMemo(() => {
        if (isEmpty(cubeOptions) && !cubeOptionsDraft) return chapters
        if (cubeOptionsDraft) return chapterPurchaseSetting(chapters, cubeOptionsDraft)
        return chapterPurchaseSetting(chapters, cubeOptions)
    }, [chapters, cubeOptions, cubeOptionsDraft])
    return {chapters: chaptersWithCubeSetting, setChapters, loadingChapters, error};
}
