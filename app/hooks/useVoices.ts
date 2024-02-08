import {Studio, Voice} from "@/app/types/types";
import {getAllCharacterVoice} from "@/app/common/commonApis/characterVoiceSetting";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";

export const useVoices = (selectedCharId) => {
  const queryClient = useQueryClient();
  const {data: voices, isLoading: loadingVoice, isFetching, error} = useQuery({
    queryKey: selectedCharId ? ['voices', selectedCharId] : ['voices'],
    queryFn: async () => await getAllCharacterVoice(selectedCharId),
    initialData: (): Voice[] => {
      const cachedData = queryClient.getQueryData(['voices', selectedCharId]) as Studio[];
      if (cachedData?.length) {
        return cachedData;
      }
      return undefined;
    },
    enabled: false //disable fetch on mount
  })
  // console.log(isFetching)

  useEffect(() => {
    if (!selectedCharId || selectedCharId?.includes('uRoidTemp_')) return
    prefetchVoices().then()
  }, [queryClient, selectedCharId])

  // prefetch and call fetch after stale time 20s
  const prefetchVoices = async () => {
    await queryClient.prefetchQuery({
      queryKey: selectedCharId ? ['voices', selectedCharId] : ['voices'],
      queryFn: async () => await getAllCharacterVoice(selectedCharId),
      staleTime: 20000
    });
  };
  return {voices, loadingVoice}
}
