import {Studio} from "@/app/types/types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchOwnerStudios} from "@/app/common/fetchOwnerStudios";

export const useGetOwnerStudios = () => {
  const queryClient = useQueryClient();

  const {data, isLoading, isError, isFetching, error} = useQuery({
    queryKey: ['ownerStudios'],
    queryFn: fetchOwnerStudios,
    initialData: (): Studio[] => {
      const cachedData = queryClient.getQueryData(['ownerStudios']) as Studio[];
      if (cachedData?.length) {
        return cachedData;
      }
      return undefined;
    }
  })
  // console.log(isFetching)
  return {ownerStudios: data, loadingOwnerStudios: isLoading, isError, error}
}
