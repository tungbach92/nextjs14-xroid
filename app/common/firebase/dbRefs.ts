import {collection, doc, orderBy, query, where} from "firebase/firestore";
import {db} from "@/app/configs/firebase";
import {OWNER_ID, TEST_AND_OWNER_ID} from "../../../common/ownerId";
import {isProd} from "@/app/configs/constants";

const userCollRef = () => {
  return collection(db, 'users')
}
const dataStructureCollRef = (userId) => {
  if (!userId) return null
  return query(
    collection(db, 'dataStructures'),
    where("isDeleted", "==", false),
    where("userId", "==", userId)
  )
}

const textCollRef = (userId) => {
  if (!userId) return null
  return query(
    collection(db, 'texts'),
    where("isDeleted", "==", false),
    where("userId", "==", userId)
  )
}

const adminBannerRef = (userId: string) => {
  if (!userId) return null
  return query(
    collection(db, 'banners'),
    where("isDeleted", "==", false),
    where("userId", "==", userId)
  )
}

const adminPopupRef = (userId: string) => {
  if (!userId) return null
  return query(
    collection(db, 'popups'),
    where("isDeleted", "==", false),
    where("userId", "==", userId)
  )
}
const voiceColRef = (characterId: string) => {
  if (!characterId) return null
  return query(
    collection(db, 'characters', characterId, 'voices'),
    where("isDeleted", "==", false)
  )
}

const userDocRef = (userId: string) => {
  return doc(db, `/${userId}`);
};
const contentsRef = (userId: string) => {
  return query(
    collection(db, "contents"),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
  );
};

const contentsByFolderIdRef = (userId: string, folderId: string, arrange?: number) => {
  if (!folderId || !userId) return null
  return query(
    collection(db, "contents"),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
    where("folderId", "==", folderId),
    orderBy('updatedAt', arrange === 2 ? 'asc' : 'desc')
  );
}

const chaptersRef = (contentId) => {
  return query(
    collection(db, 'chapters'),
    where("contentId", "==", contentId),
    where("isDeleted", "==", false)
  )
}

const blocksColRef = (chapterId: string) => {
  return query(
    collection(db, 'chapters', chapterId, 'blocks'),
    orderBy('index', 'asc'),
    // where("isDeleted", "==", false),
  )
}

const voicesColRef = (characterId: string) => {
  if (!characterId) return null
  return query(
    collection(db, 'characters', characterId, 'voices'),
    where("isDeleted", "==", false),
  )
}

const foldersRef = (userId: string) => {
  return query(collection(db, "folders"),
    where("userId", "==", userId),
    where("isDeleted", "==", false));
};

const imagesRef = (userId: string, folderId: string) => {
  if (!folderId || !userId) return null
  return query(collection(db, "images"),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
    where("folderId", "==", folderId));
};
const videosRef = (userId: string) => {
  if (!userId) return null
  return query(collection(db, "images"),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
    where("mediaType", "==", "video"));
};

const subImagesByParentIdRef = (userId: string, folderIds: string[]) => {
  if (folderIds?.length == 0 || !userId) return null
  return query(collection(db, "images"),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
    where("folderId", "in", folderIds));
}

const folderDocRef = (folderId: string) => {
  return doc(db, `folders/${folderId}`);
};

const categoriesRef = (userId: string) => {
  if (!userId) return null
  return query(
    collection(db, 'categories'),
    where("isDeleted", "==", false),
    where("userId", "==", userId)
  )
}

const charactersRef = (userId: string) => {
  if (!userId) return null
  return query(
    collection(db, 'characters'),
    where("isDeleted", "==", false),
    where("userId", "==", userId)
  )
}
const uRoidTemplatesRef = (userId: string) => {
  if (!userId) return null
  return query(
    collection(db, 'uRoidTemplates'),
    where("isDeleted", "==", false),
    where("userId", "==", userId)
  )
}
const defaultCharactersRef = () => {
  return query(
    collection(db, 'characters'),
    where("isDeleted", "==", false),
    where("isTemplate", "==", true),
  )
}

const eneColorRankTextSettingsRef = (userId) => {
  return query(
    collection(db, 'enecolorRanks'),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
    where("type", "==", 'enecolor_rank_text'),
  )
}
const eneColorRankImgSettingsRef = (userId) => {
  return query(
    collection(db, 'enecolorRanks'),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
    where("type", "==", 'enecolor_rank_img'),
  )
}

const textSettingsRef = (userId) => {
  return query(
    collection(db, 'enecolorRanks'),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
    where("type", "==", 'text'),
  )
}

const allHistoriesRef = (userId: string, chapterId: string) => {
  return query(
    collection(db, 'histories', userId, 'revisionHistoryChapters'),
    where("chapterId", "==", chapterId),
    orderBy('createdAt', 'desc')
  )
}

const userRoidColRef = (userId: string) => {
  return query(
    collection(db, 'userRoids'),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
  )
}

const motionAndPoseColRef = (characterId: string) => {
  if (!characterId) return null
  return query(
    collection(db, 'characters', characterId, 'motions'),
    where("isDeleted", "==", false),
  )
}

const enecolorsCollRef = (userId) => {
  if (!userId) return null
  return query(
    collection(db, 'enecolors'),
    where("isDeleted", "==", false),
    where("userId", "==", userId),
    orderBy('updatedAt', 'desc')
  )
}
const adminEnecolorsCollRef = () => {
  return query(
    collection(db, 'enecolors'),
    where("isDeleted", "==", false),
    where('isShare', '==', true),
    where('userId', 'in', isProd() ? [OWNER_ID] : TEST_AND_OWNER_ID),
    orderBy('updatedAt', 'desc')
  )
}

const associateAIColRef = (userId: string) => {
  if (!userId) return null
  return query(
    collection(db, 'qa_documents_structs'),
    where("isDeleted", "==", false),
    where("userId", "==", userId),
    orderBy('updatedAt', 'desc')
  )
}

export {
  dataStructureCollRef,
  userCollRef,
  userDocRef,
  chaptersRef,
  contentsRef,
  foldersRef,
  imagesRef,
  blocksColRef,
  folderDocRef,
  adminBannerRef,
  adminPopupRef,
  textCollRef,
  categoriesRef,
  eneColorRankTextSettingsRef,
  eneColorRankImgSettingsRef,
  textSettingsRef,
  charactersRef,
  voicesColRef,
  allHistoriesRef,
  userRoidColRef,
  motionAndPoseColRef,
  voiceColRef,
  defaultCharactersRef,
  contentsByFolderIdRef,
  uRoidTemplatesRef,
  enecolorsCollRef,
  subImagesByParentIdRef,
  adminEnecolorsCollRef,
  videosRef,
  associateAIColRef
}
