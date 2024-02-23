import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, FormControlLabel, Grid, Radio, RadioGroup} from "@mui/material";
import Image from "next/image";
import InputCustom from "@/app/components/InputCustom/InputCustom";
import {Basic, Content, ContentState, CubeOptions} from "@/app/types/content";
import {initialData, initialState} from "@/app/components/Content/data/data";
import {saveError, saveSuccess} from "@/app/services/content";
import {updateContent} from "@/app/common/commonApis/contentsApi";
import isEqual from "react-fast-compare";
import {useRouter, useSearchParams} from "next/navigation";
import {toNumber} from "lodash";
import ChapterBannerContent from "@/app/components/Content/ChapterBannerContent";
import {Chapter} from "@/app/types/types";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {convertInputNumber} from "@/app/common/convertNumber";
import {updateDataChapter} from "@/app/common/commonApis/chaptersApi";
import {useGetChapterByContentId} from "@/app/hooks/useGetChaptersByContentId";
import {changeStateValueSetting} from "@/app/common/chapterPurchaseSetting";

type BillingContentDialogProps = {
  open: boolean,
  setOpen: any,
  state: ContentState
  setState: React.Dispatch<React.SetStateAction<ContentState>>
  content: Content
  setContent: React.Dispatch<React.SetStateAction<Content>>
}

const updateMultiChapters = async (chapters: Chapter[], listChanged: string[]) => {
  const update = chapters.map(async chapter => {
    if (chapter.cube > 0 && !listChanged.includes(chapter.id)) {
      if (chapter.purchaseSetting) delete chapter.purchaseSetting;
      return await updateDataChapter({...chapter, cube: 0})
    }
  });
  await Promise.all(update).then();
}

