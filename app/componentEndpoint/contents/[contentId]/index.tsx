import React from 'react';
import MainContent from "@/app/components/Content/MainContent";
import {useRouter} from "next/navigation";

function Index() {
  const router = useRouter()
  const {contentId}: any = router.query;
  return (
    <MainContent id={contentId}/>
  );
}

export default Index;
