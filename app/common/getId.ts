import {genId} from "cf-gen-id";

export const getId = (prefix: string, size: number) => {
  return genId({prefix, size})
}
