import {getFieldPath} from "@/app/common/getStructParentId";
import {DataStructure} from "@/app/types/types";
import {regexGetVar} from "@/app/configs/constants";

interface Props {
  inputValue: string
  structuresInChapter: DataStructure[]
}

export const getSelectedStructureItems = ({inputValue, structuresInChapter}: Props) => {
  let match;
  const indices = [];

  // Get list of var
  while ((match = regexGetVar.exec(inputValue)) !== null) {
    indices.push(match[0]);
  }

  //find the item match fieldPath and update the selected
  const _selectedStructureItems = []
  const items = structuresInChapter?.map(x => x.items).flat()
  indices.forEach(x => {
    const item = items?.find(y => x === `{{${getFieldPath(structuresInChapter, y.id)}}}`)
    if (item?.id) {
      _selectedStructureItems.push(item)
    }
  })
  return _selectedStructureItems
}
