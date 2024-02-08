import {collection, getCountFromServer, limit, orderBy, query, where} from "firebase/firestore";
import {db} from "@/app/configs/firebase";

const contentRef = (userId: string, folderId: string | string[], contentLimit: number, numOfTab : number) => {
  return query(
    collection(db, "contents"),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
    where("folderId", "==", folderId),
    orderBy("updatedAt", numOfTab === 1 ? "desc" : "asc"),
    limit(contentLimit)
  );
};


const getCountContent = async (userId, folderId) => {
  const countContent = await getCountFromServer(
    query(
      collection(db, "contents"),
      where("userId", "==", userId),
      where("isDeleted", "==", false),
      where("folderId", "==", folderId)
    )
  );
  return countContent.data().count;
}

export {
  contentRef,
  getCountContent,
}
