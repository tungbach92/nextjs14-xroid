import React from 'react';
import ButtonAddImage from "@/app/components/ButtonCustom/ButtonAddImage";

type Props = {
  url: string,
  setUrl: React.Dispatch<React.SetStateAction<string>>,
  setIsOldUrl?: any,
}

function AddBanner({url, setUrl, setIsOldUrl}: Props) {
  const [loading, setLoading] = React.useState(false)
  return (
    <div
      className={`flex items-center justify-center ${!url ? 'h-36' : 'h-[300px]'}  w-full overflow-hidden bg-[#F5F7FB] rounded-md`}>
      <ButtonAddImage
        loading={loading}
        setLoading={setLoading}
        previewUrl={url}
        setPreviewUrl={setUrl}
        className='w-full h-full'
        size='w-full'
        setIsOldUrl={setIsOldUrl}
      />
    </div>
  );
}

export default AddBanner;
