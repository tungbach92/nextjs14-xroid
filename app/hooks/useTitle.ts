import {useEffect, useState} from "react";

export const useTitle = () => {
  const [title, setTitle] = useState('Xroid Studio β')
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'production') {
      setTitle('Xroid Studio β')
    } else if (process.env.NEXT_PUBLIC_APP_ENV === 'stg') {
      setTitle('[stg] Xroid Studio β')
    } else {
      setTitle('[dev] Xroid Studio β')
    }
  }, [])
  return title;
}
