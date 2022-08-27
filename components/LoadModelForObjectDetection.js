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
    const modelWeights = require('../assets/model_weights.bin');

    const model = await tf.loadGraphModel(
      bundleResourceIO(modelJson, modelWeights),
    );

    let [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);
    // Warmup the model. This isn't necessary, but makes the first prediction
    // faster.
    // tf.engine().startScope();
    // try {
    //   const img = tf.tidy(() => {
    //     return tf.image.resizeBilinear(
    //       tf.zeros([320, 320, 3]).div(255.0).expandDims(0),
    //     );
    //   });
    //   await model.executeAsync(img);
    // } catch (e) {
    //   console.log(e);
    // }

    // tf.engine().endScope();
    // App crahed with no error shown, shown tf errors

    setLoadedModel(model);
    setReady(true);
  };

  const inference = async () => {
    if (!ready || !loadedModel || props.source === null) {
      return;
    }
    console.log('Startin inference');
    const imgB64 = await FileSystem.readAsStringAsync(props.source, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    const raw = new Uint8Array(imgBuffer);
    const imageTensor = decodeJpeg(raw).div(255.0).expandDims(0);
    console.log('Load model function', imageTensor);
    try {
      tf.engine().startScope();
      console.log('Begining inference');
      await loadedModel.executeAsync(imageTensor);
      console.log('Inference complete');
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Could not detect image');
    } finally {
      tf.engine().endScope();
    }
  };

  if (props.runInference) {
    inference();
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
