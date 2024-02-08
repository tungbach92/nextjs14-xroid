import {CssTextField} from "@/app/components/custom/CssTextField";
import React from "react";
import {useSetAtom} from "jotai";
import {textInputRefAtom} from "@/app/store/atom/textInputRef.atom";
import {blockIdAtom} from "@/app/store/atom/blockId.atom";
import {saveButtonPropsAtom} from "@src/components/Layout/Header/SaveButton";
import {BlockPrompt, BlockWithoutCharPrompt} from "@/app/types/block";
import {TextFieldProps} from "@mui/material/TextField/TextField";

type Props = TextFieldProps & {
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  field: string
  placeholder: string
  state: string
  handleChangeState: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void
  block: BlockPrompt | BlockWithoutCharPrompt
  handleFocus: (p: string) => void
  bgColor?: string,
  onPressBackSpace: (event: React.KeyboardEvent<HTMLDivElement>) => void
}

export default function TextInputPromptV2({
  inputRef,
  field,
  state,
  handleChangeState,
  block,
  handleFocus,
  placeholder,
  bgColor,
  onPressBackSpace,
  ...props
}: Props) {
  const setTextInputRef = useSetAtom(textInputRefAtom)
  const setBlockId = useSetAtom(blockIdAtom)
  const setSaveButtonProps = useSetAtom(saveButtonPropsAtom);

  return (
    <div className={'py-2'}>
      <CssTextField
        {...props}
        maxRows={5}
        placeholder={placeholder}
        inputRef={inputRef}
        size={'small'}
        fullWidth={true}
        multiline={true}
        sx={{bgcolor: bgColor}}
        value={state}
        onChange={(e) => handleChangeState(e, field)}
        onFocus={() => {
          handleFocus(field)
          setSaveButtonProps((prev) => ({...prev, inputRef: inputRef}))
        }}
        onClick={() => {
          setTextInputRef(inputRef)
          setBlockId(block?.id ?? '')
        }}
        onKeyDown={onPressBackSpace}
      />
    </div>
  )
}
