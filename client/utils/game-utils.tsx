import { numberPair } from "@/types";

export function calcVectorAngle(vec1: numberPair, vec2: numberPair) {
  try {
    let dotProduct: number = calcDotProduct(vec1, vec2);
    let vec1Length: number = Math.sqrt(
      vec1.reduce(
        (accumulator, currentValue) => accumulator + currentValue ** 2,
        0
      )
    );
    let vec2Length: number = Math.sqrt(
      vec2.reduce(
        (accumulator, currentValue) => accumulator + currentValue ** 2,
        0
      )
    );

    return Math.acos(dotProduct / (vec1Length * vec2Length)) * (180 / Math.PI);
  } catch (e) {
    console.log(
      "An error occured, check that correct types are passed to calcVectorAngle"
    );
    return 0;
  }
}

export function calcDotProduct(vec1: numberPair, vec2: numberPair) {
  let dotProduct = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
  }
  return dotProduct;
}
