import {BASE_API_URL} from "@/app/auth/urls";
import {Folder} from "@/app/types/folders";

export async function fetchStructFolder(accessToken: string) : Promise<Folder[]> {
  try {
    const res = await fetch(`${BASE_API_URL}/v2/folders/struct`, {
      headers: {'Authorization': `Bearer ${accessToken}`},
      next: {tags: ['structFolders']}
    })
    const data = await res.json();
    // @ts-ignore
    return data?.data?.folders
  } catch (e) {
    console.log(e)
  }
}
