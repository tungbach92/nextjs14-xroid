import {Block} from "@/app/types/block";

export const checkTimerTriggerPosition = (blocks: Block [], blockIndex: number) => {
  let startIndex = -1;
  let endIndex = -1;

  for (let i = blockIndex; i > 0; i--) {
    if (blocks[i]?.type === 'timer_start') {
      startIndex = i;
      break;
    }
    if (blocks[i]?.type === 'timer_end') {
      startIndex = -1;
      break;
    }
  }

  for (let i = blockIndex; i < blocks?.length; i++) {
    if (blocks[i]?.type === 'timer_end') {
      endIndex = i;
      break;
    }
    if (blocks[i]?.type === 'timer_start') {
      endIndex = -1;
      break;
    }
  }

  if (blockIndex === startIndex) return true;
  return startIndex !== -1 && endIndex !== -1 && blockIndex !== -1 && startIndex < blockIndex && blockIndex < endIndex;
}
