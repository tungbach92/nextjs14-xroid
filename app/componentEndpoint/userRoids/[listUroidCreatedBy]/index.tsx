import React, {useEffect, useState} from 'react';
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import {useRouter} from "next/navigation";
import {useCharacters} from "@/app/hooks/useCharacters";
import {getUroidsByTemplateId} from "@/app/common/commonApis/userRoidsApi";
import {Character} from "@/app/types/types";
import {CircularProgress} from "@mui/material";
import {isArray} from "lodash";

function Index(props) {
  const router = useRouter();
  const {listUroidCreatedBy} = router.query
  const {createdUroidChapters} = useCharacters()
  const name = createdUroidChapters?.find((i) => i.id === listUroidCreatedBy)?.name
  const [userRoids, setUserRoids] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUroids = async () => {
      try {
        setLoading(true)
        const res = await getUroidsByTemplateId(listUroidCreatedBy as string)
        const data = res?.data
        if (data) {
          setUserRoids(data)
        } else setUserRoids([])
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false)
      }
    }
    getUroids().then()
  }, [listUroidCreatedBy])
  return (
    <div className={'py-5 px-7 text-black relative'}>
      <div className={'flex justify-items-start'}>
        <IconButton onClick={() => {
          router.back()
        }} className={'my-auto'}>
          <KeyboardArrowLeftIcon/>
        </IconButton>
        <span className={'my-auto'}>戻る</span>
        <div className={'m-auto'}>
          <span className={'font-bold'}>{name}</span>
          <span>のテンプレートで作成されたキャラクター一覧</span>
        </div>
      </div>
      <div className={`${loading ? '' : 'grid grid-cols-2 md:grid-cols-5 2xl:grid-cols-6 gap-8'} text-black p-8 `}>
        {
          loading ?
            <CircularProgress className={'flex m-auto mt-5'}/> :
            <>
              {
                isArray(userRoids) &&
                userRoids?.map((i: Character, index) => {
                  return (
                    <div key={i.id}>
                      <div className={"relative pt-[100%]"}>
                        <img alt={''}
                             className={'absolute inset-0 w-full h-full object-cover rounded-lg'}
                             src={i?.avatar}
                        />
                      </div>
                      <p className={'mx-auto truncate max-w-fit '}>{i?.name}</p>
                    </div>
                  )
                })
              }
            </>
        }
      </div>

    </div>
  );
}

export default Index;
