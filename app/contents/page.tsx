import Head from "next/head";

export default function ContentsPage() {
    const title = process.env.NODE_ENV === "production" ? 'Xroid Studio β' : '[dev] Xroid Studio β'
    return (
        <>
            <Head>
                <title>{title} - Content</title>
            </Head>
            <div>Hello contents</div>
            {/*<HomePage/>*/}
        </>
    );
}