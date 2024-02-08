import {cloneDeep} from "lodash";
import {BlockUroid, DataUroid} from "@/app/types/block";
import {useAtom, useSetAtom} from "jotai";
import {readWriteBlocksAtom} from "@/app/store/atom/blocks.atom";
import {ReactElement, useState} from "react";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";

interface Render {
  handleChangeField?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleCheckField?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleUploadImage?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>,
  loading?: boolean
}

interface Props {
  block: BlockUroid
  render: ({handleChangeField, handleCheckField, handleUploadImage, loading}: Render) => ReactElement;
}

export const UroidCommonTemplate = ({block, render}: Props) => {
  const updateBlocks = useSetAtom(readWriteBlocksAtom)
  const [loading, setLoading] = useState<boolean>(false)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const handleCheckField = (e) => {
    const _block = cloneDeep(block)
    const dataUroid = _block.data as DataUroid
    dataUroid.isUserAction = e.target.checked
    _block.data = dataUroid
    updateBlocks(_block)
  }
  const handleChangeField = (e) => {
    const name = e.target.name
    const _block = cloneDeep(block)
    const dataUroid = _block.data as DataUroid
    dataUroid[name] = e.target.value
    _block.data = dataUroid
    updateBlocks(_block)
  }

  const handleUploadImage = async (e) => {
    if (e.target?.files?.length === 0) return

    try {
      setLoading(true)
      const name = e.target.name
      const _block = cloneDeep(block)
      const url = await handleUploadFile(e.target?.files?.[0], userInfo?.user_id)
      _block.data[name] = url
      updateBlocks(_block)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    render({handleChangeField, handleCheckField, handleUploadImage, loading})
  )
}
