import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {memo, ReactNode, useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import PageTransferConfirmationDialog from "@/app/components/DialogCustom/PageTransferConfirmationDialog";
import {useSetAtom} from "jotai";
import {openDialogStructAtom} from "@/app/store/atom/openDialogStruct.atom";
import {useQueryClient} from "@tanstack/react-query";
import {fetchOwnerStudios} from "@/app/common/fetchOwnerStudios";

type ItemMenuProps = {
  icon?: ReactNode | any;
  name: string;
  path: string;
  open?: boolean;
};

const MenuItem = ({icon, name, open, path}: ItemMenuProps) => {
  const router = useRouter();
  const asPath = usePathname()
  const [pathName, setPathName] = useState("");
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false)
  const setOpenDialogStruct = useSetAtom(openDialogStructAtom)
  const queryClient = useQueryClient();

  useEffect(() => {
    // if (asPath === "/mentoroid" && path === "/contents") {
    //   setPathName("/mentoroid");
    // } else {
    setPathName(path);
    // }
  }, [path]);

  function renderBg() {
    if (asPath === pathName) return "!text-[#2a76d2] !bg-blue-100";

    if (asPath.startsWith(pathName)) return "!text-[#2a76d2] !bg-blue-100";
  }

  // Prefetch and only useQuery fetch when click link after 10s
  const prefetchOwnerStudios = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['ownerStudios'],
      queryFn: fetchOwnerStudios,
      staleTime: 10000
    });
  };

  return (
    <div>
      <li>
        <Link href={path} onClick={(e) => {
          if (path === "/enecolors") prefetchOwnerStudios().then()
          setOpenDialogStruct(false)
          if (window["isDirtyChapter"]) {
            e.preventDefault()
            setIsShowDialog(true)
          }
        }}>
          <ListItemButton sx={{pl: 2.5}} className={`!hover:bg-blue-100 pl-[16px] ${renderBg()}`}>
            {icon && (
              <ListItemIcon sx={{minWidth: 40}}>
                <img className="w-[20px]" src={icon} alt="icon"/>
              </ListItemIcon>
            )}
            <ListItemText primary={name} sx={{opacity: open ? 1 : 0, transition: "300ms"}}/>
          </ListItemButton>
        </Link>
      </li>
      {
        isShowDialog && <PageTransferConfirmationDialog
          open={isShowDialog} setOpen={setIsShowDialog}
          onClickTextButton={() => {
            router.push(path)
            setIsShowDialog(false)
            window["isDirtyChapter"] = false
          }}
          onClickContainedButton={() => setIsShowDialog(false)}
          title={'保存せずにページを移動しようとしています。'}
          content={'このままページを移動すると変更内容が保存されません。'}
          titleTextButton={'移動する'} titleContainedButton={'ページに戻る'}/>
      }
    </div>
  );
};

export default memo(MenuItem);
