import React from "react";
import MainImage from "@/app/components/imagePage/MainImage";
import useGetImageFolders from "@/app/hooks/useGetImageFolders";
import {useRouter, useSearchParams} from "next/navigation";

type Props = {}

function Index({}: Props) {
  useGetImageFolders();
  const router = useRouter();
  const searchParams = useSearchParams()
  const id = searchParams.get('id');

  return (
    <MainImage isSubFolder={true} folderId={id as string}/>
  );
}

export default Index;
