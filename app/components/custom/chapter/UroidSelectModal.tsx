import React from 'react';
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {Character} from "@/app/types/types";
import {CircularProgress} from "@mui/material";
import ImageListItemBar from '@mui/material/ImageListItemBar';

type props = {
  selectedItem: Character,
  setSelectedItem: (e: Character) => void
  userRoids: Character[]
  loading: boolean
}

function UroidSelectModal({selectedItem, setSelectedItem, userRoids, loading}: props) {
  const selectUroid = (item: Character) => {
    setSelectedItem(item)
  }

  return (
    <div className={'m-auto'}>
      {
        loading ? <CircularProgress/> : userRoids?.length === 0 ?
          <div className={'text-center'}>Uroidなし</div> :
          <ImageList sx={{width: 700, height: 600}} cols={3} gap={20}>
            {
              userRoids?.map((item: Character) => (
                <ImageListItem
                  key={item.id}
                  onClick={() => selectUroid(item)}
                  className={'max-h-fit'}
                >
                  <img
                    className={`${item.id === selectedItem?.id ? 'border-[#1976D2] border-2' : 'border-gray-300'}
                        border-solid rounded-md cursor-pointer gap-6 border-2 h-[220px]`}
                    src={`${item.avatar}?w=248&fit=crop&auto=format`}
                    srcSet={`${item.avatar}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={'avatar'}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    className={'text-center'}
                    title={item?.id}
                    position="below"
                  />
                </ImageListItem>
              ))}
          </ImageList>
      }
    </div>
  );
}

export default UroidSelectModal;
