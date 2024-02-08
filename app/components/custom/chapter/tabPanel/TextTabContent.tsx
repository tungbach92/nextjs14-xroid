import React, {useState} from 'react';
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {Columns} from "@/app/components/custom/chapter/TableCustom";
import {FormControl, FormHelperText} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useGetTextSetting} from "@/app/hooks/useGetTextSetting";
import {SaveSetting} from "@/app/types/block";
import {TextList} from "@/app/types/types";
import {NO_VARIABLE_TEXT, TEXT, TEXT_V2} from "@/app/configs/constants";

type props = {
  onAddBlock: (arg1, arg2?, arg3?) => void
  handleAddAction: (row: TextList) => void
  columns: Array<Columns>
  rows: Array<TextList>
  handleAddText?: any
  isShowModal: boolean
}

function TextTabContent({onAddBlock, handleAddAction, columns, rows, handleAddText, isShowModal}: props) {
  const [selectedTextSetting, setSelectedTextSetting] = useState<SaveSetting>(null)
  const {textSettings} = useGetTextSetting()

  return (
    <div>
      <div className={isShowModal ? 'max-w-[300px] m-auto' : 'pb-5 flex flex-wrap items-end gap-2 -mt-5'}>
        <div className={'flex flex-col'}>
          <FormControl variant="outlined" margin='dense'>
            <FormHelperText>保存済データリスト</FormHelperText>
            <Select
              value={selectedTextSetting?.id ?? ''}
              onChange={(e) => {
                const id = e.target.value
                const selected = textSettings.find(item => item.id === id)
                setSelectedTextSetting(selected)
              }}
              displayEmpty
              className={`h-[40px] ${selectedTextSetting?.id ? '' : 'text-[#A9A9A9] italic'}`}
            >
              <MenuItem key={0} value={""} className={"text-[#A9A9A9] italic"}>テキスト追加</MenuItem>
              {
                textSettings && textSettings.map((item, index) =>
                  <MenuItem key={index + 1} value={item.id}>{item.title}</MenuItem>
                )
              }

            </Select>
          </FormControl>
          <Button variant={'contained'} color={'primary'}
                  className={'mb-2'}
                  onClick={() => {
                    onAddBlock(NO_VARIABLE_TEXT, '', selectedTextSetting)
                    setSelectedTextSetting(null)
                  }}
                  startIcon={<AddIcon/>}>テキスト
          </Button>
          <Button variant={'contained'} color={'primary'}
                  className={'mb-2'}
                  onClick={() => {
                    onAddBlock(TEXT, '', selectedTextSetting)
                    setSelectedTextSetting(null)
                  }}
                  startIcon={<AddIcon/>}>テキスト (変数あり）
          </Button>
          <Button variant={'contained'} color={'primary'}
                  onClick={() => {
                    onAddBlock(TEXT_V2, '', selectedTextSetting)
                    setSelectedTextSetting(null)
                  }}
                  startIcon={<AddIcon/>}>テキスト V_2 (変数あり）
          </Button>
        </div>
        {/*<Button variant={'contained'} color={'primary'} onClick={handleAddText}*/}
        {/*        endIcon={<AddIcon/>}>テキスト追加</Button>*/}
        {/*<Button variant={'contained'} color={'primary'}*/}
        {/*        onClick={() => onAddBlock('addAllText')}>一括登録</Button>*/}
      </div>
      {/*<TableCustom columns={columns} rows={rows} handleAdd={handleAddAction}/>*/}
    </div>
  )
    ;
}

export default TextTabContent;
