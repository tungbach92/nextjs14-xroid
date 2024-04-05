import Structures from "@/app/componentEndpoint/structures/Structures"
import {getListFolder} from "@/app/common/folders";
import {fetchStructFolder} from "@/app/data/fetchStructFolder";
import {cookies} from 'next/headers'
import {COOKIE_GENIAM_ACCESS_TOKEN_KEY} from "@/app/configs/constants";
import {revalidatePath, revalidateTag} from "next/cache";
import {auth} from "@/app/configs/firebase";
import {getDataStructure} from "@/app/common/commonApis/dataStructure";
import {fetchListStructure} from "@/app/data/fetchListStructure";
import {sortBy} from "lodash";
import {Suspense} from "react";

export default async function StructuresPage() {
  const cookieStore = cookies().get(COOKIE_GENIAM_ACCESS_TOKEN_KEY)
  const structFolders = await fetchStructFolder(cookieStore.value)
  const listStructuresAllFolder = await Promise.all(structFolders?.map(async x => {
    if (!x.id) return {folderId: '', listDataStructures: []}
    const list = await fetchListStructure(cookieStore.value, x.id)
    const sorted = sortBy(list, ['index'], ['asc'])
    return {folderId: x.id, listDataStructures: sorted}
  }))

  return (
    <Structures structFolders={structFolders} listStructuresAllFoldersServer={listStructuresAllFolder}/>
  )
}
