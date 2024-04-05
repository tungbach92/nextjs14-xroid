import {BASE_API_URL, DATA_STRUCTURE_URL} from "@/app/auth/urls";
import {DataStructure} from "@/app/types/types";

export async function fetchListStructure(accessToken: string, folderId: string): Promise<DataStructure[]> {
  if (!folderId) return []
  try {
    const res = await fetch(`${DATA_STRUCTURE_URL}?folderId=${folderId}`, {
      headers: {'Authorization': `Bearer ${accessToken}`},
      next: {tags: ['listStructures']}
    })
    const data = await res.json();
    // @ts-ignore
    return data?.data?.dataStructures
  } catch (e) {
    console.log(e)
  }
}
