import {handleUploadFile} from "@/app/common/uploadImage/handleUploadFile";
import jsmediatags from "jsmediatags";

export const uploadMusic = async (event, blocks, setLoadingImg, userInfo, setAudioUrl, setAudioName, setPreviewAudioUrl) => {
  try {
    setLoadingImg(true)
    if (event.target.files[0]) {
      const file = event.target.files[0];
      setAudioName(file.name)

      const audioUrl = await handleUploadFile(file, userInfo.user_id, "audio");
      setAudioUrl(audioUrl)

      jsmediatags.read(file, {
        onSuccess: function (tag) {
          const image = tag?.tags?.picture;
          let base64String = "";
          for (let i = 0; i < image?.data?.length; i++) {
            base64String += String.fromCharCode(image?.data[i]);
          }
          let previewAudioUrl = ""
          image?.format ? previewAudioUrl = "data:" + image?.format + ";base64," + window.btoa(base64String) : previewAudioUrl = '/icons/no-image-frees.png'

          setPreviewAudioUrl(previewAudioUrl);
        },
        onError: function (error) {
          console.log(":(", error.type, error.info);
        },
      });
    }
  } catch (e) {
    console.log(e)
  } finally {
    setLoadingImg(false)
  }
};
