import NextArrow from "@/app/components/custom/NextArrow";
import PrevArrow from "@/app/components/custom/PrevArrow";

export const settings = {
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: false,
  speed: 500,
  autoplaySpeed: 2000,
  cssEase: "linear",
  nextArrow: <NextArrow/>,
  prevArrow: <PrevArrow/>
};
