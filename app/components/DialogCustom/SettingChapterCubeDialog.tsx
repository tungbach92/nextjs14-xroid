import React from 'react';
import {TextField} from "@mui/material";
import {convertInputNumber} from "@/app/common/convertNumber";
import {toNumber} from "lodash";
import Modal from "@/app/components/custom/Modal";


type Props = {
  openChangeCube: boolean,
  setOpenChangeCube: React.Dispatch<React.SetStateAction<boolean>>
  onChangeCube?: () => void
  cube: number,
  setCube?: React.Dispatch<React.SetStateAction<number>>
}

function SettingChapterCubeDialog({
                                    cube = 0,
                                    setCube,
                                    openChangeCube,
                                    setOpenChangeCube,
                                    onChangeCube
                                  }: Props) {


  return (
    <Modal open={openChangeCube}
           setOpen={setOpenChangeCube}
           btnSubmit={'保存'}
           onSubmit={onChangeCube}
           handleClose={() => {
             setOpenChangeCube(false)
             setCube(0)
           }}
           dividers={false}
           title={''}>
      <div className={'justify-items-center grid'}>
        <div className={'flex items-center'}>
          <div className={'pr-2'}>
            キューブ入力
          </div>
          <TextField
            inputProps={{min: 0}}
            type={'number'}
            value={convertInputNumber(cube)}
            size={'small'}
            onChange={(e) => setCube(toNumber(e.target.value))}
          />
        </div>
      </div>
    </Modal>
  );
}

export default SettingChapterCubeDialog;
