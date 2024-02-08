export const setCharsInContent = (selectedChars, blocks, setBlocks) => {
  selectedChars?.forEach((character) => {
    const _newData = blocks?.map((i: any) => {
      i.characters = i.characters?.map((c: any) => {
        if (c.id === character.id) {
          c.isShow = character.isShow
        }
        if (c.isAction && !c.isShow) {
          c.isAction = false
        }
        if (!c.isAction && !c.isShow) {
          c.isVoice = false
        }
        return {...c, isURoidTemplate: character.isURoidTemplate}
      })
      // const _characters = i?.characters?.filter((c) => c.isAction || c.isShow)
      // if (_characters?.find((c) => c.isVoice) === undefined) {
      //   const _voice = _characters?.find((c) => !c.isVoice)
      //   if (_voice) {
      //     _voice.isVoice = true
      //   }
      // }
      const idxIsAction = i?.characters?.findIndex((c) => c.isAction && c.isShow)
      blocks[idxIsAction]?.characters?.map((c: any, index: number) => {
        if (index === idxIsAction) {
          return {
            ...c,
            isVoice: true,
          }
        } else {
          return {
            ...c,
            isVoice: false,
          }
        }
      })
      return i
    })
    setBlocks(_newData)
  })

}
