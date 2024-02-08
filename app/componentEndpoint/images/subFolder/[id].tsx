import React from "react";
import MainImage from "@/app/components/imagePage/MainImage";
import useGetImageFolders from "@/app/hooks/useGetImageFolders";
import {useRouter} from "next/navigation";
type Props = {}

function Index({}: Props) {
  useGetImageFolders();
  const router = useRouter();
  const {query: {id}} = router;

  return (
    <MainImage isSubFolder={true} folderId={id as string} />
  );
}

export default Index;
