// export let roundedNum = (number) => {
//   var numb = Number(number);
//   if(!isNaN(numb)) {
//     var rounded = Math.round((numb + Number.EPSILON) * 100) / 100;
//     return rounded
//   } else {
//     return 0
//   }
// }

export function roundedNum(input) {
  const num = +Number(input).toFixed(4);

  if (isNaN(num)) {
    return 0;
  }

  return num;
}