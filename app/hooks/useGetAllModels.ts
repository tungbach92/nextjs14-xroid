import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Model} from "@/app/types/types";
import {useEffect} from "react";
import {getAllModels} from "@/app/common/commonApis/modelChatGPT";

export const useGetAllModels = () => {
  const queryClient = useQueryClient();
  const {data: modelList, isLoading: loadingModels, isFetching, error} = useQuery({
    queryKey: ['models'],
    queryFn: getAllModels,
    initialData: (): Model[] => {
      const cachedData = queryClient.getQueryData(['models']) as Model[];
      if (cachedData) {
        return cachedData;
      }
      return undefined;
    },
    enabled: false //disable fetch on mount
  })
  // console.log(isFetching)
  useEffect(() => {
    prefetchDefaultVoices().then()
  }, [queryClient])

  // prefetch and call fetch after stale time 20s
  const prefetchDefaultVoices = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['models'],
      queryFn: getAllModels,
      staleTime: 20000
    });
  };
  return {modelList, loadingModels}
}
