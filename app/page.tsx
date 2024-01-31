import AcmeLogo from '@/app/ui/acme-logo';
import {ArrowRightIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {lusitana} from '@/app/ui/fonts';
import Image from 'next/image';
import {Metadata} from "next";
import {useRouter} from "next/navigation";
import Head from "next/head";
import {LoadingButton} from "@mui/lab";
import Button from "@mui/material/Button";
import {Avatar, IconButton, InputAdornment} from "@mui/material";
import {CssTextField} from "@/app/components/CssTextField";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {deepPurple} from "@mui/material/colors";

export const metadata: Metadata = {
    title: 'login',
};
export default function Page() {
    // const router = useRouter()
    // const [email, setEmail] = useState<string>('')
    // const [password, setPassword] = useState<string>('')
    // const [loading, setLoading] = useState(false)
    // const [errors, setErrors] = useState(null)
    // const [, setUserInfo] = useAtom<any>(userAtomWithStorage)
    // const passwordRef = React.useRef<HTMLInputElement>(null)
    // const [user, setUser] = useState(null)
    // const [loadingEmail, setLoadingEmail] = useState(false)
    // const [showPassword, setShowPassword] = useState<boolean>(false)


    const handleLogin = async (e: any) => {
        // e.preventDefault();
        // setLoading(true)
        // setErrors(null)
        try {
            // const user: any = await loginAsync(email, password, {});
            // setTokenAndRedirect({
            //     setUserInfo,
            //     access_token: user.stsTokenManager.accessToken,
            //     refresh_token: user.stsTokenManager.refreshToken
            // }, router).then()

        } catch (err: any) {
            console.log(err.toString())
            if (err && ['The password is invalid', 'FirebaseError: Firebase: Error (auth/wrong-password).'].includes(err.toString())) {
                // setErrors({password: 'パスワードは間違いです。'})
            }
            if (err && err.toString().includes('user-not-found')) {
                // setErrors({email: 'メールアドレスは誤りがあります。'})
            }
            if (err && err.toString().includes('invalid-email')) {
                // setErrors({email: '電子メール アドレスが無効です。'})
            }
            if (err && err.toString().includes('auth/too-many-requests')) {
                // setErrors({password: 'ログインに何度も失敗したため、アカウントがロックされている。 パスワードをリセットしてすぐに復元するか、後でもう一度試すことができます。'})
                // setErrors({password: 'パスワードは間違いです。'})
            }
            if (err && err.toString().includes('auth/user-disabled')) {
                // setErrors({email: 'このアカウントは無効になっています。'})
            }
        } finally {
            // setLoading(false);
        }
    };
    const socialLogin = async (provider: any) => {
        // try {
        //     const result = await signInWithPopup(auth, provider)
        //     const loginData: any = result.user;
        //     const {data} = await axios.post(`${API_PREFIX}/signin-social`, {
        //         email: loginData.email,
        //         uid: loginData.uid,
        //         displayName: loginData.displayName,
        //         photoURL: loginData.photoURL
        //     })
        //     await setTokenAndRedirect({
        //         setUserInfo,
        //         access_token: loginData?.stsTokenManager?.accessToken,
        //         refresh_token: loginData?.stsTokenManager?.refreshToken
        //     }, router)
        // } catch (err) {
        //     console.log('Error while signing', err.message)

    }

    // const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);
    const handleClickShowPassword = () => {
    };

    const handleMouseDownPassword = (event: any, type ?: string) => {
        if (type === 'back') {
            // setPassword('')
        } else {
            event.preventDefault();
        }
    };

    const onClickGmail = async () => {
        // setLoadingEmail(true)
        // try {
        //     const res = await loginEmailAsync(email);
        //     if (res) {
        //         setUser(res?.data)
        //         setErrors(null)
        //     }
        // } catch (e) {
        //     if (e?.response?.data?.message === 'No User Data') {
        //         setErrors({email: 'メールアドレスが不正です。'})
        //         setUser(null)
        //     }
        // } finally {
        //     setLoadingEmail(false)
        // }
    }
    return (
        <div className={'bg-white min-w-fit h-[100vh] flex justify-center'}>
            <div className={'bg-white border-solid border-8 rounded-3xl border-black my-auto mx-2'}>
                {/*<div className={`${styles.container} xl:w-[500px] w-[400px]`}>*/}
                <div className={`w-[400px]`}>
                    <div className={'flex justify-center relative pb-5'}>
                        <img src={'/xRoidFavicon.ico'} alt={'logo'} className={'w-[50px] absolute top-0 left-0'}/>
                        <div className={'text-black font-bold font-sans text-[32px] text-center'}>HXクラウド Geniam</div>
                    </div>
                    <div className={'text-black font-bold font-sans text-[32px] text-center'}>Xroid Studio</div>
                    <div
                        className={"text-center mb-5 text-black font-bold font-sans"}>
                        {/*{!user ? 'メールアドレスの入力' : 'ようこそ'}*/}
                        メールアドレスの入力
                    </div>
                {/*    {*/}
                {/*        user &&*/}
                {/*        <div className={'flex justify-between'}>*/}
                {/*            <div className={'flex text-black items-center gap-2 mb-5'}>*/}
                {/*                {*/}
                {/*                    user.avatar ?*/}
                {/*                        <img src={user?.avatar} className={'w-[50px] rounded-full'} alt={'avatar'}/> :*/}
                {/*                        <Avatar sx={{bgcolor: deepPurple[300]}}*/}
                {/*                                className={'w-[50px] h-[50px] text-[24px]'}*/}
                {/*                        >{user?.first_name[0] ?? user?.last_name[0]}</Avatar>*/}
                {/*                }*/}
                {/*                <div className={'flex flex-col'}>*/}
                {/*<span>*/}
                {/*  {user?.first_name ? user?.first_name : '' + ' ' + user?.last_name ? user?.last_name : ''}*/}
                {/*</span>*/}
                {/*                    <span>*/}
                {/*  {user?.email ?? ''}*/}
                {/*</span>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div>*/}
                {/*                <IconButton*/}
                {/*                    className={'w-[50px] h-[50px]'}*/}
                {/*                    aria-label="toggle password visibility"*/}
                {/*                    onClick={() => setUser(null)}*/}
                {/*                    onMouseDown={(e) => handleMouseDownPassword(e, 'back')}*/}
                {/*                    edge="end"*/}
                {/*                >*/}
                {/*                    <ArrowBackIosIcon/>*/}
                {/*                </IconButton>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    }*/}
                {/*    {*/}
                {/*        (errors?.email === 'メールアドレスが不正です。' || !user || (!user && errors)) &&*/}
                {/*        <div*/}
                {/*            className={`mb-5 gap-2 flex justify-between ${errors?.email ? 'items-start' : 'items-center'}`}>*/}
                {/*            <CssTextField*/}
                {/*                size={'small'}*/}
                {/*                className={"w-3/4"}*/}
                {/*                id="emailLogin"*/}
                {/*                label={"メールアドレス"}*/}
                {/*                value={email}*/}
                {/*                onChange={(e: any) => setEmail(e.target.value)}*/}
                {/*                InputLabelProps={{shrink: true}}*/}
                {/*                inputProps={{style: {height: 28}}}*/}
                {/*                error={errors?.email}*/}
                {/*                helperText={errors?.email}*/}
                {/*                onKeyDown={(e: { key: string; }) => {*/}
                {/*                    if (e.key === 'Enter') {*/}
                {/*                        // console.log(passwordRef.current)*/}
                {/*                        passwordRef.current?.blur();*/}
                {/*                        onClickGmail().then()*/}
                {/*                    }*/}
                {/*                }}*/}
                {/*            />*/}
                {/*            <LoadingButton*/}
                {/*                size={'large'}*/}
                {/*                loading={loadingEmail}*/}
                {/*                disabled={loadingEmail}*/}
                {/*                onClick={onClickGmail}*/}
                {/*                className={`${!loadingEmail ? 'bg-[#4CAF50]' : 'bg-gray'} text-white font-bold px-[10px]`}*/}
                {/*                variant="contained">*/}
                {/*                ログイン*/}
                {/*            </LoadingButton>*/}
                {/*        </div>*/}
                {/*    }*/}

                    {/*{*/}
                    {/*    user &&*/}
                    {/*    <div*/}
                    {/*        className={`mb-5 flex justify-between ${errors?.password ? 'items-start' : 'items-center'}`}>*/}
                    {/*        <CssTextField*/}
                    {/*            type={showPassword ? "text" : "password"}*/}
                    {/*            size={'small'}*/}
                    {/*            id={"passWordLogin"}*/}
                    {/*            className={"w-3/4"}*/}
                    {/*            label={"パスワード"}*/}
                    {/*            inputProps={{style: {height: 28}}}*/}
                    {/*            onChange={(e: any) => setPassword(e.target.value)}*/}
                    {/*            value={password}*/}
                    {/*            error={errors?.password}*/}
                    {/*            helperText={errors?.password}*/}
                    {/*            ref={passwordRef}*/}
                    {/*            InputProps={{*/}
                    {/*                endAdornment: (*/}
                    {/*                    <InputAdornment position="end">*/}
                    {/*                        <IconButton*/}
                    {/*                            aria-label="toggle password visibility"*/}
                    {/*                            onClick={handleClickShowPassword}*/}
                    {/*                            onMouseDown={handleMouseDownPassword}*/}
                    {/*                            edge="end"*/}
                    {/*                        >*/}
                    {/*                            {showPassword ? <img src={'/icons/eye.png'} alt={'eye'}/> :*/}
                    {/*                                <img src={'/icons/hideEye.png'} alt={'hideEye'}/>}*/}
                    {/*                        </IconButton>*/}
                    {/*                    </InputAdornment>*/}
                    {/*                )*/}
                    {/*            }}*/}
                    {/*            onKeyDown={(e: { key: string; }) => {*/}
                    {/*                if (e.key === 'Enter') {*/}
                    {/*                    // console.log(passwordRef.current)*/}
                    {/*                    passwordRef.current?.blur();*/}
                    {/*                    handleLogin(e).then()*/}
                    {/*                }*/}
                    {/*            }}*/}
                    {/*        />*/}
                    {/*        <LoadingButton*/}
                    {/*            size={'large'}*/}
                    {/*            loading={loading}*/}
                    {/*            disabled={loading}*/}
                    {/*            onClick={handleLogin}*/}
                    {/*            className={`${!loading ? 'bg-[#4CAF50]' : 'bg-gray'} text-white font-bold px-[10px]`}*/}
                    {/*            variant="contained">ログイン</LoadingButton>*/}
                    {/*    </div>*/}
                    {/*}*/}
                    <div className={"text-center text-black"}>
                        <div className={'pb-2'}>
                            <Button
                                // onClick={() => router.push('/auth/passwordRetrieval')}
                                className={'text-[#4CAF50] bg-transparent'}
                                variant="text">パスワードを忘れた方はこちら</Button>
                        </div>
                        <div className={"mb-2 grid grid-cols-12"}>
                            <hr className={"border-gray-100 opacity-30 col-span-5 w-full h-[1px] mt-4"}/>
                            <span className={"col-span-2"}>または</span>
                            <hr className={"border-gray-100 opacity-30 col-span-5 w-full h-[1px] mt-4"}/>
                        </div>
                        <div className={"mb-4 flex flex-col gap-5 pt-5"}>
                            {/*   {*/}
                            {/*       dataSocial.map((item, index) => {*/}
                            {/*           return (*/}
                            {/*               <div key={index}*/}
                            {/*                    onClick={() => socialLogin(item.provider)}*/}
                            {/*                    style={{*/}
                            {/*                        backgroundColor: item.backgroundColor,*/}
                            {/*                    }}*/}
                            {/*                    className={`${index === 0 ? 'text-black' : 'text-white'} grid grid-cols-12 text-black h-12 items-center*/}
                            {/*justify-between w-full rounded-xl cursor-pointer hover:opacity-70`}>*/}
                            {/*                   <Image*/}
                            {/*                       src={item.image}*/}
                            {/*                       alt=""*/}
                            {/*                       width={24}*/}
                            {/*                       height={24}*/}
                            {/*                       className={"rounded-full border-3 cursor-pointer w-12 col-span-4"}*/}
                            {/*                   />*/}
                            {/*                   <span*/}
                            {/*                       className={"uppercase flex justify-items-start col-span-8 my-auto font-bold"}>{item.title}</span>*/}
                            {/*               </div>*/}
                            {/*           )*/}
                            {/*       })*/}
                            {/*   }*/}

                        </div>
                        <div>
                            <Button
                                // onClick={() => router.push('/auth/register')}
                                className={'text-[#1976D2] bg-transparent'}
                                variant="text">ご登録はこちら</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    // return (
    //   <main className="flex min-h-screen flex-col p-6">
    //     <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
    //        <AcmeLogo />
    //     </div>
    //     <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
    //       <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
    //         <div
    //             className={'shape'}
    //         />
    //         <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
    //           <strong>Welcome to Acme.</strong> This is the example for the{' '}
    //           <a href="https://nextjs.org/learn/" className="text-blue-500">
    //             Next.js Learn Course
    //           </a>
    //           , brought to you by Vercel.
    //         </p>
    //         <Link
    //           href="/login"
    //           className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
    //         >
    //           <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
    //         </Link>
    //       </div>
    //       <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
    //           {/* Add Hero Images Here */}
    //           <Image
    //               src="/hero-desktop.png"
    //               width={1000}
    //               height={760}
    //               className="hidden md:block"
    //               alt="Screenshots of the dashboard project showing desktop version"
    //           />
    //           <Image
    //               src="/hero-mobile.png"
    //               width={560}
    //               height={620}
    //               className="block md:hidden"
    //               alt="Screenshot of the dashboard project showing mobile version"
    //           />
    //       </div>
    //     </div>
    //   </main>
    // );
}
