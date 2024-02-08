import * as React from 'react';
import {ReactNode, useState} from 'react';
import styles from '../../../styles/Login.module.css'
import {Button} from "@mui/material";
import {useRouter} from "next/navigation";
import BlankLayout from "@src/components/Layout/BlankLayout";
import TextFieldCustom from "@/app/components/custom/TextFieldCustom";
import axios from "axios";
import {FORGOT_PASSWORD_URL, MENTOROID_PREFIX} from "@/app/auth/urls";


export default function PasswordRetrieval() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState(null)
  const [emailDidSend, setEmailDidSend] = useState(false)
  const handleForgotPassword = async () => {
    try {
      if (!email)
        return setError("登録したメールアドレスを入力してください。")
      const res = await axios.post(
        FORGOT_PASSWORD_URL,
        {
          email: email,
          redirect_url: `${MENTOROID_PREFIX}/auth/login`
        }
      );
      if (res?.status === 200) {
        setError(null)
        setEmailDidSend(true)

      }
    } catch (e) {
      console.log(e)
      if (e && e?.response?.data?.error_code.toString().includes('email-not-found')) {
        setError('メールアドレスは誤りがあります。')
      }
      if (e && e?.response?.data?.error_code.toString().includes('invalid-email')) {
        setError('メールアドレスは誤りがあります。')
      }
    }

  }
  return (
    <div className={styles.body}>
      <div>
        <div className={styles.textLogin}>ロゴとxroid studio</div>
        <div className={styles.container}>
          <div className={"text-center mb-5"}>パスワード再設定</div>
          <div className={"mb-3.5"}>
            <TextFieldCustom
              id="email"
              label={"メールアドレス"}
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              error={error}
              helperText={error}
              disabled={emailDidSend}
            />
          </div>
          {
            emailDidSend && <div className="mb-3.5 text-sm">パスワード再設定メールを送りました。ご確認ください。</div>
          }

          <div className={"text-center mb-3.5"}>
            {
              !emailDidSend &&
                <div>
                    <Button
                        onClick={handleForgotPassword}
                        className={'bg-[#1976D2] text-white w-[100%]'}
                        variant="contained">再設定メールを送信</Button>
                </div>
            }
            <div className={"mt-3.5"}>
              <span onClick={() => router.push('/auth/login')}
                    className={"text-[#1976D2] cursor-pointer ml-2"}>ログイン画面に戻る</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

PasswordRetrieval.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
