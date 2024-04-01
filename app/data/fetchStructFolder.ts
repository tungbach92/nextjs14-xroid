import {BASE_API_URL} from "@/app/auth/urls";

export async function fetchStructFolder(accessToken: string) {
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
