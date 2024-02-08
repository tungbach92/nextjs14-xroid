import {DataStructure} from "@/app/types/types";
import {SetStateAction} from "react";
import {isFunction} from "lodash";

interface Props {
  listDataStructure: DataStructure[]
  setIdValidate?: React.Dispatch<SetStateAction<string[]>>
}

export const checkValidateStructures = ({listDataStructure, setIdValidate}: Props) => {
  let i = 0
  let _idValidate = []
  listDataStructure.length > 0 && listDataStructure.map((val) => {
    if (!val?.name && !val?.isDeleted) {
      i++
      _idValidate.push(val.id)
    }
  })
  isFunction(setIdValidate) && setIdValidate(_idValidate)
  if (_idValidate.length) {
    scrollToErr(_idValidate)
  }
  return i > 0;
}

function scrollToErr(idVal) {
  const element = document.getElementById(idVal?.[0]);
  element?.scrollIntoView({behavior: 'smooth', inline: 'center'});
}
