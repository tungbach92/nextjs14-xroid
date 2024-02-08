import {regexGetVar} from "@/app/configs/constants";

export const getListVarIndex = (draftText: string) => {
  let match;
  const indices: { startIndex: number, endIndex: number, value: string }[] = [];
  // Sử dụng regular expression để lấy index của ký tự đầu tiên "{" và ký tự cuối "}" trong mỗi cặp {{ }} và đẩy vào list indices
  while ((match = regexGetVar.exec(draftText)) !== null) {
    const startIndex = match.index;
    const endIndex = startIndex + match[0].length - 1;
    indices.push({startIndex, endIndex, value: match[0]});
  }
  return indices
}
