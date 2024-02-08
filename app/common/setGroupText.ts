import {BlockText, GroupTextV2} from "@/app/types/block";
import {findIndex} from "lodash";
import {Enecolor16Image, Enecolor16Rank, Enecolor4Image, Enecolor4Rank} from "@/app/common/colorData";

interface Props {
  block: BlockText
  output_type: string
  resultUserInputs: string[]
}

export const setGroupText = ({block, resultUserInputs, output_type}: Props) => {
  const groupsText: GroupTextV2[] = []
  if (output_type === 'text') return block.data.groupsText = []
  resultUserInputs?.length && resultUserInputs.forEach((r) => {
    const idx = findIndex(block.data.groupsText, {userInput: r})
    let groups = block.data.groupsText?.[idx]?.groups || []
    if (idx === -1) {
      let color = ''
      switch (output_type) {
        case 'enecolor_4':
          groups = Enecolor4Rank.map((g) => g.url)
          color = 'Y'
          break
        case 'enecolor_16':
          groups = Enecolor16Rank.map((g) => g.url)
          color = 'YCS'
          break
        case 'enecolor_4_rank':
          groups = Enecolor4Image.map((g) => g.url)
          break
        case 'enecolor_16_rank':
          groups = Enecolor16Image.map((g) => g.url)
          break
        default:
          break
      }
      groupsText.push({
        groups,
        userInput: r,
        rank: 1,
        color,
      })
    } else {
      groupsText.push({
        groups: block.data.groupsText[idx].groups,
        userInput: block.data.groupsText[idx].userInput,
        rank: block.data.groupsText[idx].rank,
        color: block.data.groupsText[idx].color,
      })
    }
  })
  block.data.groupsText = groupsText
}
