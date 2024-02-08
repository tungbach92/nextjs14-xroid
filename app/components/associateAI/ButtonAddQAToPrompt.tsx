import React, {useEffect, useState} from 'react';
import Modal from "@/app/components/custom/Modal";
import {Button, CircularProgress} from "@mui/material";
import Qa_DocList from "@/app/components/associateAI/Qa_DocList";
import OpenAiGPTDialog from "@/app/components/associateAI/OpenAIGPTDialog";
import AddIcon from "@mui/icons-material/Add";
import {useAtom} from "jotai/index";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useAssociateAIs} from "@/app/hooks/useAssociates";
import {QaDocTemplate} from "@/app/types/qaDocTemplate";
import {BlockPrompt, BlockPromptInput, BlockWithoutCharPrompt, BlockWithoutCharPromptInput} from "@/app/types/block";
import {cloneDeep} from "lodash";
import {blocksAtom} from "@/app/store/atom/blocks.atom";

type props = {
  selectedQaItem: QaDocTemplate,
  setSelectedQaItem: React.Dispatch<React.SetStateAction<QaDocTemplate>>
  block?: BlockPrompt | BlockPromptInput | BlockWithoutCharPrompt | BlockWithoutCharPromptInput
}

function ButtonAddQaToPrompt({selectedQaItem, setSelectedQaItem, block}: props) {
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const [openCreateQAModal, setOpenCreateQAModal] = useState<boolean>(false)
  const {associateAIs, loading} = useAssociateAIs(userInfo?.user_id)
  const maxIndex = associateAIs?.length ? Math.max(...associateAIs?.map((d) => d?.index)) : -1;
  const [openQaDocsModal, setOpenQaDocsModal] = useState<boolean>(false)
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const item = associateAIs?.find(item => item.id === block?.data?.qaId)

  useEffect(() => {
    if (block?.data?.qaId) {
      setSelectedQaItem(item)
    }
  }, [block?.data?.qaId]);

  const handleOpenQaDocsModal = () => {
    setOpenQaDocsModal(true)
    if (block?.data?.qaId) {
      setSelectedQaItem(item)
    } else {
      setSelectedQaItem(null)
    }
  }

  const handleCloseSelectQaDocsModal = () => {
    setOpenQaDocsModal(false)
    if (block?.data?.qaId) {
      setSelectedQaItem(item)
    } else {
      setSelectedQaItem(null)
    }
  }
  const handleSubmitQaDocsModal = () => {
    setOpenQaDocsModal(false)
    if (selectedQaItem) {
      const _blocks = cloneDeep(blocks)
      const index = _blocks?.findIndex(item => item.id === block?.id)
      _blocks[index].data = {
        ..._blocks[index].data,
        qaId: selectedQaItem?.id,
      }
      setBlocks(_blocks)
    }
  }


  return (
    <div className={'flex flex-col'}>
      <Button variant="contained"
              size={'small'}
              onClick={handleOpenQaDocsModal}
              startIcon={<AddIcon/>}
              className={'h-8 w-full'}>データ連携 AI</Button>
      <Modal open={openQaDocsModal}
             setOpen={setOpenQaDocsModal}
             title={'データ連携 AI'}
             handleClose={() => handleCloseSelectQaDocsModal()}
             onSubmit={() => handleSubmitQaDocsModal()}
             btnSubmit={'選択して追加'}
             isDisabled={selectedQaItem === item}
             dividers={false}
             btnCancel={''}
             actionPosition={'center'}
      >
        <div className={'px-5'}>
          {
            loading ? <CircularProgress size={20} className={'m-auto'}/> :
              <Qa_DocList
                showEditButton={true}
                inBlock={true}
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
      <OpenAiGPTDialog openModal={openCreateQAModal}
                       isUpdate={false}
                       setOpenModel={setOpenCreateQAModal}
                       userId={userInfo?.user_id}
                       index={maxIndex + 1}
      />
    </div>
  );
}

export default ButtonAddQaToPrompt;
