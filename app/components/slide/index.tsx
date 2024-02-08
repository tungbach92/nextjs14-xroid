import React, {useEffect, useState} from 'react';
import {Button, Grid, Popover, Typography} from "@mui/material";
import ListSlide from "@/app/components/slide/ListSlide";
import FolderSlide from './FolderSlide';
import {sortBy} from "lodash";
import {deleteSlide, getSlides, getThumbByPresentationId} from "@/app/common/commonApis/slide";
import {BaseDeleteModal} from "@/app/components/base";
import {toast} from "react-toastify";
import AddSlideModal from './AddSlideModal';
import LinearProgress from "@mui/material/LinearProgress";

type MyProps = {}

const arrOrder = ["最後に開いたスライド", "最後に変更したスライド", "最終変更日", "タイトル"]

const defaultDel = {id: '', title: ''}

function SlideMaster(props: MyProps) {
    const [age, setAge] = React.useState('オーナー指定なし');
    const [displayType, setDisplayType] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalAdd, setIsModalAdd] = useState(false);
    const [typeOrder, setTypeOrder] = useState(0);
    const [idDelete, setIdDelete] = useState(defaultDel);
  const [dataSlides, setDataSlides] = useState(null);

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getListSlides = async () => {
        setIsLoading(true)
        try {
            let data = await getSlides()
            let dataSort = sortBy(data.slides, function (dateObj) {
                return typeOrder === 3 ? dateObj?.title : new Date(dateObj.createdAt);
            });
            let linkApiCall = []
            dataSort.map((val) => {
                linkApiCall.push(getThumbByPresentationId(val.presentationId))
            });
            Promise.all(linkApiCall).then((dataApi) => {
              setDataSlides(mrArray(dataSort, dataApi));
            }).finally(() =>
              setIsLoading(false)
            )
        } catch (err) {
          setIsLoading(false)
          console.log(err);
        }
    }

  const mrArray = (arr1, arr2) => {
    const mergedArr = [];

    arr1.forEach((obj1) => {
      const obj2 = arr2.find((o) => o.presentationId === obj1.presentationId);
      if (obj2) {
        const mergedObj = {...obj1, ...obj2};
        mergedArr.push(mergedObj);
      } else {
        mergedArr.push(obj1);
      }
    });

    arr2.forEach((obj2) => {
      const obj1 = arr1.find((o) => o.presentationId === obj2.presentationId);
      if (!obj1) {
        mergedArr.push(obj2);
      }
    });
    return mergedArr
  }
  const handleDeleteSlide = async () => {
    try {
      await deleteSlide(idDelete?.id)
      await getListSlides()
      setIdDelete(defaultDel)
      toast.success('保存しました', {autoClose: 3000});
    } catch (err) {
      toast.error('保存に失敗しました', {autoClose: 3000});
    }
  }

    useEffect(() => {
      if (dataSlides?.length > 0) {
        let dataSort = sortBy(dataSlides, function (dateObj) {
          return typeOrder === 3 ? dateObj?.title : new Date(dateObj.createdAt);
        });
        setDataSlides(dataSort)
      }
    }, [typeOrder])

    useEffect(() => {
        getListSlides()
    }, [])
  if (isLoading || (dataSlides === null && !isLoading)) return <LinearProgress/>
    return (
        <Grid className={"w-full text-black relative"}>
            {isLoading && <LinearProgress/>}
            <Grid className={`mx-7 mt-10`}>
                <Grid container className={``}>
                    <Grid item xs={12} className={`mb-4`}>
                        <Button variant={`contained`} onClick={() => setIsModalAdd(true)}><img
                          src="/icons/add-slide.svg" className={`mr-2`} alt=""/>スライドを追加</Button>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        最近使用したプレゼンテーション
                    </Grid>
                    <Grid item xs={6} md={3}>
                        {/*<FormControl variant="standard">*/}
                        {/*    <Select*/}
                        {/*        labelId="demo-simple-select-standard-label"*/}
                        {/*        id="demo-simple-select-standard"*/}
                        {/*        value={age}*/}
                        {/*        onChange={handleChange}*/}
                        {/*    >*/}
                        {/*        <MenuItem value="オーナー指定なし">*/}
                        {/*            <em>オーナー指定なし</em>*/}
                        {/*        </MenuItem>*/}
                        {/*        <MenuItem value={10}>Ten</MenuItem>*/}
                        {/*        <MenuItem value={20}>Twenty</MenuItem>*/}
                        {/*        <MenuItem value={30}>Thirty</MenuItem>*/}
                        {/*    </Select>*/}
                        {/*</FormControl>*/}
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Grid container justifyContent={"end"}>
                            <img
                                className={`cursor-pointer`}
                                onClick={() => setDisplayType(!displayType)}
                                src={"/icons/" + (displayType ? "listOutlineActive.svg" : "listOutline.svg")}
                                alt=""/>
                            <div>
                                <img
                                    aria-describedby={id}
                                    className={`mx-2 mt-1 cursor-pointer`}
                                    onClick={(e) => handleClick(e)}
                                    src="/icons/sortAZ.svg"
                                    alt=""/>
                                <Popover
                                    id={id}
                                    open={open}
                                    onClick={handleClose}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    {arrOrder.map((order, index) => {
                                        return (
                                            <div key={"order" + index}
                                                 className={`flex cursor-pointer hover:bg-gray-100`}>
                                                {typeOrder === index ?
                                                    <img src="/icons/check.svg" alt="" className={`ml-2`}/> :
                                                    <div className={`w-6 h-1 ml-2`}></div>
                                                }

                                                <Typography onClick={() => setTypeOrder(index)}
                                                            sx={{p: 2}}>{order}</Typography>
                                            </div>
                                        )
                                    })}
                                </Popover>
                            </div>
                          <img className={`cursor-pointer`} src="/icons/folderOutLine.svg" alt=""/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
          {
            dataSlides?.length > 0 ?
              <Grid className={`mb-7`}>
                {displayType ? <ListSlide typeOrder={typeOrder} data={dataSlides} setIdDelete={setIdDelete}/> :
                  <FolderSlide data={dataSlides} setIdDelete={setIdDelete}/>}
              </Grid>
              :
              <div
                className='absolute right-8 left-8 flex items-center bg-white rounded-md justify-center text-black h-12 font-semibold'>
                スライドのデータがございません。
              </div>
          }
          <AddSlideModal
            isOpen={isModalAdd}
            setIsOpen={setIsModalAdd}
            getListSlides={getListSlides}
          />
          <BaseDeleteModal
            label={'スライドを削除しますか？'}
            isOpen={Boolean(idDelete?.id)}
            handleClose={() => setIdDelete(defaultDel)}
            categoryName={idDelete?.title}
            handleDelete={handleDeleteSlide}
          />
        </Grid>
    );
}


export default React.memo(SlideMaster);
