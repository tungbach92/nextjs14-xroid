import React, {useState} from 'react';
import Image from "next/image";
import CloseIcon from '@mui/icons-material/Close';
import SelectCustom from "@/app/components/custom/SelectCustom";
import {permission} from "@/app/common/data/ScenarioData";
import Checkbox from "@mui/material/Checkbox";
import {TextareaAutosize} from "@mui/base";
import {Button} from "@mui/material";
import DialogCustom from "@/app/components/DialogCustom";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function ConfirmRequest({setOpen}: Props) {
  const [roll, setRoll] = useState(permission[0]?.value)
  const [message, setMessage] = useState('Message')
  const [checked, setChecked] = React.useState(false);
  const [isChildModal, setIsChildModal] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleChangeMessage = (e) => {
    setMessage(e.target.value)
  }

  const handleChangeRoll = (e) => {
    setRoll(e.target.value)
  }

  const handleDelete = () => {

  }

  const handleClick = () => {

  }

  return (
    <div className='w-[500px]'>
      <div className='flex items-center justify-between gap-1'>
        <div className='flex items-center bg-gray-100 p-1 rounded-sm w-full overflow-auto'>
          <div className='flex items-center rounded-full overflow-hidden p-0.5' style={{border: "solid 1px #a4a2a1"}}>
            <Image src='/avatar/avt_men_character.svg' alt='user-image' width={25} height={25}/>
            <span className='ml-1 mr-3 line-clamp-1 w-[80px]'>username</span>
            <CloseIcon className='cursor-pointer text-[#a4a2a1] hover:text-blue-400' onClick={handleDelete}/>
          </div>
        </div>
        <SelectCustom dataSelect={permission} value={roll} handleChange={handleChangeRoll}/>
      </div>
      <div className='flex items-center gap-2 my-1.5'>
        <Checkbox checked={checked} onChange={handleChange} inputProps={{'aria-label': 'controlled'}}/>
        <span>Notify people</span>
      </div>
      <TextareaAutosize
        className='w-full bg-gray-100 p-2 rounded-md text-black outline-0'
        minRows={4}
        aria-label="maximum height"
        value={message}
        onChange={handleChangeMessage}
      />
      <div className='flex items-center justify-between py-3'>
        <Button variant='text' className='flex gap-2 items-center'>
          <Image src='/icons/link-icon.svg' alt='link-icon' width={20} height={10}/>
          Copy Link
        </Button>
        <div className='flex items-center gap-1'>
          <Button
            variant='text'
            className='text-gray-300 hover:text-blue-500'
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => setIsChildModal(true)}
          >
            Send
          </Button>
        </div>
      </div>
      <DialogCustom open={isChildModal} setOpen={setIsChildModal} title={'Share?'} onClick={handleClick}>
        <span className='text-center'>
          Username123456@gmail.com is external to Geniam, who owns the item.
          This organization encourages caution when sharing externally.
        </span>
      </DialogCustom>
    </div>
  );
}

export default ConfirmRequest;
