import React from 'react';
import MainContent from "@/app/components/Content/MainContent";
import {useRouter, useSearchParams} from "next/navigation";

function Index() {
  const query = useSearchParams()
  const {contentId}: any = query;
  return (
    <MainContent id={contentId}/>
  );
}

export default Index;
