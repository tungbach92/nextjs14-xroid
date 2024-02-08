import React from 'react';
import {Grid, Tooltip} from "@mui/material";

import {zoneDateSlash} from "../../../common/dayJs/format";
import {SlidePageThumb} from "@/app/components/base/img/imgSlide";

function FolderCustom({data, setIsModalAdd, setIdDelete}: any) {
  return (
    <Grid container>
      {data?.length > 0 && data.map((item: any, index: number) => {
        return (
          <Grid
            key={"list" + index}
            item sm={12} lg={2} md={3}
            className={`min-w-[174px] hover:drop-shadow-lg cursor-pointer`}
          >
            <Grid
              className={`bg-white m-4 border rounded border-solid border-gray-200`}>
              <Grid>
                <SlidePageThumb pageThumbnail={item?.image} className={`w-full`}/>
              </Grid>
              <Tooltip title={item?.title}>
                <Grid className={`m-2 font-medium text-xs line-clamp-1`}>{item?.title}</Grid>
              </Tooltip>
              <Grid className={`flex relative px-2 pb-2 items-center`}>
                <img className={`w-3`} src="/icons/rectangle.svg" alt=""/>
                <img className={`mx-1 w-3`} src="/icons/users.svg" alt=""/>
                <Grid
                  className={`mx-1 font-light text-[10px] text-lightGray1 my-auto`}>{zoneDateSlash(item?.createdAt)}</Grid>
                <div className={`absolute right-2 top-0.5`}>
                  <img
                    className={`hover:bg-gray-100 cursor-pointer w-4`}
                    onClick={() => {
                      setIdDelete({id: item?.id, title: item?.title})
                    }}
                    src="/icons/trash-icon.svg"
                    alt=""
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        )
      })}
      <Grid
        className={`min-w-[174px]`}
        item sm={12} lg={2} md={3}
        onClick={() => setIsModalAdd(true)}>
        <Grid
          className={`bg-white min-h-[142px] flex m-4 items-center rounded border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100`}>
          <img className={`m-auto`} src="/images/scenario-template/plus_border.svg" alt=""/>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default FolderCustom;
