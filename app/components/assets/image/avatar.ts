import {getUriPublicImageFolder} from "@/app/utils/image";

const folder = "avatar";

function getUri(name: string) {
  return getUriPublicImageFolder(name, folder);
}

export const avtImg = {
  avtRabbit: getUri("avt_rabbit.svg"),
  avtEna: getUri("avt_ena.svg"),
  avtMale: getUri("avt_male.svg"),
  avtRabbit1: getUri("avt_rabbit_1.svg"),
  avtEnaCharacter: getUri("avt_ena_character.svg"),
  avtMenCharacter: getUri('avt_men_character.svg'),
  avtDuck: getUri("avt_duck.png"),
  soundOn: getUri("soundOn.png"),
  soundOff: getUri("soundOff.png"),
  akarSoundOff: getUri("akar-icons_sound-off.svg")
};
