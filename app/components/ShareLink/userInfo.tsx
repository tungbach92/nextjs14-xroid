import React, {useState} from 'react';
import Image from "next/image";
import SelectCustom from "@/app/components/custom/SelectCustom";
import {SelectChangeEvent} from "@mui/material/Select";
import {permission} from "@/app/common/data/ScenarioData";

type Props = {
  owner?: boolean
  image: string,
  name: string,
  email: string,
}

function UserInfo({owner, image, name, email}: Props) {

  const [value, setValue] = useState(permission[0].value)
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='flex gap-3 items-center'>
        <Image src={image} alt='' width={40} height={40}
               className='rounded-full object-contain border-solid border border-gray-500'/>
        <div className='flex flex-col'>
          <span className=''>{name}</span>
          <span className='text-gray-300'>{email}</span>
        </div>
      </div>
      {
        owner ?
          <span>Owner</span>
          :
          <SelectCustom
            dataSelect={permission}
            value={value}
            handleChange={handleChange}
          />
      }
    </div>
  );
}

export default UserInfo;
