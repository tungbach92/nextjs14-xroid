export const convertInputNumber = (value: string | number = 0) => {
  let number: number | string = 0;

  if(value) {
    number = Number(value).toString();
  } else {
    number = '0';
  }

  return number;
}
