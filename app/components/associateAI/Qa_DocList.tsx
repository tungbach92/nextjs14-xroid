import React, {useState} from 'react';
import {Button, CircularProgress} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AssociateAiComp from "@/app/components/associateAI/AssociateAiComp";
import {QaDocTemplate} from "@/app/types/qaDocTemplate";

type props = {
  associateAIs?: QaDocTemplate[]
  userId?: string
  setOpenModel: React.Dispatch<React.SetStateAction<boolean>>
  width?: string
  loading?: boolean
  handleSelectItem?: (item: QaDocTemplate) => void
  selectedItem?: QaDocTemplate,
  inBlock?: boolean
  showEditButton?: boolean
}

function QaDocList({
                     associateAIs, userId, setOpenModel, width, loading,
                     handleSelectItem = () => {}, selectedItem, inBlock,showEditButton
                   }: props) {
  return (
    <div className={'flex flex-col'}>
      <Button variant="contained"
              startIcon={<AddIcon/>}
              color="primary"
              className={'w-fit mt-5'}
              onClick={() => setOpenModel(true)}>データ連携AI</Button>
      {
        loading ? <CircularProgress size={20} className={'m-auto'}/> :
          <div className={'flex flex-col gap-2 pt-5'}>
            {
              associateAIs ?
              associateAIs?.map((item, index) => {
                return (
                  <div key={item.id}
                       onClick={() => handleSelectItem(item)}
                       className={`${(selectedItem?.id === item?.id) ? 'rounded border-2 border-solid border-blue-400' : ''}
                       ${width === 'w-full' ? 'cursor-pointer' : ''}`}>
                    <AssociateAiComp item={item} userId={userId} width={width} inBlock={inBlock} showEditButton={showEditButton}/>
                  </div>
                )
              }) : null
            }
          </div>
      }
    </div>
  );
}

export default QaDocList;
