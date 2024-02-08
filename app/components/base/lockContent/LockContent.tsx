import {iconImg} from "@/app/components/assets/image/icon";
import Image from "next/image";
import {DetailedHTMLProps, HTMLAttributes, PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";

interface Props extends PropsWithChildren,
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isLocked?: boolean
}

export const LockContent = ({children, className, isLocked}: Props) => {
  return (
    <>
      {
        isLocked ?
          <div
            className={twMerge('bg-[#D9D9D9]/50 p-2 flex gap-2 items-center rounded-md pointer-events-none', className)}>
            {children}
            <Image src={iconImg.lockIcon} alt={'lock'} width={25} height={27} className={'bg-white p-1 rounded-md'}/>
          </div>
          : children
      }
    </>
  );
}

