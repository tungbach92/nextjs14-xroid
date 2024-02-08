import {cloneDeep} from "lodash";
import {
  createDataStructureList,
  deleteDataStructureList,
  updateDataStructureList
} from "@/app/common/commonApis/dataStructure";
import {toast} from "react-toastify";
import {SetStateAction} from "react";
import {DataStructure} from "@/app/types/types";

interface Props {
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
  listDataStructure: DataStructure[]
  listDataStructureOld: DataStructure[]
  checkValidate: () => boolean
  selectedStructFolderId: string
  getListDataStructure: () => Promise<void>
}

export const handleSubmitStructures = async ({
  setIsLoading,
  listDataStructureOld,
  listDataStructure,
  getListDataStructure,
  selectedStructFolderId,
  checkValidate
}: Props) => {
  setIsLoading(true)
  let arr1 = cloneDeep(listDataStructure)
  let arr2 = cloneDeep(listDataStructureOld)
  let arrWithSameId = [], arrWithDiffId = []
  //validate
  if (checkValidate()) return setIsLoading(false)
  //check data is update or create
  arr1.forEach(obj1 => {
    const obj2 = arr2.find(obj2 => obj2.id === obj1.id);
    if (obj2) {
      arrWithSameId.push({...obj1, ...obj2});
    } else {
      arrWithDiffId.push(obj1);
    }
  });
  let _arrWithDiffId = []
  arr1.forEach((obj1, index) => {
    const arrWithDiffIdAddNewIndex = arrWithDiffId.find(obj2 => obj2.id === obj1.id);
    if (arrWithDiffIdAddNewIndex) {
      arrWithDiffIdAddNewIndex.index = index
      _arrWithDiffId.push(arrWithDiffIdAddNewIndex)
    }
  })
  let [createList, updateList, deleteList] = [[], [], []]
  if (_arrWithDiffId?.length) {
    createList = _arrWithDiffId?.map((data) => {
      if (data?.isDeleted) return
      return {
        name: data?.name,
        items: data?.items,
        index: data?.index,
        folderId: selectedStructFolderId
      }
    })
  }
  if (arrWithSameId?.length) {
    arrWithSameId.forEach((data) => {
      const index = listDataStructure.findIndex(val => val.id === data.id)
      if (index > -1 && JSON.stringify(listDataStructure[index]) !== JSON.stringify(data)) {
        let dataUpdate = listDataStructure[index]
        if (dataUpdate?.isDeleted) {
          deleteList.push(dataUpdate.id)
          return
        }
        updateList.push({
          id: dataUpdate.id,
          name: dataUpdate.name,
          items: dataUpdate.items,
          index: dataUpdate.index
        })
      }
    })
  }

  let promise = []
  if (createList?.length) promise.push(createDataStructureList(createList))
  if (updateList?.length) promise.push(updateDataStructureList(updateList))
  if (deleteList?.length) promise.push(deleteDataStructureList(deleteList))

  Promise.all(promise).then((res) => {
    getListDataStructure().then()
    toast.success('保存しました', {autoClose: 3000});
  }).catch((err) => {
    console.log(err);
    toast.error('保存に失敗しました', {autoClose: 3000});
    setIsLoading(false)
  })
}
