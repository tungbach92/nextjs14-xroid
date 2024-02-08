import React from 'react';
import {TextField} from "@mui/material";
import {toNumber} from "lodash";
import Modal from "@/app/components/custom/Modal";
import {Chapter} from "@/app/types/types";
import {convertInputNumber} from "@/app/common/convertNumber";

type props = {
  openInput: boolean
  setOpenInput: React.Dispatch<React.SetStateAction<boolean>>
  setValueInput: React.Dispatch<React.SetStateAction<number>>
  valueInput: number
  chapter?: Chapter
  setChapter?: React.Dispatch<React.SetStateAction<any>>
}

function CubeInputComp({openInput, setOpenInput, setValueInput, valueInput, chapter, setChapter}: props) {
  const onChangeCube = () => {
    setOpenInput(false)
    setChapter({cube: valueInput})
  }
  return (
    <div>
      <Modal open={openInput}
             setOpen={setOpenInput}
             btnSubmit={'保存'}
             onSubmit={onChangeCube}
             handleClose={() => {
               setOpenInput(false)
               setValueInput(chapter?.cube || 0)
             }}
             title={'キューブ設定'}>
        <div className={'justify-items-center grid'}>
          <div className={'flex items-center'}>
            <div className={'pr-2'}>
              キューブ入力
            </div>
            <TextField
              inputProps={{min: 0}}
              type={'number'}
              value={convertInputNumber(valueInput)}
              size={'small'}
              onChange={(e) => setValueInput(toNumber(e.target.value))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CubeInputComp;
