import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {storage} from "@/app/configs/firebase";
import {v4} from "uuid";

export const handleUploadFile = async (file: File, userId: string, folder = "images") => {
  const imageRef = ref(storage, `${folder}/${userId}/${v4() + "_" + file?.name}`);
  const snapshot = await uploadBytes(imageRef, file);
  try {
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (e) {
    console.error(e);
  }
};

export const handleUploadQADoc = async (file: File, userId: string) => {
  const imageRef = ref(storage, `qa_documents/${userId}/${v4() + "_" + file?.name}`);
  const snapshot = await uploadBytes(imageRef, file);
  try {
    const url = await getDownloadURL(snapshot.ref);
    const fileLocation = snapshot.ref.bucket + '/' + snapshot.ref.fullPath;
    return {url, fileLocation};
  } catch (e) {
    console.error(e);
  }
};

