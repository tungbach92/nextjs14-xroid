import {Studio} from "@/app/types/types";
import {getStudiosByIds} from "@/app/common/commonApis/studio";
import {TEST_AND_OWNER_ID} from "../../common/ownerId";

export const fetchOwnerStudios = async (): Promise<Studio[]> => {
  const res = await getStudiosByIds(TEST_AND_OWNER_ID)
  return res.data.data
}
