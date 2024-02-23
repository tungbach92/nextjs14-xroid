import * as React from 'react';
import {ReactNode, useState} from 'react';
import styles from '../../../styles/Login.module.css'
import {Button} from "@mui/material";
import {useRouter} from "next/navigation";
import TextFieldCustom from "@/app/components/custom/TextFieldCustom";
import validate from 'validate.js'
import {registerEmailAsync} from "@/app/auth/api";
import {REGISTER_KEY} from "@/app/configs/constants";
import showAxiosError from "@/app/common/showAxiosError";

export default function Register() {
  const router = useRouter()
  const [checked, setChecked] = useState<boolean>(true)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const [disable, setDisable] = useState(false)
  const validateState = () => {
    const constraints = {
      email: {
        email: {
          message: "メールアドレスが不正です。",
        }
      }
    };
    return validate({email}, constraints, {fullMessages: false})
  }

  const onChange = (e) => {
    setEmail(e.target.value)
    setErrors(null)
  };

  const onRegister = async () => {
    const errors = validateState();
    if (errors) {
      setErrors(errors)
      return;
    }

    setLoading(true)
    try {
      const service_id = 0
      const course_id = 0
      const res: any = await registerEmailAsync(email, {service_id, course_id});

      if (res.status === 210 && res.data.message === "Email Already Exists: mails") {
        setErrors({email: [`このアカウントが既に存在しています。`]})

      } else {
        setDisable(true)
        store.set(REGISTER_KEY, {email: email})

      }
    } catch (err) {
      showAxiosError(err);
      if (err && err.response && err.response.data && err.response.data.message) {
        if (err.response.data.message === "User is already confirmed.") {
          setErrors({
              email: [err.response.data.message]
            }
          )
        } else if (err.response.data.message === "Attempt limit exceeded, please try after some time.") {
          setErrors({
            email: ["しばらく経ってから、もう一度メールアドレスを入力してください。\n" +
            "※短時間に複数回同じメールアドレスが入力されると、セキュリティ上エラーが発生します。"]
          })
        }
      }

    } finally {
      setLoading(false)
    }
  };
  const onEmailInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      onRegister().then();
    } else {
    }
  };
  return (
    <div className={styles.body}>
      <div>
        <div className={styles.textLogin}>ロゴとxroid studio</div>
        <div className={styles.container}>
          <div className={"text-center mb-5"}>メールアドレス登録</div>
          <div className={"mb-3.5"}>
            <TextFieldCustom
              id="email"
              label={"メールアドレスを入力してください"}
              value={email}
              onChange={onChange}
              onKeyDown={onEmailInputKeyDown}
              autoFocus={true}
              disabled={loading || disable}
              helperText={errors && errors.email ? errors.email[0] : null}
              error={!!(errors && errors.email)}
            />
          </div>
          {disable && <div>上記のメールアドレスに登録情報入力フォームを送信しました。</div>}
          {/*<div className={"mb-3.5"}>*/}
          {/*  <TextFieldCustom*/}
          {/*    id="number"*/}
          {/*    label={"電話番号"}*/}
          {/*  />*/}
          {/*</div>*/}
          {/*<div className={"mb-3.5"}>*/}
          {/*  <TextOutlineCustom*/}
          {/*    id={"password"}*/}
          {/*    label={"パスワード"}*/}
          {/*  />*/}

          {/*</div>*/}
          {/*<div className={"mb-3.5"}>*/}
          {/*  <TextOutlineCustom*/}
          {/*    id={"enterPassword"}*/}
          {/*    label={"パスワード（確認用）"}*/}
          {/*  />*/}
          {/*</div>*/}
          {/*<div className={"p-2.5"}>*/}
          {/*  <FormControlLabel*/}
          {/*    checked={checked}*/}
          {/*    onChange={() => setChecked(!checked)}*/}
          {/*    control={<Checkbox defaultChecked/>}*/}
          {/*    label={<span className={"text-[#1976D2] text-[16px]"}>利用規約・プライバシーポリシーに同意します</span>}/>*/}
          {/*</div>*/}
          <div className={"text-center"}>
            {
              !disable &&
                <div>
                    <Button
                        onClick={onRegister}
                        disabled={loading || disable}
                        className={'bg-[#1976D2] text-white w-[100%] mb-2 mt-2'}
                        variant="contained">登録フォーム送信</Button>
                </div>
            }
            <div className={"mt-3.5"}>
              すでにアカウントをお持ちの方は
              <span onClick={() => router.push('/auth/login')}
                    className={"text-[#1976D2] cursor-pointer"}>こちら</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
