import React, {useState} from 'react';
import DialogCustom from "@/app/components/custom/chapter/DialogCustom";
import {Button, TextField} from "@mui/material";
import UserInfo from "@/app/components/ShareLink/userInfo";
import Image from "next/image";
import SelectCustom from "@/app/components/custom/SelectCustom";
import LockIcon from '@mui/icons-material/Lock';
import LanguageIcon from '@mui/icons-material/Language';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ConfirmRequest from "@/app/components/ShareLink/ConfirmRequest";

type Props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function ShareLink({open, setOpen}: Props) {

  const [email, setEmail] = useState('')
  const [step, setStep] = useState(1)

  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  const rolls = [
    {
      label: 'Restricted',
      value: 'restricted',
    },
    {
      label: 'Geniam',
      value: 'geniam',
    },
    {
      label: 'Anyone with the link ',
      value: 'anyone with the link ',
    },
  ]

  const dataUser = [
    {
      image: '/avatar/avt_men_character.svg',
      name: 'Username 1',
      email: 'username1@gmail.com'
    },
    {
      image: '/avatar/avt_men_character.svg',
      name: 'Username 2',
      email: 'username2@gmail.com'
    }
  ]

  const [roll, setRoll] = useState(rolls[0]?.value)

  const handleChangeRoll = (e) => {
    setRoll(e.target.value)
  }

  return (
    <DialogCustom
      open={open}
      setOpen={setOpen}
      title='メンタロイドアドミン共有'
      handleBackToBefore={() => setStep(1)}
      back={step}
    >
      {
        step === 1 ?
          <div>
            <div className='w-[500px]'>
              <TextField onChange={handleChange} placeholder="ユーザーとグループを追加" size='small'
                         className='bg-gray-200 rounded-md'
                         fullWidth/>
              <span className='font-semibold my-3 block text-gray-300'>アクセスできるユーザー</span>
              <div className='flex flex-col gap-2'>
                {
                  dataUser?.map((user) => {
                    return <UserInfo key={user.email} image={user.image} name={user.name} email={user.email}/>
                  })
                }
              </div>
            </div>
            <div>
              <span className='font-semibold my-3 block text-gray-300'>一般アクセス</span>
              <div className='flex items-center gap-4'>
                {
                  roll === 'restricted' ?
                    <LockIcon/>
                    :
                    (roll === 'geniam' ?
                        <ApartmentIcon/>
                        :
                        <LanguageIcon/>
                    )
                }
                <SelectCustom value={roll} dataSelect={rolls} handleChange={handleChangeRoll} width={195}/>
              </div>
            </div>
            <div className='flex items-center justify-between mb-2 mt-5'>
              <Button variant='text' className='flex gap-2 items-center'>
                <Image src='/icons/link-icon.svg' alt='link-icon' width={20} height={10}/>
                Copy Link
              </Button>
              <Button
                variant='contained'
                onClick={() => setStep(2)}
              >
                Done
              </Button>
            </div>
          </div>
          :
          <ConfirmRequest setOpen={setOpen}/>
      }
    </DialogCustom>
  );
}

export default ShareLink;
