import Structures from "@/app/componentEndpoint/structures/Structures"
import {getListFolder} from "@/app/common/folders";
import {fetchStructFolder} from "@/app/data/fetchStructFolder";
import {cookies} from 'next/headers'
import {COOKIE_GENIAM_ACCESS_TOKEN_KEY} from "@/app/configs/constants";
import {revalidateTag} from "next/cache";

export default async function StructuresPage() {
  const cookieStore = cookies().get(COOKIE_GENIAM_ACCESS_TOKEN_KEY)
  const structFolders = await fetchStructFolder(cookieStore.value)
  if(!cookieStore.value) {
    revalidateTag('structFolders')
  }
  console.log(structFolders.length)
  return (
    <Structures structFolders={structFolders}/>
  )
}
