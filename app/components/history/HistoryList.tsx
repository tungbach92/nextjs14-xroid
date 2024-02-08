import React, {MutableRefObject} from 'react';
import HistoryComp from "@/app/components/history/HistoryComp";
import Dropdown from "@/app/components/custom/Dropdown";
import Modal from "@/app/components/custom/Modal";
import CenterScenario from "@/app/components/custom/chapter/contents/CenterScenario";
import {useAtom} from "jotai";
import {showHistoryAtom} from "@/app/store/atom/showHistory.atom";
import {Block} from "@/app/types/block";

const dataSelect = [
  {
    value: '1',
    label: 'すべてのバージョン',
  },
  {
    value: '2',
    label: '名前付きバージョン',
  }]

type HistoryListProps = {
  historyList: any[],
  virtuosoHistoryRef: MutableRefObject<any>
  allBlocks: Block[]
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
}

function HistoryList({historyList, virtuosoHistoryRef, allBlocks, setBlocks}: HistoryListProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('1');
  const [blocksIds, setBlocksIds] = React.useState([])
  const _blocks = allBlocks?.filter((item) => blocksIds?.includes(item.id))
  const [, setShowHistory] = useAtom(showHistoryAtom)


  const handleChange = (event) => {
    setValue(event.target.value);
  }

  const handleClick = (blocksIds) => {
    setBlocksIds(blocksIds)
    setOpen(!open)
  }

  const onSaved = () => {
    setOpen(false)
    setBlocks(_blocks)
    setShowHistory(false)
  }


  return (
    <div className={`bg-white gap-2 w-[270px] px-5 pt-3 pb-5 border border-solid border-[#E0E0E0]`}>
      <span className={'font-bold text-[14px]'}>変更履歴</span>
      <Dropdown dataSelect={dataSelect}
                value={value}
                onChange={(event) => handleChange(event)}
                className={'py-3'}
      />
      <div className={'overflow-y-auto max-h-[79vh]'}>
        {
          historyList?.map((item, index) => {
              return (
                <div key={index} className={'p-2 cursor-pointer'}>
                  <HistoryComp date={item.date}
                               author={item.author}
                               onClick={() => handleClick(item.blockIds)}
                  />
                  <div className={'bg-gray-400 w-full h-[1px]'}/>
                </div>
              )
            }
          )
        }
      </div>
      {
        open && <Modal
          btnSubmit={'編集'}
          titlePosition={'center'}
          open={open}
          setOpen={setOpen}
          title={'プレビュー'}
          actionPosition={'center'}
          onSubmit={onSaved}
          handleClose={() => setOpen(false)}
        >
          <div className={'mb-10'}>
            <CenterScenario blocks={_blocks} isHistory={true} virtuosoRef={virtuosoHistoryRef}/>
          </div>
        </Modal>
      }
    </div>
  );
}

export default HistoryList;
