import React, {SetStateAction, useState} from "react";
import {Popover} from "@mui/material";
import {BaseDeleteModal} from "@/app/components/base";
import {Character, TextVoice} from "@/app/types/types";
import {Check, DeleteForever} from "@mui/icons-material";
import BuildIcon from "@mui/icons-material/Build";
import {
  deleteCharacterVoice,
  getCharacterVoiceDefault,
  setCharacterVoiceDefault,
  updateCharacter
} from "@/app/common/commonApis/characterVoiceSetting";
import {toast} from "react-toastify";
import {AudioModal} from "@/app/components/Mentaloids/modal";
import {useMutation, useQueryClient} from "@tanstack/react-query";

type Props = {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLDivElement>>;
  textVoice?: TextVoice;
  setTextVoice?: React.Dispatch<React.SetStateAction<TextVoice>>
  selectedChar?: Character;
  setSelectedChar?: React.Dispatch<SetStateAction<Character>>;
  toggleOpenModal?: () => void;
  voiceDefault?: any,
  setVoiceDefault?: React.Dispatch<React.SetStateAction<any>>
  isDefault?: boolean
};

function AudioPopup({
  anchorEl,
  setAnchorEl,
  textVoice,
  selectedChar,
  setSelectedChar,
  toggleOpenModal,
  voiceDefault,
  setVoiceDefault,
  isDefault = false
}: Props) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;
  const [isUpdate, setIsUpdate] = useState(false)
  const [isLoadingDel, setIsLoadingDel] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const handleClose = () => {
    setAnchorEl(null);
  };

  const {mutate: deleteCharAudio, isPending: isPendingDelete} = useMutation(
    {
      mutationFn: async (id: string) => await deleteCharacterVoice(selectedChar?.id, id),
      onSuccess: () => {
        setOpenDeleteModal(false);
        handleClose();
        toast.success('音声合成を削除しました。')
        queryClient.invalidateQueries({
          queryKey: ['voices', selectedChar?.id]
        })
      },
      onError: (e) => {
        toast.error('音声合成が削除できませんでした。')
        console.log(e)
      },
    }
  )
  const onDeleteAudio = async () => {
    deleteCharAudio(textVoice?.id)
  };

  const handleSetVoiceDefault = async () => {
    try {
      await setCharacterVoiceDefault(selectedChar?.id, {
        voiceId: textVoice?.id
      })
      const res = await getCharacterVoiceDefault(selectedChar?.id)
      const defaultVoice = res
      setVoiceDefault(defaultVoice)
      await updateCharacter({
        ...selectedChar,
        voiceId: defaultVoice.id
      } satisfies Character)
      toast.success('デフォルト音声を設定しました。')
      setAnchorEl(null)
    } catch (e) {
      toast.error('デフォルト音声のエラーが出ました。')
      console.log(e)
    }
  }

  return (
    <div>
      {openPopover && (
        <Popover
          id={id}
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <div className={"p-3 rounded-xl"}>
            {
              !isDefault &&
              <div>
                <div className="flex gap-2 items-center cursor-pointer hover:opacity-70 mb-3"
                     onClick={handleSetVoiceDefault}>
                  <Check fontSize={"small"}/>
                  <span>Set Default</span>
                </div>
                <div className={"h-px bg-gray-300"}/>
              </div>
            }
            <div className="my-3 gap-2  flex items-center cursor-pointer hover:opacity-70 "
                 onClick={() => setIsUpdate(true)}>
              <BuildIcon fontSize={"small"}/>
              <span>Edit</span>
            </div>
            <div className={"h-px bg-gray-300"}/>
            <div
              className="flex gap-2 items-center cursor-pointer hover:opacity-70 mt-3"
              onClick={() => setOpenDeleteModal(true)}
            >
              <DeleteForever fontSize={"small"}/>
              <span>Delete</span>
            </div>
          </div>
        </Popover>
      )}
      <AudioModal
        voice={textVoice}
        updateVoice={true}
        isOpen={isUpdate}
        handleClose={() => setIsUpdate(false)}
        selectedChar={selectedChar}
        setSelectedChar={setSelectedChar}
      />
      <BaseDeleteModal
        label={`${textVoice?.voiceName}音声合成を削除しますか？`}
        isOpen={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleDelete={onDeleteAudio}
        isDisabled={isLoadingDel}
      />
    </div>
  );
}

export default AudioPopup;
