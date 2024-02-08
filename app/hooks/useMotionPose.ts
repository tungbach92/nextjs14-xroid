import {useEffect, useState} from "react";
import {Motion, Pose} from "@/app/types/types";
import {orderBy} from "lodash";
import {motionAndPoseColRef} from "@/app/common/firebase/dbRefs";
import {useCollection} from "react-firebase-hooks/firestore";

export const useMotionPose = (selectedCharId: string) => {
  const [motions, setMotions] = useState<Motion[] | null>(null)
  const [poses, setPoses] = useState<Pose[] | null>(null)
  const [values, loading, error] = useCollection(motionAndPoseColRef(selectedCharId))
  useEffect(() => {
    if (error || loading || (!loading && !values))
      return setMotions(null);
    const _motions = values.docs.filter((document) =>
      document.data().type === 'motion').map((document) => {
      return {
        ...document.data(),
        id: document.id,
      }
    })
    setMotions(orderBy(_motions, 'createdAt', 'asc') || [])
    const _poses = values.docs.filter((document) =>
      document.data().type === 'pose').map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      }
    })
    setPoses(orderBy(_poses, 'createdAt', 'asc') || [])
  }, [values, error, loading])
  return {motions, setMotions, setPoses, poses, loading, error};
}
