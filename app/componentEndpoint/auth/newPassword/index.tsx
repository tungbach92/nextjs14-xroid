import * as React from 'react';
import {ReactNode} from 'react';
import styles from '../../../styles/Login.module.css'
import {Button} from "@mui/material";
import {useRouter} from "next/navigation";
import TextOutlineCustom from "@/app/components/custom/TextOutlineCustom";
import BlankLayout from "@src/components/Layout/LoginLayout";

export default function PasswordChangeNew() {
  const router = useRouter()

  return (
    <div className={styles.body}>
      <div>
        <div className={styles.textLogin}>ロゴとxroid studio</div>
        <div className={styles.container}>
          <div className={"text-center mb-5"}>パスワード再設定</div>
                    <div className={"mb-3.5"}>
                        <TextOutlineCustom
                            id={"password"}
                            label={"パスワード"}
                        />

                    </div>
                    <div className={"mb-3.5"}>
                        <TextOutlineCustom
                            id={"enterPassword"}
                            label={"パスワード（確認用）"}
                        />
                    </div>
                    <div className={"text-center"}>
                        <div>
                            <Button
                                onClick={() => router.push('/')}
                                className={'bg-[#1976D2] text-white w-[100%] mb-2 mt-2'}
                                variant="contained">送信</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

PasswordChangeNew.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

