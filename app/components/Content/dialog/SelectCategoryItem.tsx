import React from 'react';
import {ContentCategory} from "@/app/types/types";
import {Chip, Tooltip} from "@mui/material";

type props = {
  childCategories: ContentCategory[]
  categoryName: string
  onSelectedCategory: (category: ContentCategory) => void
  selectedIds?: string[]
}

function SelectCategoryItem({childCategories, categoryName, onSelectedCategory, selectedIds}: props) {
  return (
    <div className={'flex flex-col gap-2 p-2 justify-items-center'}>
      <Tooltip title={`${categoryName}`}>
        <div className={'text-xl truncate max-w-fit'}>
          {categoryName}
        </div>
      </Tooltip>
      <div className={'flex gap-2 p-2 border flex-wrap border-blue-200 border-solid rounded'}>
        {
          childCategories?.length === 0 &&
          <div className={'text-center text-gray-400'}>
            カテゴリーがありません。
          </div>
        }
        {
          childCategories?.map((childCategory: ContentCategory) => {
            const isSelected = selectedIds?.includes(childCategory?.id)
            const check = selectedIds?.includes(childCategory?.id)
            return (
              <div key={childCategory?.id} className={'max-w-[100px]'}>
                <Tooltip title={`${childCategory?.name}`}>
                  <Chip label={childCategory?.name}
                        onClick={() => `${check ? {} : onSelectedCategory(childCategory)}`}
                        size="medium"
                        className={`${isSelected ? 'border-solid border bg-blue-100 border-[#1976D2]' : ''}  rounded-md cursor-pointer truncate`}/>
                </Tooltip>
              </div>
            )
          })
        }
      </div>
    </div>

  );
}

export default SelectCategoryItem;
