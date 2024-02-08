import React, {useState} from 'react';
import CardCustom from "@/app/components/custom/CardCustom";
import {useAtomValue} from "jotai";
import {BlockAssociateAI, DataAssociateAI} from "@/app/types/block";
import {chapterErrorAtom} from "@/app/store/atom/chapterError.atom";
import {Chapter} from "@/app/types/types";
import AssociateAiComp from "@/app/components/associateAI/AssociateAiComp";
import {QaDocTemplate} from "@/app/types/qaDocTemplate";
import {useAtom} from "jotai/index";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useAssociateAIs} from "@/app/hooks/useAssociates";
import {openQaDocsModalAtom} from "@/app/store/atom/openQaDocsModal.atom";
import {CircularProgress} from "@mui/material";
import Qa_DocList from "@/app/components/associateAI/Qa_DocList";
import Modal from "@/app/components/custom/Modal";
import {blocksAtom} from "@/app/store/atom/blocks.atom";
import {cloneDeep} from "lodash";

type props = {
  block: BlockAssociateAI
  onChange?: (p: any) => void
  onDelete: () => void
  onCopy: () => void
  isShowAddButton: boolean
  handleMultiCopy: (item: any) => void
  handleGetIndex: () => void
  chapter: Chapter

}
//*TODO: add type for block.data (if customer want to change logic)

function QaBlockTemplate({
                           block,
                           onDelete,
                           onCopy,
                           isShowAddButton,
                           handleMultiCopy,
                           handleGetIndex,
                           chapter
                         }: props) {
  const chapterError = useAtomValue(chapterErrorAtom)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const {associateAIs, loading} = useAssociateAIs(userInfo?.user_id)
  const renderData = associateAIs?.find(item => item.id === block.data.id)
  const [, setOpenCreateQAModal] = useAtom(openQaDocsModalAtom)
  const [selectedQaItem, setSelectedQaItem] = useState<QaDocTemplate>({})
  const [openQaDocsModal, setOpenQaDocsModal] = useState<boolean>(false)
  const [blocks, setBlocks] = useAtom(blocksAtom)


  const associateAiItem: QaDocTemplate = {
    id: block.data.id,
    model: renderData?.model,
    title: renderData?.title,
    gs_docs: renderData?.gs_docs,
    urls: renderData?.urls,
    ytlinks: renderData?.ytlinks,
    modelId: renderData?.modelId,
    userId: renderData?.userId,
    index: renderData?.index,
  }


  const handleSubmitQaDocsModal = () => {
    const newBlocks = cloneDeep(blocks)
    const newBlock = newBlocks.find(item => item.id === block.id)
    const newBlockData = newBlock?.data as DataAssociateAI
    newBlockData.id = selectedQaItem?.id || ''
    setBlocks(newBlocks)
    setOpenQaDocsModal(false)
  }

  const handleCloseQaDocsModal = () => {
    setOpenQaDocsModal(false)
    setSelectedQaItem(associateAiItem)
  }

  const openEdit = () => {
    setOpenQaDocsModal(true)
    setSelectedQaItem(associateAiItem)
  }

  return (
    <div>
      <CardCustom isCopy={true} onCopy={onCopy}
                  block={block} isShowAddButton={isShowAddButton}
                  handleMultiCopy={handleMultiCopy}
                  handleGetIndex={handleGetIndex}
                  onDelete={onDelete}
                  title={'Q&A_Doc'}
                  color={'#74AA9C'}
                  className={`border-2 border-solid border-[#74AA9C] min-w-[400px] max-w-[400px] 2xl:min-w-[600px] 2xl:max-w-[600px] w-full ${(chapterError.hasVersionUserChoice || chapterError.hasVersionSetting) && 'border-red-500'}`}
      >
        <div className={'pt-3'}>
          <AssociateAiComp item={associateAiItem}
                           inBlock={true}
                           // onEdit={() => openEdit()}
                           width={'w-full'}/>
        </div>
        <Modal open={openQaDocsModal}
               setOpen={setOpenQaDocsModal}
               title={'データ連携 AI'}
               handleClose={() => handleCloseQaDocsModal()}
               onSubmit={() => handleSubmitQaDocsModal()}
               btnSubmit={'選択して追加'}
               isDisabled={!selectedQaItem}
               dividers={false}
               btnCancel={''}
               actionPosition={'center'}
        >
          <div className={'px-5'}>
            {
              loading ? <CircularProgress size={20} className={'m-auto'}/> :
                <Qa_DocList
                  inBlock={false}
                  handleSelectItem={(item) => setSelectedQaItem(item)}
                  selectedItem={selectedQaItem}
                  loading={loading}
                  setOpenModel={setOpenCreateQAModal}
                  width={'w-full'}
                  userId={userInfo?.user_id}
                  associateAIs={associateAIs}/>
            }
          </div>
        </Modal>
      </CardCustom>
    </div>
  );
}

export default QaBlockTemplate;
