'use client';

import MuiAppBar, {AppBarProps as MuiAppBarProps} from "@mui/material/AppBar";
import {Box, MenuItem, styled, Toolbar} from "@mui/material";
import EnvButtonWithMenu from "@/app/components/EnvButtonWithMenu";
interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: "white",
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
export default function Header() {
    return (
        <AppBar position="fixed">
            <Toolbar className={"flex justify-between"}>
                <Box className={"flex flex-row justify-center items-center gap-4"}>
                    <label className='flex flex-wrap justify-center items-center gap-2 text-black font-bold text-lg'>
                        {/*{*/}
                        {/*    isSaveButtonShowed*/}
                        {/*        ? */}
                                <>
                                    <img src={'/title.png'} alt={'title-img'} className={'w-8'}/>
                                    <HeaderTitle/>
                                </>
                        {/*        : <>*/}
                        {/*            <img src={'/title.png'} alt={'title-img'} className={'w-8'}/>*/}
                        {/*            {title}*/}
                        {/*        </>*/}

                        {/*}*/}
                    </label>
                </Box>
                {/*{*/}
                {/*    isSaveButtonShowed &&*/}
                {/*    <SaveButton/>*/}
                {/*}*/}
                {/*{*/}
                {/*  isStructBtnShowed &&*/}
                {/*  <SaveStructBtn/>*/}
                {/*}*/}
                <div className='flex gap-5 items-center'>
                    {
                        // <EnvButton
                        //   link={process.env.NEXT_PUBLIC_MENTOROID_API `+ '/docs'}
                        // />
                        // !isProd()
                        //     &&
                            <EnvButtonWithMenu
                                MenuItems={
                                    [
                                        <MenuItem key={"mentoroid"}
                                                  onClick={() => window.open(process.env.NEXT_PUBLIC_MENTOROID_API + '/docs', "_blank", 'noopener, noreferrer')}>
                                            Mentoroid API
                                        </MenuItem>,
                                        <MenuItem key={'enecolor'}
                                                  onClick={() => window.open(process.env.NEXT_PUBLIC_ENECOLOR_API + '/docs', "_blank", 'noopener, noreferrer')}>
                                            Enecolor API
                                        </MenuItem>,
                                        <MenuItem key={'MENTOROID_CONSOLE'}
                                                  onClick={() => window.open(process.env.NEXT_PUBLIC_MENTOROID_CONSOLE_URL, "_blank", 'noopener, noreferrer')}>
                                            Mentoroid Console
                                        </MenuItem>,
                                        <MenuItem key={'GENIAM_CONSOLE'}
                                                  onClick={() => window.open(process.env.NEXT_PUBLIC_GENIAM_CONSOLE_URL, "_blank", 'noopener, noreferrer')}>
                                            Geniam Console
                                        </MenuItem>,
                                    ]
                                }
                            />
                    }
                    {/*{*/}
                    {/*    router.query?.createChapter && router.query?.createChapter !== 'createChapter' &&*/}
                    {/*    <div className={'cursor-pointer text-black w-10 flex justify-center'}*/}
                    {/*         onClick={handleShowHistory}>*/}
                    {/*        <HistoryIcon/>*/}
                    {/*    </div>*/}
                    {/*}*/}
                    {/*/!*<LockContent isLocked={isLocked} className={'flex-row-reverse gap-0'}>*!/*/}
                    {/*/!*  <Button className={`${isLocked && 'opacity-50'}`} onClick={() => setIsShare(!isShare)}>*!/*/}
                    {/*/!*    <Image src='/icons/share-icon.svg' alt='share-icon' width={20} height={20}/>*!/*/}
                    {/*/!*  </Button>*!/*/}
                    {/*/!*</LockContent>*!/*/}
                    {/*<div className={'text-darkBlue'}>{planText}</div>*/}
                    {/*{*/}
                    {/*    ((isProd() && enterprise?.isEnterprise) || userInfo.email.includes(CF_EMAIL) || userInfo?.user_id === OWNER_ID) &&*/}
                    {/*    <KudenUsingSetting enterprise={enterprise} setEnterprise={setEnterprise}/>*/}
                    {/*}*/}
                    {/*<IconButton onClick={handleOpen}>*/}
                    {/*    <Avatar src={userInfo?.avatar || userInfo?.photoURL}/>*/}
                    {/*</IconButton>*/}
                </div>
            </Toolbar>
            {/*{*/}
            {/*    isShare && <ShareLink open={isShare} setOpen={setIsShare}/>*/}
            {/*}*/}
            {/*<Popover*/}
            {/*    id={id}*/}
            {/*    open={open}*/}
            {/*    anchorEl={anchorEl}*/}
            {/*    onClose={handleClose}*/}
            {/*    anchorOrigin={{*/}
            {/*        vertical: 'bottom',*/}
            {/*        horizontal: 'left',*/}
            {/*    }}*/}
            {/*>*/}

            {/*    <div className="flex p-3 items-center"><Avatar className={"mr-3"}*/}
            {/*                                                   src={userInfo?.avatar || userInfo?.photoURL}/><span>{userInfo?.email}</span>*/}
            {/*    </div>*/}
            {/*    <div className={"h-[1px] bg-[#cccccc]"}/>*/}
            {/*    <div*/}
            {/*        className="flex items-center p-3 cursor-pointer hover:opacity-70"*/}
            {/*        onClick={handleLogOut}*/}
            {/*    >*/}
            {/*        <Image*/}
            {/*            src="/icons/logOut.svg"*/}
            {/*            alt=""*/}
            {/*            width={40}*/}
            {/*            height={35}*/}
            {/*            className={"mr-3"}*/}
            {/*        /><span>ログアウト</span></div>*/}
            {/*</Popover>*/}
        </AppBar>
    )
}

const HeaderTitle = () => {

    // const content = useAtomValue(contentAtom);
    // const [chapter] = useChapterAtom()
    // const router = useRouter()
    // const onToContent = () => {
    //     router.push(`/contents/${content?.id}`)
    // }

    return (
        <div className="breadcrumbs text-sm">
            <ul className={'m-0'}>
                {/* append content thumbnail */}

                <li
                    // onClick={onToContent}
                >
                    <a className={'flex gap-1'}>
                        {/*{content?.thumbnail &&*/}
                        {/*    <img src={content.thumbnail} width={40} height={'auto'} alt={'content'}/>}*/}
                        {/*<div className={'truncate max-w-[150px]'}>*/}
                        {/*    {content?.title}*/}
                        {/*</div>*/}
                    </a>
                </li>
                <li>
                    <div className={'flex flex-col'}>
                        {/*{*/}
                        {/*    router.query?.createChapter !== 'createChapter' ?*/}
                        {/*        chapter?.title : null*/}
                        {/*}*/}

                        {/*{!isProd() && router.query?.createChapter !== 'createChapter' ?*/}
                        {/*    <div className={'flex flex-col'}>*/}
                        {/*        <ChapterUrlComponent chapter={chapter} blocks={false}/>*/}
                        {/*        <ChapterUrlComponent chapter={chapter} blocks={true}/>*/}
                        {/*    </div> : null*/}
                        {/*}*/}
                    </div>
                </li>
            </ul>
        </div>
    )
}