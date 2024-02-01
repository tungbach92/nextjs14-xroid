export default function HeaderTitle() {
    // NODE_ENV = 'development' or 'production' when running even we don't include in env
    const title = process.env.NODE_ENV === "production" ? 'Xroid Studio β' : '[dev] Xroid Studio β'
    console.log(title)
    return (
        <>
            <img src={'/title.png'} alt={'title-img'} className={'w-8'}/>
            {title}
        </>
    )
}