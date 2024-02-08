import {useAtom} from "jotai";
import {atomWithStorage} from "jotai/utils";

const lastSavedDate = atomWithStorage("lastSavedDate", {});
const useLastSavedDate = () => useAtom(lastSavedDate);
export default useLastSavedDate;
