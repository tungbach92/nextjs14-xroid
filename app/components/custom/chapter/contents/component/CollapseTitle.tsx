import React, {useState} from 'react';
import {Chapter, ViewOptionForm} from "@/app/types/types";
import {IconButton} from "@mui/material";
import CustomizedSwitch from "@/app/components/base/CustomizedSwitch";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ViewOptionFormsComp from "@/app/components/custom/chapter/contents/component/ViewOptionFormsComp";
import Popper, {PopperPlacementType} from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {Content} from "@/app/types/content";
import {ONLY_ME, plans} from "@/app/configs/constants";
import {useRouter, useSearchParams} from "next/navigation";
import {LockContent} from '@/app/components/base/lockContent/LockContent';
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {CF_EMAIL, OWNER_EMAILS} from "@/common/ownerId";


type Props = {
  chapter: Chapter
  setChapter: React.Dispatch<React.SetStateAction<Chapter>>
  content: Content
  viewOptionForms: ViewOptionForm[]
}

function CollapseTitle({
                         chapter,
                         setChapter,
                         viewOptionForms,
                         content,
                       }: Props) {
  const [isSelectDate, setIsSelectDate] = useState(false);
  const [openSettingPublic, setOpenSettingPublic] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const router = useRouter()
  const {createChapter: chapterId}: any = useSearchParams()
  const [userInfo] = useAtom(userAtomWithStorage);
  const isLocked = (userInfo?.plan === plans.at(0) || !userInfo?.plan) && !userInfo?.email?.includes(CF_EMAIL) && !OWNER_EMAILS.includes(userInfo?.email)

  const handleOpenSettingPublic = (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpenSettingPublic((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  const onChangeIsPublicByContent = (e) => {
    setChapter({isPublicByContent: e.target.checked});
    if (!e.target.checked) {
      setOpenSettingPublic(false);
    }
  }

  const onChangeOnlyMe = () => {
    let _viewOptions = [...chapter.viewOptions]
    if (_viewOptions.includes(ONLY_ME))
      _viewOptions = _viewOptions.filter(v => v !== ONLY_ME)
    else
      _viewOptions.push(ONLY_ME)
    setChapter({viewOptions: _viewOptions})
  }

  return (
    <div className={'flex gap-5 items-center z-50'}>
      <span className={'pr-10'}>シナリオの製作</span>
      {/*<div className={'pr-2 flex items-center'}>*/}
      {/*  <Checkbox checked={isSelectDate} onChange={() => setIsSelectDate(!isSelectDate)}/>*/}
      {/*  <span className={"font-normal text-sm text-center min-w-fit pr-[14px]"}>予約公開</span>*/}
      {/*  <DatePicker*/}
      {/*    disabled={!isSelectDate}*/}
      {/*    customInput={*/}
      {/*      <div>*/}
      {/*        <CssTextField*/}
      {/*          disabled={!isSelectDate}*/}
      {/*          className={'bg-white'} size={'small'}*/}
      {/*          value={chapter?.publishedDate ? dayjs(toDate(chapter.publishedDate)).format('YYYY/MM/DD') : 'YYYY/MM/DD'}*/}
      {/*          InputProps={{*/}
      {/*            sx: {borderRadius: 0},*/}
      {/*            endAdornment: (*/}
      {/*              <InputAdornment position="end"*/}
      {/*                disablePointerEvents={!isSelectDate}*/}
      {/*              >*/}
      {/*                <CalendarTodayIcon*/}
      {/*                  className={`${isSelectDate ? 'cursor-pointer' : ''} `}*/}
      {/*                />*/}
      {/*              </InputAdornment>*/}
      {/*            ),*/}
      {/*          }}/>*/}
      {/*      </div>*/}
      {/*    }*/}
      {/*    locale={ja}*/}
      {/*    selected={chapter?.publishedDate ? toDate(chapter.publishedDate) : null}*/}
      {/*    onChange={(date) => setChapter({publishedDate: date})}*/}
      {/*  />*/}
      {/*</div>*/}
      <div className={''}>
        <div className={'grid grid-cols-12 items-center'}>
          <div className={'col-span-9'}>
            <LockContent isLocked={isLocked}
                         className={'flex-row-reverse justify-end py-2 gap-3 rounded-none bg-blue-300'}>
              <div className={"font-normal grid justify-items-end text-sm m-auto text-center min-w-fit pr-[14px]"}>
                このシナリオを公開
              </div>
            </LockContent>
          </div>

          <div className={'col-span-3'}>
            {
              chapter &&
              <CustomizedSwitch onChange={onChangeIsPublicByContent}
                                checked={chapter && chapter?.isPublicByContent}
                                disabled={isLocked}/>
            }
          </div>
        </div>

        <div className={'grid grid-cols-12 items-center'}>
          <div className={'col-span-9'}>
              <span
                className={"font-normal grid justify-items-end text-sm m-auto text-center min-w-fit pr-[14px]"}>
                自分限定公開(自作タブ)
              </span>
          </div>
          <div className={'col-span-3'}>
            {
              chapter && <CustomizedSwitch onChange={onChangeOnlyMe}
                                           checked={chapter && chapter?.viewOptions?.includes(ONLY_ME)}/>
            }
          </div>
        </div>
      </div>
      <div className={`min-h-[80px] -ml-10`}>
        <Popper open={openSettingPublic} anchorEl={anchorEl} placement={placement} transition>
          {({TransitionProps}) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper className={'bg-[#F5F7FB]'}>
                <Typography sx={{p: 2}}>
                  <ViewOptionFormsComp viewOptionForms={viewOptionForms}/>
                </Typography>
              </Paper>
            </Fade>
          )}
        </Popper>
        <IconButton onClick={handleOpenSettingPublic('bottom')}>
          {
            openSettingPublic ?
              <ArrowDropDownIcon className={'rotate-180'}/> :
              <ArrowDropDownIcon/>
          }
        </IconButton>
      </div>


    </div>
  );
}

export default CollapseTitle;
