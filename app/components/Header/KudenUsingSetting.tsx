import React, {useMemo, useState} from 'react';
import {Close, Settings} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {Button, CircularProgress, DialogContentText} from '@mui/material';
import {CssTextField} from "@/app/components/custom/CssTextField";
import InputAdornment from "@mui/material/InputAdornment";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import copy from 'copy-to-clipboard';
import {toast} from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import {isProd} from "@/app/configs/constants";
import axios from "axios";
import {isEqual} from "lodash";
import {createEnterprise} from "@/app/common/commonApis/enterPriseApis";
import CachedIcon from '@mui/icons-material/Cached';

export interface Enterprise {
  studioKey?: string
  openAPIKey?: string
  endpoint?: string
  isPublic?: boolean
  isEnterprise?: boolean
}

type Props = {
  enterprise?: Enterprise
  setEnterprise?: React.Dispatch<React.SetStateAction<Enterprise>>
}

function KudenUsingSetting({enterprise, setEnterprise}: Props) {
  const [openSetting, setOpenSetting] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingSaveBtn, setLoadingSaveBtn] = useState<boolean>(false)
  const [prevEnterprise, setPrevEnterprise] = useState<Enterprise>(enterprise)

  const onCopy = () => {
    copy(enterprise?.studioKey)
    if (enterprise?.studioKey) {
      toast.success("XroidStudioAPIKeyをコピーしました。", {autoClose: 3000})
    } else {
      toast.error("XroidStudioAPIKeyがありません。", {autoClose: 3000})
    }
  }


  const onChangeOpenAPIKeyOrDestination = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => {
    const _enterprise = {...enterprise}
    if (type === 'APIKey') {
      _enterprise.openAPIKey = e.target.value
      setEnterprise(_enterprise)
    }
    if (type === 'endpoint') {
      _enterprise.endpoint = e.target.value
      setEnterprise(_enterprise)
    }
  }
  const handleSave = async () => {
    setLoadingSaveBtn(true)
    try {
      const data = {
        studioKey: enterprise?.studioKey,
        openAPIKey: enterprise?.openAPIKey,
        endpoint: enterprise?.endpoint,
        isPublic: false
      }
      await createEnterprise(data)
      toast.success("保存しました。", {autoClose: 3000})
    } catch (e) {
      console.log(e);
      toast.error("保存に失敗しました。", {autoClose: 3000})
    } finally {
      setOpenSetting(false)
      setLoadingSaveBtn(false)
    }
  }

  const urlCreateKey = useMemo(() => {
    if (isProd()) {
      return 'https://api2.geniam.com/v1/keys/create'
    } else {
      return 'https://api2stg.geniam.com/v1/keys/create'
    }
  }, [isProd()])

  const handleCreateKey = async () => {
    setLoading(true)
    try {
      const {data} = await axios.post(urlCreateKey)
      if (data?.data) {
        const key = data?.data?.key
        const _enterprise = {...enterprise}
        _enterprise.studioKey = key
        setEnterprise(_enterprise)
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <IconButton onClick={() => {
        setOpenSetting(true)
        setPrevEnterprise(enterprise)
      }}>
        <Settings fontSize={'small'}/>
      </IconButton>
      {
        openSetting &&
        <Dialog
          open={openSetting}
          onClose={() => {
            setOpenSetting(false)
            setEnterprise(prevEnterprise)
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" className={'relative pb-3'}>
            <IconButton onClick={() => setOpenSetting(false)} className={'absolute top-0 right-0'}>
              <Close/>
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description" className={'pr-8 pl-4 flex flex-col gap-3 text-black'}>
              <Button variant={'contained'}
                      endIcon={loading ? <CircularProgress size={20}/> : enterprise?.studioKey ? <CachedIcon/> :
                        <AddIcon/>}
                      disabled={loading}
                      className={'w-[300px]'}
                      onClick={() => handleCreateKey()}>
                {enterprise?.studioKey ? 'Xroid Studio APIkey 再作成' : 'Xroid Studio APIkey 作成'}
              </Button>
              <div className={'grid grid-cols-12 gap-3'}>
                  <span className={'col-span-5 my-auto '}>
                    Xroid Studio APIkey
                  </span>
                <div className={'col-span-7'}>
                  <CssTextField
                    value={enterprise?.studioKey}
                    size={'small'}
                    placeholder="Xroid Studio APIkey"
                    className={'w-[300px]'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" className={'cursor-copy'} onClick={onCopy}>
                          <ContentCopyIcon/>
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
              </div>
              <div className={'grid grid-cols-12 gap-3'}>
                  <span className={'col-span-5 my-auto'}>
                    Open APIkey
                  </span>
                <div className={'col-span-7'}>
                  <CssTextField
                    value={enterprise?.openAPIKey}
                    onChange={(e) => onChangeOpenAPIKeyOrDestination(e, 'APIKey')}
                    size={'small'}
                    placeholder="Open APIkey 入力"
                    className={'w-[300px]'}/>
                </div>
              </div>

              <div className={'grid grid-cols-12 gap-3'}>
                  <span className={'col-span-5 my-auto'}>
                    EndPoint
                  </span>
                <div className={'col-span-7'}>
                  <CssTextField
                    value={enterprise?.endpoint}
                    onChange={(e) => onChangeOpenAPIKeyOrDestination(e, 'endpoint')}
                    size={'small'}
                    placeholder="Output Destination 入力"
                    className={'w-[300px]'}/>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>

          <DialogActions className={'flex justify-items-center mx-auto'}>
            <Button onClick={() => handleSave()}
                    autoFocus
                    disabled={loadingSaveBtn || isEqual(enterprise, prevEnterprise)}
                    variant={'contained'}
                    className={'w-[200px]'}>
              保存
            </Button>
          </DialogActions>

        </Dialog>
      }
    </div>
  );
}

export default KudenUsingSetting;
