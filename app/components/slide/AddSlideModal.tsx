import React, {useEffect, useState} from "react";
import {createSlide} from "@/app/common/commonApis/slide";
import {toast} from "react-toastify";
import {BaseModal} from "@/app/components/base";
import {Button, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {axiosError} from "../../../common/axiosError";

function AddSlideModal({isOpen, setIsOpen, getListSlides}) {
  const [slideUrl, setSlideUrl] = useState<string>("")
  const [textErr, setTextErr] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => {
    setIsOpen(false)
  }

  const extractPresentationId = (url) => {
    const match = /\/presentation\/d\/(.+?)\//.exec(url);
    if (match && match[1]) {
      return match[1];
    }
    return url;
  };
  const presentationId = extractPresentationId(slideUrl);

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await createSlide({
        presentationId: presentationId,
        thumbSize: "m",
      })
      setSlideUrl('')
      setTextErr('')
      getListSlides()
      handleClose()
      toast.success('保存しました', {autoClose: 3000});
    } catch (e) {
      const ae = axiosError(e)
      console.log(ae)
      setTextErr('エラー: ' + 'スライドのリンク形成が正しくありません。')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setSlideUrl('')
      setTextErr('')
    }
  }, [isOpen])

  return (
    <BaseModal
      isOpen={isOpen}
      handleClose={handleClose}
      className="flex flex-col gap-3 laptop:flex-none laptop:gap-0 bg-white rounded-xl shadow-xl laptop:min-w-[400px] 2xl:min-w-[500px] p-5 laptop:p-0"
      header={
        <div>
          <h1 className="text-xl text-black text-center">スライドを追加</h1>
        </div>
      }
    >
      <div className={`px-7 pb-7 relative`}>
        <div className={`mb-2`}>
          <div className={"text-sm mb-2"}>プレゼンテーションURLまたID</div>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            error={Boolean(textErr)}
            className={"bg-white mb-2"}
            value={slideUrl}
            onChange={(e) => setSlideUrl(e.target.value)}
          />
          <div className={"text-sm mb-2"}>※スライドは[togo-a2894@appspot.gserviceaccount.com]と共有してください。</div>{textErr && <span className={`text-error`}>{textErr}</span>}
        </div>

        <div className={`float-right`}>
          <Button variant="text" className={`mr-2`} onClick={handleClose}>キャンセル</Button>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            onClick={handleSubmit}
          >追加</LoadingButton>
        </div>
      </div>
    </BaseModal>
  );
};

export default AddSlideModal