function BillingContentDialog({
                                open,
                                setOpen,
                                state,
                                setState,
                                content,
                                setContent,
                              }: BillingContentDialogProps) {
  const initialValue = 'freeAll';
  const [stateBill, setStateBill] = useState<ContentState>({});
  const [value, setValue] = useState<string>(initialValue)
  const router = useRouter()
  const {contentId, id}: any = useSearchParams();

  const cubeOptionDraft = {
    basic: {
      freeAll: stateBill.freeAll,
      waitForFree: stateBill.waitForFree,
      purchaseAll: stateBill.purchaseAll
    },
    chapter: {
      free: stateBill.freeData,
      waitForFree: stateBill.waitForFreeData,
      purchase: stateBill.purchaseData,
      listChanged: stateBill.listChanged || [],
      changed: stateBill.changed
    },
    cube: stateBill.cube
  }
  const {chapters, setChapters} = useGetChapterByContentId(content?.id, cubeOptionDraft);

  useEffect(() => {
    const _value = state?.waitForFree ? 'waitForFree' : state?.freeAll ? "freeAll" : state?.purchaseAll ? 'purchaseAll' : initialValue
    setValue(_value)
    if(_value === 'freeAll') {
      setStateBill({...state, freeAll: true})
    }
  }, [state]);

  const handleClose = () => {
    const _value = content?.cubeOptions?.basic?.waitForFree ? 'waitForFree' : content?.cubeOptions?.basic?.freeAll ? "freeAll" : content?.cubeOptions?.basic?.purchaseAll ? 'purchaseAll' : initialValue
    setValue(_value)
    setState({
      ...state,
      changed: false,
      listChanged: [],
      waitForFree: _value === 'waitForFree',
      freeAll: _value === 'freeAll',
      purchaseAll: _value === 'purchaseAll',
      cube: content?.cubeOptions?.cube || initialState.cube,
      freeData: content?.cubeOptions?.chapter?.free || initialState.freeData,
      waitForFreeData: content?.cubeOptions?.chapter?.waitForFree || initialState.waitForFreeData,
      purchaseData: content?.cubeOptions?.chapter?.purchase || initialState.purchaseData
    })
    setOpen(false)
  }

  const handleChangeStateBill = (field: string) => (value: any) => {
    const newValue = changeStateValueSetting(field, value, stateBill, chapters);

    if (newValue != null) {
      const _state = {...stateBill}
      _state[field] = newValue
      setStateBill(_state)
    }
  }
  const checkWaitForFree = () => {
    if(stateBill) {
      return stateBill.waitForFreeData[0] === 0 && stateBill.waitForFreeData[1] === 0
    }
    return false
  }
  const checkRequiredCube = stateBill.freeAll && (stateBill.purchaseData || !checkWaitForFree()) && stateBill.cube === 0
  const handleSave = async () => {
    let basic: Basic;
    if ((stateBill.purchaseAll || stateBill.waitForFree) && stateBill.cube === 0 || checkRequiredCube) {
      saveError('キューブを入力してください。');
      return;
    }

    switch (value) {
      case "waitForFree":
        setState({...stateBill, waitForFree: true, purchaseAll: false, freeAll: false})
        basic = {
          waitForFree: true, purchaseAll: false, freeAll: false
        }
        break;
      case "freeAll":
        setState({...stateBill, waitForFree: false, purchaseAll: false, freeAll: true})
        basic = {
          waitForFree: false, purchaseAll: false, freeAll: true
        }
        break;
      case "purchaseAll":
        setState({...stateBill, waitForFree: false, purchaseAll: true, freeAll: false})
        basic = {
          waitForFree: false, purchaseAll: true, freeAll: false
        }
        break;
      default:
        setState({...stateBill, waitForFree: false, purchaseAll: true, freeAll: false})
        basic = {
          waitForFree: false, purchaseAll: true, freeAll: false
        }
        break;
    }
    if (contentId === "create" || id === "create") return setOpen(false)

    const cubeOptions: CubeOptions = {
      cube: stateBill.cube || initialState.cube,
      basic,
      chapter: {
        free: stateBill.freeData || initialState.freeData,
        purchase: stateBill.purchaseData || initialState.purchaseData,
        waitForFree: stateBill.waitForFreeData || initialState.freeData,
      }
    }

    if (isEqual(content?.cubeOptions, cubeOptions))
      return setOpen(false)

    try {
      handleChangeStateBill("saveLoading")(true);

      // Update chapters to 0 cube when changing the general setup
      // (without any individual cube changes)
      const changed = stateBill.changed;
      if (changed) {
        const listChanged = stateBill.listChanged;
        await updateMultiChapters(chapters, listChanged);
      }

      const _content = {...content, cubeOptions}
      await updateContent(_content)

      //  set content when there is a change
      setContent(_content)
      handleChangeStateBill("saveLoading")(false);

      setOpen(false)
      saveSuccess()
    } catch (e) {
      console.log(e)
      saveError()
      const oldValue = content?.cubeOptions?.basic?.waitForFree ? 'waitForFree' : content?.cubeOptions?.basic?.freeAll ? "freeAll" : content?.cubeOptions?.basic?.purchaseAll ? 'purchaseAll' : initialValue
      setValue(oldValue)
    }
  }

  const handleChangeBasicSetting = (e) => {
    const _value = e.target.value
    setValue(_value);
    const _state = {...stateBill}

    _state.waitForFree = initialState.waitForFree;
    _state.freeAll = initialState.freeAll;
    _state.purchaseAll = initialState.purchaseAll;
    _state.changed = true;
    _state.listChanged = [];

    if (_value === 'freeAll') {
      _state.freeAll = true;
      _state.cube = initialState.cube;
      _state.freeData = initialState.freeData
      _state.purchaseData = initialState.purchaseData
      _state.waitForFreeData = initialState.waitForFreeData
      setStateBill(_state)
    }
    if (_value === "waitForFree") {
      _state.waitForFree = true;
      _state.cube = content.cubeOptions.cube || initialState.cube;
      _state.freeData = content.cubeOptions.chapter.free || initialState.freeData
      _state.purchaseData = content.cubeOptions.chapter.purchase || initialState.purchaseData
      _state.waitForFreeData = content.cubeOptions.chapter.waitForFree || initialState.waitForFreeData
      setStateBill(_state);
    }
    if (_value === "purchaseAll") {
      _state.purchaseAll = true;
      _state.cube = content.cubeOptions.cube || initialState.cube;
      _state.freeData = content.cubeOptions.chapter.free || initialState.freeData
      _state.purchaseData = content.cubeOptions.chapter.purchase || initialState.purchaseData
      _state.waitForFreeData = content.cubeOptions.chapter.waitForFree || initialState.waitForFreeData
      setStateBill(_state);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={'paper'}
      sx={{
        "& .MuiDialog-container": {
          position: 'relative',
          "& .MuiPaper-root": {
            padding: '40px',
            maxWidth: "none",  // Set your width here
          },
        },
      }}
    >
      <IconButton className={'absolute right-1 top-1'} onClick={handleClose}><CloseIcon/></IconButton>
      <div className="w-[520px] m-auto border-[1px] border-solid border-gray-500 rounded-xl">
        <Grid container
              className={`border-b-[1px] border-x-0 border-t-0 border-solid border-gray-300 p-3 px-4 justify-center`}>
          <Grid item xs={3} className={`flex items-center text-base font-bold`}>課金ルール</Grid>
          <Grid item xs={3} className={`flex items-center`}>1話あたり</Grid>
          <Grid item xs={3} className={`flex`}>
            <Image
              src="/icons/content/billingType.svg"
              alt=""
              width={30}
              height={30}
              className="mx-3 "
            />
            <InputCustom
              type={"number"}
              value={convertInputNumber(stateBill?.cube || initialState.cube)}
              onChange={e => handleChangeStateBill('cube')(toNumber(e.target.value))}
              className={'w-[60px]'}
            />
          </Grid>
          {/*<Grid item xs={3} className={`flex items-center justify-center`}>適用する</Grid>*/}
        </Grid>
        <Grid container className={` p-3 px-4`}>
          <Grid item xs={3} className={`flex items-center justify-end pr-2`}>基本設定</Grid>
          <Grid item xs={9} className={`flex items-center pl-2`}>
            <RadioGroup
              value={value}
              className={"flex flex-row text-sm"}
              onChange={handleChangeBasicSetting}
              // onChange={(e) => handleChange(e.target.value)}
            >
              <FormControlLabel value="freeAll"
                                control={<Radio title={'全て無料'}/>}
                                label="全て無料"/>
              <FormControlLabel value="purchaseAll"
                                control={<Radio title={'全て有料'}/>}
                                label="全て有料"/>
              <FormControlLabel value="waitForFree"
                                control={<Radio title={'待てば無料'}/>}
                                label="待てば無料"/>
            </RadioGroup>
          </Grid>
        </Grid>
        <Grid container className={` mb-4 px-4`}>
          <Grid item xs={3}
                className={`flex items-center justify-end pr-2 ${stateBill?.freeAll && 'text-gray-300'}`}>常に無料</Grid>
          <Grid item xs={9} className={`flex items-center pr-4`}>
            <div className={"flex items-center"}>
              <InputCustom
                disabled={stateBill?.freeAll}
                type={"number"}
                value={stateBill?.freeData ? convertInputNumber(stateBill.freeData[0]) : convertInputNumber(initialData[0])}
                onChange={(e) => {
                  const _freeData = [...stateBill?.freeData ?? initialData]
                  _freeData[0] = Number(e.target.value)
                  handleChangeStateBill('freeData')(_freeData)
                }}
                className={"w-[100px]"}
              />
              <span className={"mx-4"}>~</span>
              <InputCustom
                disabled={stateBill?.freeAll}
                type={"number"}
                value={stateBill?.freeData ? convertInputNumber(stateBill.freeData[1]) : convertInputNumber(initialData[1])}
                onChange={(e) => {
                  const _freeData = [...stateBill?.freeData ?? initialData]
                  _freeData[1] = Number(e.target.value)
                  handleChangeStateBill('freeData')(_freeData)
                }}
                className={"w-[100px]"}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container className={`mb-4 px-4`}>
          <Grid item xs={3}
                className={`flex items-center justify-end pr-2 ${stateBill?.purchaseAll && 'text-gray-300'}`}>常に有料</Grid>
          <Grid item xs={9} className={`flex items-center pr-4`}>
            <div className={"flex items-center"}>
              <InputCustom
                disabled={stateBill?.purchaseAll}
                type={"number"}
                value={convertInputNumber(stateBill?.purchaseData || initialState.purchaseData)}
                className={"w-[100px]"}
                onChange={e => handleChangeStateBill('purchaseData')(Number(e.target.value))}
              />
              <span className={"mx-4"}>~</span>
              <InputCustom
                disabled={stateBill?.purchaseAll}
                readOnly={true}
                value={"最新"}
                className={"w-[100px]"}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container className={`mb-4 px-4`}>
          <Grid item xs={3}
                className={`flex items-center justify-end pr-2 ${stateBill?.waitForFree && 'text-gray-300'}`}>常に待てば無料</Grid>
          <Grid item xs={9} className={`flex items-center pr-4`}>
            <div className={"flex items-center"}>
              <InputCustom
                disabled={stateBill?.waitForFree}
                type={"number"}
                value={stateBill?.waitForFreeData ? convertInputNumber(stateBill.waitForFreeData[0]) : convertInputNumber(initialData[0])}
                onChange={(e) => {
                  const _waitForFreeData = [...stateBill?.waitForFreeData ?? initialData]
                  _waitForFreeData[0] = Number(e.target.value)
                  handleChangeStateBill('waitForFreeData')(_waitForFreeData)
                }}
                className={"w-[100px]"}
              />
              <span className={"mx-4"}>~</span>
              <InputCustom
                disabled={stateBill?.waitForFree}
                type={"number"}
                value={stateBill?.waitForFreeData ? convertInputNumber(stateBill.waitForFreeData[1]) : convertInputNumber(initialData[1])}
                onChange={(e) => {
                  const _waitForFreeData = [...stateBill?.waitForFreeData ?? initialData]
                  _waitForFreeData[1] = Number(e.target.value)
                  handleChangeStateBill('waitForFreeData')(_waitForFreeData)
                }}
                className={"w-[100px]"}
              />
            </div>
          </Grid>
        </Grid>

        <DialogActions>
          <Button disabled={stateBill.saveLoading} className={`!m-auto`} variant="contained" color="primary"
                  onClick={handleSave}>
            適用する
          </Button>
        </DialogActions>
      </div>
      <DialogContent dividers={false} className={'mt-6'}>
        <ChapterBannerContent
          chapters={chapters}
          setChapters={setChapters}
          contentId={contentId || id}
          hiddenAction={true}
          state={stateBill}
          setState={setStateBill}
          cubeDefault={stateBill?.cube}
        />
      </DialogContent>
    </Dialog>
  );
}

export default BillingContentDialog;
