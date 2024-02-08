import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { zoneDateSlash } from "../../../common/dayJs/format";
import dayjs from "dayjs";
import { orderBy } from "lodash";

const listDate = ["今日", "昨日", "過去7日"];

function ListSlide({ data, setIdDelete, typeOrder }: any) {
  const [listFormat, setListFormat] = useState<any>([]);

  useEffect(() => {
    if (data?.length) {
      const today = zoneDateSlash();
      const yesterday = zoneDateSlash(dayjs().subtract(1, "day"));

      let todayArr: any[] = [];
      let yesterdayArr: any[] = [];
      let sevenDaysAgoArr: any[] = [];

      orderBy(data, (a: any) => zoneDateSlash(dayjs(a.createdAt)), "desc").map((item: any) => {
        let itemDate = zoneDateSlash(item?.createdAt);
        if (today === itemDate) {
          todayArr.push(item);
        } else if (yesterday === itemDate) {
          yesterdayArr.push(item);
        } else if (dayjs(item?.createdAt).isBefore(dayjs().subtract(1, "day"))) {
          sevenDaysAgoArr.push(item);
        }
      });
      setListFormat([todayArr, yesterdayArr, sevenDaysAgoArr]);
    }
  }, [data]);

  return (
    <Grid className={`mx-7`}>
      {typeOrder !== 3 &&
        listDate?.map((item: string, index: number) => {
          return (
            <Grid key={"list" + index} className={`rounded`}>
              <div className={`my-4`}>{item}</div>
              <div className={`bg-white rounded`}>
                {listFormat[index] &&
                  listFormat[index].map((item: any, ind: number) => {
                    return (
                      <div
                        key={"listChill" + index + "_" + ind}
                        className={
                          `-mt-[1px] ` +
                          (listFormat[index].length - 1 !== ind &&
                            ` border-solid border-b-[0.5px] border-0 border-lightGray2 `) +
                          (ind === 0 && `rounded-t `) +
                          (ind === listFormat[index].length - 1 && " rounded-b")
                        }
                      >
                        <Grid container className={``}>
                          <Grid item className={``} xs={7}>
                            <div className={`w-full flex`}>
                              <img className={`m-4`} src="/icons/rectangle.svg" alt="" />
                              <Grid className={`m-4 font-medium text-xl line-clamp-1`}>{item?.title}</Grid>
                              <img className={`mx-1`} src="/icons/users.svg" alt="" />
                            </div>
                          </Grid>
                          <Grid item xs={2} className={`font-light text-xs text-lightGray1 my-auto`}>
                            {item?.author?.displayName}
                          </Grid>
                          <Grid item xs={2} className={`font-light text-xs text-lightGray1 my-auto`}>
                            {zoneDateSlash(item?.createdAt)}
                          </Grid>
                          <Grid item xs={1} className={`relative`}>
                            <img
                              onClick={() => setIdDelete({ id: item?.id, title: item?.title })}
                              src="/icons/trash-icon.svg"
                              alt=""
                              className={`absolute right-3 top-1/3 hover:bg-gray-100 cursor-pointer`}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    );
                  })}
              </div>
            </Grid>
          );
        })}

      {data.length > 0 &&
        typeOrder === 3 &&
        data?.map((item: any, index: number) => {
          return (
            <Grid key={"list" + index} className={`rounded bg-white`}>
              <div
                key={"listChill" + index}
                className={
                  (data.length - 1 !== index && ` border-solid border-b-[0.5px] border-0 border-lightGray2 `) +
                  (index === 0 && `rounded-t `) +
                  (index === data.length - 1 && " rounded-b")
                }
              >
                <Grid container className={``}>
                  <Grid item className={``} xs={7}>
                    <div className={`w-full flex`}>
                      <img className={`m-4`} src="/icons/rectangle.svg" alt="" />
                      <Grid className={`m-4 font-medium text-xl`}>{item?.title}</Grid>
                      <img className={`mx-1`} src="/icons/users.svg" alt="" />
                    </div>
                  </Grid>
                  <Grid item xs={2} className={`font-light text-xs text-lightGray1 my-auto`}>
                    自分
                  </Grid>
                  <Grid item xs={2} className={`font-light text-xs text-lightGray1 my-auto`}>
                    {zoneDateSlash(item?.createdAt)}
                  </Grid>
                  <Grid item xs={1} className={`relative`}>
                    <img
                      onClick={() => setIdDelete({ id: item?.id, title: item?.title })}
                      src="/icons/trash-icon.svg"
                      alt=""
                      className={`absolute right-3 top-1/3 hover:bg-gray-100 cursor-pointer`}
                    />
                  </Grid>
                </Grid>
              </div>
            </Grid>
          );
        })}
    </Grid>
  );
}

export default React.memo(ListSlide);
