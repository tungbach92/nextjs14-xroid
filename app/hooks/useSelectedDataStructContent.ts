import {useEffect} from "react";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {
  newDataStructureAtom,
  selectedDataStructureContentAtom,
  structureDataAtom
} from "@/app/store/atom/structureData.atom";
import {Content} from "@/app/types/content";

interface Props {
  content: Content
}

export default function useSelectedDataStructContent({content}:Props) {
  const dataStructures = useAtomValue(structureDataAtom);
  const setSelectedDataStructureContent = useSetAtom(selectedDataStructureContentAtom);
  const [newDataStructures, setNewDataStructures] = useAtom(newDataStructureAtom);

  useEffect(() => {
    const _newDataStructures = dataStructures?.map(data => content?.dataStructureIds?.some(id => id === data.id) ? ({
      ...data,
      isCheck: true
    }) : ({
      ...data, isCheck: false
    }))
    setNewDataStructures(_newDataStructures)
  }, [dataStructures, content?.dataStructureIds])

  useEffect(() => {
    const selectedDataStructureContent = newDataStructures?.filter(data => data.isCheck === true) || []
    setSelectedDataStructureContent(selectedDataStructureContent)
  }, [newDataStructures])
}
