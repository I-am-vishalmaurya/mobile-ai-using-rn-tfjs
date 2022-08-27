// import {decodeJpeg, fetch} from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import {decodeJpeg, fetch} from '@tensorflow/tfjs-react-native';

const inputForImg = data => {
  return data.div(255.0).expandDims(0);
};

const prepareInference = async imageUri => {
  const response = await fetch(imageUri, {}, {isBinary: true});
  const imageDataArrayBuffer = await response.arrayBuffer();
  const imageData = new Uint8Array(imageDataArrayBuffer);
  // Decode image data to a tensor
  const imageTensor = decodeJpeg(imageData);
  console.log(inputForImg(imageTensor));
  return inputForImg(imageTensor);
};

export default prepareInference;
