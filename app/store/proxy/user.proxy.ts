import {proxy} from "valtio";

const userProxy = proxy({
    user: <any>{},
    getUser() {
      return userProxy.user
    },
    setUser(data: any) {
      userProxy.user = data
    },
  },
  // {
  //     locale: memoize(snap => snap.user?.language?.substring(0, 2) || 'ja')
  // }
);

export {
  userProxy
};
