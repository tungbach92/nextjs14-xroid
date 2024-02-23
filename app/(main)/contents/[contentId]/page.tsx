import MainContent from "@/app/components/Content/MainContent";

export default function ContentPage({ params }: { params: { contentId: string } }) {
  return (
    <MainContent id={params.contentId}/>
  )
}
