import {getUriPublicImageFolder} from "@/app/utils/image";

const folder = "icons";

function getUri(name: string) {
  return getUriPublicImageFolder(name, folder);
}

export const iconImg = {
  speakerIcon: getUri("speaker_icon.svg"),
  noImageIcon: getUri("no-image-icon.png"),
  iconCoefont: getUri("icon_coefont.svg"),
  iconReadSpeaher: getUri("icon_ReadSpeaher.svg"),
  iconStructures: getUri("data-structure-icon.svg"),
  spreadsheetsIcon: getUri("spreadsheets_icon.svg"),
  iconsDeleteDatabase: getUri("icons_delete-database.svg"),
  iconArrow: getUri("Arrow.png"),
  iconArrowData: getUri("arrowData.png"),
  iconDataSet: getUri("icon-data-set.png"),
  editDefault: getUri("editDefault.svg"),
  checkedCircle: getUri('check-circle-fill.svg'),
  textIcon: getUri('_レイヤー_1 (1).svg'),
  imageIcon: getUri('Isolation_Mode.svg'),
  videoIcon: getUri('_レイヤー_23.svg'),
  enecolorIcon: getUri('_レイヤー_1 (34).svg'),
  slideIcon: getUri('_レイヤ).svg'),
  inputIcon: getUri('_レイ).svg'),
  shinIcon: getUri('_レイヤー_1.svg'),
  gptAIIcon: getUri('_レイヤー_1 (1).svg'),
  imageAIIcon: getUri('Isolation_Mode.svg'),
  videoAIIcon: getUri('_レイヤー_23.svg'),
  uRoidIcon: getUri('Group 3310.png'),
  controlIcon: getUri('_レイヤー43324.svg'),
  lockIcon: getUri('Vector.png'),
  trashIcon: getUri('trash-icon.svg'),
  chatgptBtn: getUri('chatgptBtn.svg'),
  addInput: getUri('addInput.svg'),
  enecolorPage: getUri('enecolorPage.svg'),
  enecolor4: getUri('enecolor4.svg'),
  enecolor16: getUri('enecolor16.svg'),
  enecolorImg: getUri('enecolorImg.svg'),
  enecolorY: getUri('enecolorY.svg'),
  enecolorR: getUri('enecolorR.svg'),
  enecolorG: getUri('enecolorG.svg'),
  enecolorB: getUri('enecolorB.svg'),
  enecolor16_Y : getUri('enecolor16_Y.svg'),
  enecolor16_R : getUri('enecolor16_R.svg'),
  enecolor16_G : getUri('enecolor16_G.svg'),
  enecolor16_B : getUri('enecolor16_B.svg'),
  eneColorImage: getUri('eneImage.svg'),
  andom: getUri('andom.svg')
};
