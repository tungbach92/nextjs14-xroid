import React from 'react';
import MainContent from "@/app/components/Content/MainContent";
import {useRouter} from "next/navigation";

function CreateContentSubFolder() {
  const router = useRouter()
  const {id, subFolder}: any = router.query;
  return (
    <MainContent id={id} subFolder={subFolder}/>
  );
}

export default CreateContentSubFolder;
