import {CharacterBlock} from "@/app/types/types";

export default function mergeCharacters(nextChars: CharacterBlock[], currChar: CharacterBlock, position?: string): CharacterBlock[] {
  return nextChars.map((nextChar, index) => {
    let _nextChar = {...nextChar};
    const isVoice = _nextChar.isVoice
    const motionId = _nextChar.motionId ?? ''
    const voiceId = _nextChar.voiceId ?? ''
    const characterPrompt1 = _nextChar.characterPrompt1 ?? ''
    const characterPrompt2 = _nextChar.characterPrompt2 ?? ''
    const isAction = position ? currChar.isAction : !currChar.isAction
    const currPosition = position ?? currChar.position
    if (_nextChar.id === currChar.id) {
      _nextChar = {
        ...currChar,
        isAction,
        isVoice,
        position: currPosition,
        motionId,
        voiceId,
        characterPrompt1,
        characterPrompt2
      }
      // !defaultMotion && delete _nextChar.defaultMotion
      // !defaultVoice && delete _nextChar.defaultVoice
    }
    return _nextChar;
  });
}
