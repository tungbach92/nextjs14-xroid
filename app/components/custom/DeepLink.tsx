import React, {useRef, useState} from 'react';
import {BaseModal} from "@/app/components/base";
import {Button, TextField} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import copy from 'copy-to-clipboard';
import {toast} from "react-toastify";
import QRCodeRenderer from "@/app/components/Deeplink";
import CustomizedSwitch from "@/app/components/base/CustomizedSwitch";
import {Chapter} from "@/app/types/types";
import {ONLY_DEEP_LINK} from "@/app/configs/constants";

type DeepLinkProps = {
  link?: string
  showQRCode: boolean
  setShowQRCode: React.Dispatch<React.SetStateAction<boolean>>
  inContent?: boolean
  chapter?: Chapter
  setChapter?: React.Dispatch<React.SetStateAction<Chapter>>
}

function DeepLink({
  link = "",
  showQRCode,
  setShowQRCode,
  inContent = false,
  chapter,
  setChapter,
}: DeepLinkProps) {
  const imageRef = useRef(null);
  const [isUnilink, setIsUnilink] = useState<boolean>(true)
  const onChangePublicDeepLink = () => {
    let _viewOptions = [...chapter.viewOptions]
    if (_viewOptions.includes(ONLY_DEEP_LINK))
      _viewOptions = _viewOptions.filter(v => v !== ONLY_DEEP_LINK)
    else
      _viewOptions.push(ONLY_DEEP_LINK)
    setChapter({viewOptions: _viewOptions})
  }

  const handleQRCode = async (imageElement) => {
    const img = imageRef.current;
    let canvas = document.createElement('canvas');
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    let context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL();
    const blob = await (await fetch(dataURL)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
    toast.success("QRコードをコピーしました。", {autoClose: 3000})
  };
  return (
    <div className={`${!inContent ? 'bg-white rounded px-5' : ''} pb-2 max-w-[400px] 2xl:max-w-[600px]`}>
      {
        !inContent &&
        <div className={'flex items-center gap-2 -mb-5'}>
          <span>公開</span>
          {
            {chapter} &&
            <CustomizedSwitch checked={chapter && chapter?.viewOptions?.includes(ONLY_DEEP_LINK)}
                              onChange={onChangePublicDeepLink}/>
          }
        </div>
      }
      <div className={'flex items-end w-full gap-5'}>
          <TextField variant="outlined"
                     contentEditable={false}
                     size="small"
                     value={link}
                     className={`bg-white flex-grow w-[345px] ${inContent ? '' : 'pb-[6px]'} `}
                     placeholder={"Deep link URL"}
                     InputProps={{
                       startAdornment: (
                         <InputAdornment position="start" className={'cursor-copy'} onClick={() => {
                           copy(link)
                           toast.success("URLをコピーしました。", {autoClose: 3000})
                         }}>
                           <FileCopyIcon className={'hover:text-sky-500'}/>
                         </InputAdornment>
                       ),
                     }}
          />
        <div className='flex items-center cursor-pointer hover:bg-blue-300 p-0.5 rounded-sm'
             onClick={() => setShowQRCode(true)}>
          <QRCodeRenderer usedRef={imageRef} id={'QRCode'} value={link} size={60}/>
        </div>
      </div>
      <BaseModal isOpen={showQRCode} handleClose={() => {
        setShowQRCode(false)
      }}>
        <QRCodeRenderer usedRef={imageRef} id={'QRCode'} value={link} size={300}/>
        <Button className={'mt-0'} variant="contained" onClick={handleQRCode}>QRコードをコピー</Button>
      </BaseModal>
    </div>
  );
}

export default DeepLink;
