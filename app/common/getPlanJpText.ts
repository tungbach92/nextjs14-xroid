import {Plan} from "@/app/types/types";
import {ENTERPRISE, FREE, PRO, SUPER_ADMIN, TEAM} from "@/app/configs/constants";

export const getPlanJpText = (plan: Plan) => {
  switch (plan) {
    case "free":
      return FREE;
    case "pro":
      return PRO;
    case "team":
      return TEAM;
    case "enterprise":
      return ENTERPRISE;
    case "superadmin":
      return SUPER_ADMIN
    default:
      return FREE;
  }
}
