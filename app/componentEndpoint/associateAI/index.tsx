import React, {useState} from 'react';
import OpenAiGPTDialog from "@/app/components/associateAI/OpenAIGPTDialog";
import {useAtom} from "jotai";
import {userAtomWithStorage} from "@/app/store/atom/user.atom";
import {useAssociateAIs} from "@/app/hooks/useAssociates";
import QaDocList from "@/app/components/associateAI/Qa_DocList";
import {openQaDocsModalAtom} from "@/app/store/atom/openQaDocsModal.atom";

function Index() {
  const [openModal, setOpenModel] = useState<boolean>(false)
  const [userInfo] = useAtom<any>(userAtomWithStorage);
  const {associateAIs, loading} = useAssociateAIs(userInfo?.user_id)
  const maxIndex = associateAIs?.length ? Math.max(...associateAIs?.map((d) => d?.index)) : -1;

  return (
    <div className={'text-black'}>
      <div className={'p-10 flex flex-col'}>
        <span className={'text-xl font-bold'}>データ連携</span>
        <QaDocList width={'w-[40%]'}
                   loading={loading}
                   associateAIs={associateAIs}
                   userId={userInfo?.user_id}
                   setOpenModel={setOpenModel}
                   showEditButton={true}
        />

        <OpenAiGPTDialog openModal={openModal}
                         isUpdate={false}
                         setOpenModel={setOpenModel}
                         userId={userInfo?.user_id}
                         index={maxIndex + 1}/>
      </div>
    </div>
  );
}

export default Index;
