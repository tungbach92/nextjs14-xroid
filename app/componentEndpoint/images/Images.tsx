'use client'
import React, {useEffect, useState} from "react";
import {useAtomValue} from "jotai";
import useGetImageFolders from "@/app/hooks/useGetImageFolders";
import {imageFoldersAtom} from "@/app/store/atom/folders.atom";
import {selectedImageFolderAtom} from "@/app/store/atom/selectedFolder.atom";
import {Folder} from "@/app/types/folders";
import MainImage from "@/app/components/imagePage/MainImage";

function Images(props) {
  useGetImageFolders();
  const imageFolders = useAtomValue(imageFoldersAtom)
  const selectedImageFolder = useAtomValue(selectedImageFolderAtom)
  const [subImageFolders, setSubImageFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (!imageFolders?.length || !selectedImageFolder?.id) return
    const result = imageFolders?.filter(folder => folder.parentId === selectedImageFolder.id)
    setSubImageFolders(result)
  }, [imageFolders, selectedImageFolder?.id])

  return (
    <MainImage subImageFolders={subImageFolders} isSubFolder={false} />
  );
}

export default Images;
