import React from 'react';
import {Grid, Tooltip} from "@mui/material";
import {zoneDateSlash} from "../../../common/dayJs/format";
import {SlidePageThumb} from "@/app/components/base/img/imgSlide";

function FolderSlide({data, setIdDelete}: any) {

    return (
        <Grid container>
            {data?.length > 0 && data.map((item: any, index: number) => {
                return (
                    <Grid key={"list" + index} item sm={12} lg={3} md={4}>
                        <Grid className={`bg-white m-5 rounded`}>
                            <Grid>
                              <SlidePageThumb pageThumbnail={item?.image} className={`w-full`}/>
                            </Grid>
                            <Tooltip title={item?.title}>
                                <Grid
                                    className={`m-2 font-medium text-xl cursor-pointer line-clamp-1`}>{item?.title}</Grid>
                            </Tooltip>
                            <Grid className={`flex relative px-2 pb-2`}>
                                <img src="/icons/rectangle.svg" alt=""/>
                                <img className={`mx-1`} src="/icons/users.svg" alt=""/>
                                <Grid
                                    className={`mx-1 font-light text-xs text-lightGray1 my-auto`}>{zoneDateSlash(item?.createdAt)}</Grid>
                                <div className={`absolute right-2`}>
                                    <img
                                        className={`hover:bg-gray-100 cursor-pointer`}
                                        onClick={() => setIdDelete({id: item?.id, title: item?.title})}
                                        src="/icons/trash-icon.svg"
                                        alt=""
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default FolderSlide;
