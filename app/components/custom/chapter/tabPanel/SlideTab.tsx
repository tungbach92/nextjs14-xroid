import React from 'react';
import Button from "@mui/material/Button";
import FolderCustom from "@/app/components/custom/FolderCustom";
import {useAtom} from "jotai";
import {topLeftMenuOpen} from "@/app/store/atom/useTopLeftMenuOpen";

type props = {
  isLoading: boolean,
  dataSlides: Array<any>,
  setIdDelete: React.Dispatch<React.SetStateAction<{ id: '', title: '' }>>,
  setIsModalAdd,
  setOpenActionDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setOpenShowDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setOpenThumbDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setOpenThumbRangeDialog: React.Dispatch<React.SetStateAction<boolean>>,
  isShowModal: boolean
  fixed: boolean
}

function SlideTab({
                    isLoading,
                    dataSlides,
                    setIsModalAdd,
                    // setOpenActionDialog,
                    setIdDelete,
                    // setOpenShowDialog,
                    setOpenThumbDialog,
                    // setOpenThumbRangeDialog,
                    isShowModal = false,
                    fixed = false
                  }: props) {
  const [openTopLeftMenu] = useAtom(topLeftMenuOpen)
  const innerWidth = window.innerWidth
  const checkScreen = innerWidth > 1665

  return (
    <div className={'w-full text-center'}>
      {
        openTopLeftMenu ?
          <>
            <div className={`pb-5 w-full`}>
              <Button
                className={`mb-2 ${checkScreen ? 'text-[14px] w-[250px] ' : fixed ? 'w-[125px]' : 'w-[150px]'} text-[10px]}`}
                disabled={isLoading || !dataSlides.length}
                variant="contained"
                onClick={() => setOpenThumbDialog(true)}>サムネイル</Button><br/>
              {/*<Button*/}
              {/*  className={'mb-2 text-[10px] 2xl:text-[14px] w-[125px] 2xl:w-[270px]'}*/}
              {/*  disabled={isLoading || !dataSlides.length}*/}
              {/*  variant="contained"*/}
              {/*  onClick={() => setOpenShowDialog(true)}*/}
              {/*>スライドショー</Button><br/>*/}
              {/*<Button*/}
              {/*  className={'mb-2 text-[10px] 2xl:text-[14px] w-[125px] 2xl:w-[270px]'}*/}
              {/*  disabled={isLoading || !dataSlides.length}*/}
              {/*  variant="contained"*/}
              {/*  onClick={() => setOpenActionDialog(true)}*/}
              {/*>スライドアクション</Button><br/>*/}
            </div>
          </>
          :
          <div className={`pb-5 w-full ${isShowModal ? 'pr-[60px] 2xl:pl-[110px]' : ''}`}>
            <Button
              className={'mb-2 text-[10px] 2xl:text-[14px] w-[150px] 2xl:w-[270px]'}
              disabled={isLoading || !dataSlides.length}
              variant="contained"
              onClick={() => setOpenThumbDialog(true)}>サムネイル</Button><br/>
            {/*<Button*/}
            {/*  className={'mb-2 text-[10px] 2xl:text-[14px] w-[150px] 2xl:w-[270px]'}*/}
            {/*  disabled={isLoading || !dataSlides.length}*/}
            {/*  variant="contained"*/}
            {/*  onClick={() => setOpenShowDialog(true)}*/}
            {/*>スライドショー</Button><br/>*/}
            {/*<Button*/}
            {/*  className={'mb-2 text-[10px] 2xl:text-[14px] w-[150px] 2xl:w-[270px]'}*/}
            {/*  disabled={isLoading || !dataSlides.length}*/}
            {/*  variant="contained"*/}
            {/*  onClick={() => setOpenActionDialog(true)}*/}
            {/*>スライドアクション</Button><br/>*/}
            {/*<Button*/}
            {/*  disabled={isLoading || !dataSlides.length}*/}
            {/*  variant="contained"*/}
            {/*  onClick={() => setOpenThumbRangeDialog(true)}*/}
            {/*>ユーザーにコピー</Button><br/>*/}
          </div>
      }
      <div className={`mb-7 max-h-[70vh] overflow-x-auto ml-[30px] 2xl:ml-[70px]`}>
        <FolderCustom
          data={dataSlides}
          setIsModalAdd={setIsModalAdd}
          setIdDelete={setIdDelete}
        />
      </div>
    </div>
  );
}

export default SlideTab;
