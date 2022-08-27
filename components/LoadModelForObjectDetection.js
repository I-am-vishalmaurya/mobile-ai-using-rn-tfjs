import {View, Text, StyleSheet, Alert} from 'react-native';
import React from 'react';
import * as tf from '@tensorflow/tfjs';
import {
  decodeJpeg,
  fetch,
  bundleResourceIO,
} from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

export default function LoadModelForObjectDetection(props) {
  const [ready, setReady] = React.useState(false);
  const [loadedModel, setLoadedModel] = React.useState(null);

  const loadModel = async () => {
    await tf.ready();
    const modelJson = require('../assets/model.json');
    // const modelWeights = require('../assets/model_weights.bin');

    const model = await tf.loadGraphModel(
      bundleResourceIO(modelJson, [
        require('../assets/best_web_model/group1-shard1of7.bin'),
        require('../assets/best_web_model/group1-shard2of7.bin'),
        require('../assets/best_web_model/group1-shard3of7.bin'),
        require('../assets/best_web_model/group1-shard4of7.bin'),
        require('../assets/best_web_model/group1-shard5of7.bin'),
        require('../assets/best_web_model/group1-shard6of7.bin'),
        require('../assets/best_web_model/group1-shard7of7.bin'),
      ]),
    );

    // let [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);
    setLoadedModel(model);
    setReady(true);
  };

  const inference = async () => {
    if (!ready || !loadedModel || props.source === null) {
      console.log('Getting here');
      return;
    }
    console.log('Startin inference');
    const imgB64 = await FileSystem.readAsStringAsync(props.source, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log('Passed 2 step');
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    console.log('Passed 3 step');
    const raw = new Uint8Array(imgBuffer);
    console.log('Passed 4 step');
    const imageTensor = decodeJpeg(raw).div(255.0).expandDims(0);
    // console.log('Load model function', imageTensor);
    console.log('Passed 5 step');
    const predictions = await loadedModel.executeAsync(
      tf.browser.fromPixels(imageTensor),
    );

    console.log('Passed 6 step');

    return predictions;
  };

  if (props.runInference) {
    console.log('Here');
    inference().then(r => console.log(r));
    console.log('After inference');
  }

  React.useEffect(() => {
    loadModel();
  }, []);
  return (
    <View style={styles.sectionContainer}>
      {ready ? (
        <Text style={styles.sectionTitle}>TensorFlow.js is ready to use!</Text>
      ) : (
        <Text style={styles.sectionTitle}>
          TensorFlow.js is not ready to use yet.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
});
