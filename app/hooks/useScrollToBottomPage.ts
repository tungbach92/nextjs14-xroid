import {MutableRefObject, useEffect, useRef, useState} from "react";
import {VirtuosoHandle} from "react-virtuoso";

interface Props {
  virtuosoRef?: MutableRefObject<VirtuosoHandle>
}

export const useScrollToBottomPage = ({virtuosoRef}: Props) => {
  const isFirstRun = useRef(true);
  const [dummyAdd, setDummyAdd] = useState<number>(0)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (typeof window !== 'undefined' && typeof document !== 'undefined' && Boolean(dummyAdd)) {
      // window.scrollTo(0, document.body.scrollHeight);
      virtuosoRef?.current?.scrollToIndex({
        index: 'LAST',
        behavior: "auto"
      })
    }
  }, [dummyAdd])

  return {setDummyAdd}
}
