import React, {useEffect, useState} from "react";
import {CardSheet, SelectRow, TitleSheets} from "@/app/components/spreadsheets";
import {imageUri} from "@/app/components/assets";
import {Button, IconButton} from "@mui/material";
import {Add, Close, DeleteOutline} from "@mui/icons-material";
import {AddDataSetModal} from "@/app/components/spreadsheets/widgets/update/AddDataSetModal";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

interface Props {
  dataSet: any
}

interface DataSetItemProps {
  item: any
}

interface InOutListProps {
  data: any,
  type: "output" | "input"
}

interface InOutItemProps {
  item: any,
  type: "output" | "input"
}

const DataSet = ({dataSet}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleAddDataSetModal = () => {
    setIsOpen(true)
  }
  return (
    <CardSheet className={"w-[763px] border-[#4CAF50] px-8"}>
      <div className={"flex items-center justify-center gap-6"}>
        <TitleSheets title={"input"} size={"xl"} sizeTablet={"[20px]"}/>
        <img src={imageUri.iconImg.iconArrow} className="hidden tablet:flex w-[75px] h-6"/>
        <TitleSheets title={"データ構造"} icon={"struct"} size={"xl"} sizeTablet={"[20px]"}/>
        <img src={imageUri.iconImg.iconArrow} className="hidden tablet:flex w-[75px] h-6"/>
        <TitleSheets title={"output"} size={"xl"} sizeTablet={"[20px]"}/>
      </div>

      <div className={"flex items-center justify-center gap-6 mt-4"}>
        <Button
          onClick={handleAddDataSetModal}
          variant={"contained"}
          className={"bg-[#F5F7FB] border-solid border-[#4CAF50] border-2 text-black  whitespace-nowrap"}
          endIcon={<Add/>}
        >
          Data set
        </Button>
      </div>

      <div className="flex justify-items-stretch mt-3 gap-4">
        {/* Output */}
        <InOutColumn data={dataSet} type={"output"}/>
        {/* Data */}
        <div className={"data w-full min-w-[260px]"}>
          {dataSet.map((item) => (
            <CardSheet key={item.id + "dataSet2"} className={"w-full py-2 mb-2 last:mb-0"}>
              <div className="top flex justify-between items-center">
                <div className="title text-lg font-bold">
                  {item.title}
                </div>
                <IconButton className={"-mr-3"}>
                  <DeleteOutline/>
                </IconButton>
              </div>
              <div className=" -ml-2 -mr-2">
                {item.data.map(it => (
                  <DataSetItem item={it} key={it.id + "data" + item.id}/>
                ))}
              </div>
            </CardSheet>
          ))}
        </div>

        {/* Input */}
        <InOutColumn data={dataSet} type={"input"} />
      </div>
      <AddDataSetModal isOpen={isOpen} handleClose={() => setIsOpen(false)}/>
    </CardSheet>
  )
}

const DataSetItem = ({item}: DataSetItemProps) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (!item?.number) return;
    setValue(item.number);
  }, [item.number]);

  const handleChange = (e) => {
    console.log(e);
    setValue(e.target.value.toString())
  }

  return (
    <CardSheet className={"px-2 py-0 bg-[#F5F7FB] border-0 pb-2 mt-2"}>
      <div className="top flex justify-between items-center">
        <div className="title text-md">
          名前ファイル
        </div>
        <IconButton size={"small"} className={"-mr-2"}>
          <Close/>
        </IconButton>
      </div>
      <div className={"flex items-center"}>
        <SelectRow value={value} onChange={handleChange} className={"w-20 mr-4 bg-[#E1E9F2] border-0"}/>
        {item.icon === "dataSet" ? (
          <img src={imageUri.iconImg.iconDataSet} className="hidden tablet:flex w-6 h-6"/>
        ) : (
          <img src={imageUri.iconImg.spreadsheetsIcon} className="hidden tablet:flex w-6 h-6"/>
        )}
      </div>
    </CardSheet>
  )
}

const InOutColumn = ({data, type}: InOutListProps) => {
  return (
    <>
      <CardSheet className={"w-full border-0 px-[20px] bg-[#F5F7FB]"}>
        <div className={"relative w-full"}>
          <div
            className="absolute w-full title text-center text-lg font-bold border-0 border-solid border-gray-300 border-b">
            {type}
          </div>
        </div>
        <div className="dataSet">
          {data.map((item, index) => {
            return (
              <InOutList key={index} data={item} type={type}/>
            )
          })
          }
        </div>
      </CardSheet>
    </>
  )
}

const InOutList = ({data, type}: InOutListProps) => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    if (!data?.[type]) return;
    setDataList(data?.[type])
  }, [data]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(dataList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDataList(items);
  }
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId={data.id + type}>
        {(provided) => (
          <div className={"flex flex-col pt-11 mb-[38px] last:mb-0 gap-2.5"}  {...provided.droppableProps}
               ref={provided.innerRef}>
            {dataList.map((it, index) => {
              return (
                <Draggable key={it.id + "datasetitem" + type} draggableId={it.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <InOutItem item={it} type={type}/>
                    </div>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const InOutItem = ({item, type}: InOutItemProps) => {
  return (
    <div className={"relative h-[70px] block"}>
      {item?.name && (
        <>
          <CardSheet className={"border-lightGreen bg-lightGreen flex flex-col gap-1 py-2"}>
            <div className="flex gap-2 justify-center items-center">
              <div className={"text-white text-right w-20"}>
                名前
              </div>
              <div className={'w-full'}>
                {item?.name || "1"}
              </div>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div className={"text-white text-right w-20"}>
                値
              </div>
              <div className={'w-full flex gap-2'}>
                {item?.value || "1"}
              </div>
            </div>
          </CardSheet>
          <div
            className={`absolute flex w-full translate-y-[-50%] top-[50%] ${type === "output" ? "left-[100%]  justify-start" : "left-[-100%] justify-end"}`}>
            <img src={imageUri.iconImg.iconArrowData} className="hidden tablet:flex w-[46px] h-[18px]"/>
          </div>
        </>
      )}
    </div>
  )
}

export default DataSet;
