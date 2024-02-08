import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import PeriodicItem from "@/app/components/custom/PeriodicItem";
import React from "react";
import {initReleaseOptions} from "@/app/components/Content/data/data";
import {Content, ReleaseOptions, ReleaseOptionsType} from "@/app/types/content";
import {updateContent} from "@/app/common/commonApis/contentsApi";
import {saveError, saveSuccess} from "@/app/services/content";
import {useRouter} from "next/navigation";

interface Props {
  releaseOptions: ReleaseOptions,
  setReleaseOptions: React.Dispatch<React.SetStateAction<ReleaseOptions>>,
  content: Content
}

export default function PublishedDateContent({releaseOptions, setReleaseOptions, content}: Props) {
  const router = useRouter()
  const {contentId}: any = router.query;
  const handleChangeReleaseOptions = async ({
                                              day = initReleaseOptions.day,
                                              week = initReleaseOptions.week,
                                              type = initReleaseOptions.type
                                            }) => {
    let payload = {}
    switch (type) {
      case 'none':
        break
      case 'weekly':
        payload = {day}
        break
      case 'biweekly':
        payload = {day}
        break
      case 'monthly':
        payload = {
          day,
          week,
        }
        break
      default:
    }
    const releaseOptions: ReleaseOptions = {
      type,
      ...payload
    }
    setReleaseOptions(releaseOptions)
    if (contentId === "create") return

    try {
      const _content = {...content, releaseOptions}
      await updateContent(_content)
      saveSuccess()
    } catch (e) {
      console.log(e)
      saveError()
      setReleaseOptions(content.releaseOptions)
    }
  }

  const periodicList = [
    {
      value: 'weekly',
      label: <><PeriodicItem dayValue={releaseOptions?.type === 'weekly' ? releaseOptions?.day : initReleaseOptions.day}
                             releaseOptionsType={releaseOptions?.type || initReleaseOptions.type}
                             handleChangeDay={handleChangeDayWeek}
                             title={'毎週'} type={'weekly'}/></>
    },
    {
      value: 'biweekly',
      label: <><PeriodicItem
        dayValue={releaseOptions?.type === 'biweekly' ? releaseOptions?.day : initReleaseOptions.day}
        releaseOptionsType={releaseOptions?.type}
        handleChangeDay={handleChangeDayBiWeek}
        title={'隔週'} type={'biweekly'}/></>
    },
    {
      value: 'monthly',
      label: <><PeriodicItem
        dayValue={releaseOptions?.type === 'monthly' ? releaseOptions?.day : initReleaseOptions.day}
        releaseOptionsType={releaseOptions?.type}
        handleChangeDay={handleChangeDayMonthly}
        handleChangeMonth={handleChangeWeekMonthly} weekValue={releaseOptions?.week || initReleaseOptions.week}
        title={'毎月'}
        type={'monthly'}/></>
    },
    {
      value: 'none',
      label: '不定期'
    }
  ]

  async function handleChangeDayWeek(e) {
    if (releaseOptions?.type === 'weekly') {
      const _releaseOptions = {...releaseOptions, day: e.target.value}
      delete _releaseOptions.week
      setReleaseOptions(_releaseOptions)
      if (contentId === "create") return

      try {
        const _content = {...content, releaseOptions: _releaseOptions}
        await updateContent(_content)
        saveSuccess()
      } catch (e) {
        console.log(e)
        saveError()
        setReleaseOptions(content.releaseOptions)
      }
    }
  }

  async function handleChangeDayBiWeek(e) {
    if (releaseOptions?.type === 'biweekly') {
      const _releaseOptions = {...releaseOptions, day: e.target.value}
      delete _releaseOptions.week
      setReleaseOptions(_releaseOptions)
      if (contentId === "create") return

      try {
        const _content = {...content, releaseOptions: _releaseOptions}
        await updateContent(_content)
        saveSuccess()
      } catch (e) {
        console.log(e)
        saveError()
        setReleaseOptions(content.releaseOptions)
      }
    }
  }

  async function handleChangeDayMonthly(e) {
    if (releaseOptions?.type === 'monthly') {
      const _releaseOptions = {...releaseOptions, day: e.target.value}
      setReleaseOptions(_releaseOptions)
      if (contentId === "create") return

      try {
        const _content = {...content, releaseOptions: _releaseOptions}
        await updateContent(_content)
        saveSuccess()
      } catch (e) {
        console.log(e)
        saveError()
        setReleaseOptions(content.releaseOptions)
      }
    }

  }

  async function handleChangeWeekMonthly(e) {
    if (releaseOptions.type === 'monthly') {
      const _releaseOptions = {...releaseOptions, week: e.target.value}
      setReleaseOptions(_releaseOptions)
      if (contentId === "create") return

      try {
        const _content = {...content, releaseOptions: _releaseOptions}
        await updateContent(_content)
        saveSuccess()
      } catch (e) {
        console.log(e)
        saveError()
        setReleaseOptions(content.releaseOptions)
      }
    }
  }

  return (
    <FormControl className={'p-3 bg-white'}>
      <FormLabel id="radio-buttons-group-label"></FormLabel>
      <RadioGroup
        aria-labelledby="radio-buttons-group-label"
        value={releaseOptions?.type || 'none'}
        onChange={(e) => {
          if (!['none', 'weekly', 'biweekly', 'monthly'].includes(e.target.value)) return
          handleChangeReleaseOptions({type: e.target.value as ReleaseOptionsType})
        }}
        name="radio-buttons-group"
      >
        <div className={`flex flex-col`}>
          {
            periodicList.map((item, index) => {
                return (
                  <FormControlLabel
                    value={item.value}
                    key={index}
                    control={<Radio/>}
                    label={item.label}
                  />
                )
              }
            )
          }
        </div>
      </RadioGroup>
      {/*<div className="text-sm">公開予約</div>*/}
      {/*<div className={'flex items-center'}>*/}
      {/*  <Image*/}
      {/*    src="/icons/content/active.svg"*/}
      {/*    alt=""*/}
      {/*    width={12}*/}
      {/*    height={12}*/}
      {/*    className="mr-2"*/}
      {/*  />*/}
      {/*  10/29（水）*/}
      {/*</div>*/}
    </FormControl>
  )
}
