import React, {useState} from 'react';
import {Button, CircularProgress} from "@mui/material";
import Image from "next/image";
import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import {useAtomValue} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";


type Props = {
  title: string,
  icon: string,
  image?: string,
  setImage?: React.Dispatch<React.SetStateAction<string>>
  isPose?: boolean,
  accept?: string
}

function Action({title, icon, image, setImage, isPose, accept = 'image/*'}: Props) {

  const {user_id} = useAtomValue(userAtomWithStorage)
  const [loading, setLoading] = useState(false)

  const handleChange = async (e) => {
    if (e.target.files.length === 0) return
    const typeArr = e.target.files[0].type
    if (accept !== 'image/*') {
      const regexImg = /png|jpe?g/i
      const regexGif = /gif/i
      if (regexImg.test(accept) && !regexImg.test(typeArr)) return
      if (regexGif.test(accept) && !regexGif.test(typeArr)) return
    }
    setLoading(true)
    try {
      const url = await handleUploadFile(e.target.files[0], user_id)
      url && setImage?.(url)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center gap-3'>
      <span className='leading-6'>{title}</span>
      <Button className='w-[180px] h-[160px] bg-[#F5F7FB] flex items-center justify-center p-2 overflow-hidden'
              component="label">
        <input hidden accept={accept} multiple type="file" onChange={handleChange}/>
        {
          loading ? <CircularProgress/> :
            <Image
              className='object-contain'
              src={image ? image : icon}
              alt='add-image-icon'
              width={image ? 170 : 30}
              height={image ? 150 : 30}
            />
        }
      </Button>
    </div>
  );
}

export default Action;
