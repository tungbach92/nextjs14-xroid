import {Button, ButtonProps} from "@mui/material";
import React from "react";
import {Enecolor} from "@/app/types/block";
import {styled} from "@mui/material/styles";

interface Props {
  handleChangeRankColor: (e) => void
  enecolor: Enecolor
  setFocusedColorLeft: React.Dispatch<React.SetStateAction<string>>
}

const data16 = [
  {color: 'YCS', bg: '#FFE600'},
  {color: 'YOS', bg: '#FFE600'},
  {color: 'RCS', bg: '#FF0000'},
  {color: 'ROS', bg: '#FF0000'},
  {color: 'YCG', bg: '#FFE600'},
  {color: 'YOG', bg: '#FFE600'},
  {color: 'RCG', bg: '#FF0000'},
  {color: 'ROG', bg: '#FF0000'},
  {color: 'GCS', bg: '#00C800'},
  {color: 'GOS', bg: '#00C800'},
  {color: 'BCS', bg: '#00AAFF'},
  {color: 'BOS', bg: '#00AAFF'},
  {color: 'GCG', bg: '#00C800'},
  {color: 'GOG', bg: '#00C800'},
  {color: 'BCG', bg: '#00AAFF'},
  {color: 'BOG', bg: '#00AAFF'}
]

const data4 = [
  {color: 'Y', bg: '#FFE600'},
  {color: 'R', bg: '#FF0000'},
  {color: 'G', bg: '#00C800'},
  {color: 'B', bg: '#00AAFF'},

]

type StyledButtonProps = ButtonProps & {
  hoverBgColor: string
  bgColor: string
}

const StyledButton = styled(Button, {
  shouldForwardProp: (props) => props !== "hoverBgColor" && props !== "bgColor",
})(({hoverBgColor, bgColor}: StyledButtonProps) => ({
  '&:hover': {
    backgroundColor: hoverBgColor
  },
  backgroundColor: bgColor
}));

export const SelectColor = ({enecolor, handleChangeRankColor, setFocusedColorLeft}: Props) => {
  const isEnecolor16 = enecolor.output_type === 'enecolor_16'

  const handleMouseOver = (x) => {
    setFocusedColorLeft(x.color)
  }

  const handleMouseOut = () => {
    setFocusedColorLeft('')
  }
  if (isEnecolor16)
    return (
      <div className={'w-[160px] h-[160px] grid grid-cols-4'}>
        {
          data16.map((x, index) => {
            return <StyledButton key={index}
                                 hoverBgColor={x.bg}
                                 bgColor={`${(enecolor?.groupsText?.color === x.color || enecolor.color === x.color) ? `${x.bg}` : '#9B9B9B'}`}
                                 data-color={x.color}
                                 className={`rounded-none min-w-max p-0 leading-none  border border-solid border-gray-600 hover:border-[1.5px] hover:border-solid hover:border-blue-600`}
                                 variant={'outlined'} onClick={handleChangeRankColor}
                                 onMouseOver={() => handleMouseOver(x)}
                                 onMouseOut={handleMouseOut}
            ></StyledButton>
          })
        }
      </div>
    )
  else
    return (
      <div className={'w-[40px] h-[40px] grid grid-cols-2'}>
        {
          data4.map((x, index) => {
            return <StyledButton key={index}
                                 hoverBgColor={x.bg}
                                 bgColor={`${(enecolor?.groupsText?.color === x.color || enecolor.color === x.color) ? `${x.bg}` : '#9B9B9B'}`}
                                 data-color={x.color}
                                 className={`rounded-none min-w-max p-0 leading-none  border border-solid border-gray-600 hover:border-[1.5px] hover:border-solid hover:border-blue-600`}
                                 variant={'outlined'} onClick={handleChangeRankColor}
                                 onMouseOver={() => handleMouseOver(x)}
                                 onMouseOut={handleMouseOut}
            ></StyledButton>
          })
        }
      </div>
    )
}
