/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import LoadImage from './components/LoadImage';
import LoadModelForObjectDetection from './components/LoadModelForObjectDetection';

const App = () => {
  const [imageSource, setImageSource] = React.useState(null);
  const [runInference, setRunInference] = React.useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const prepareImage = source => {
    setImageSource(source);
  };

  const onPredict = () => {
    setRunInference(true);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <LoadModelForObjectDetection
          source={imageSource}
          runInference={runInference}
        />
        <LoadImage setImage={prepareImage} onPredict={onPredict} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  highlight: {
    fontWeight: '700',
  },
  scrollViewContent: {
    marginTop: 30,
  },
});

export default App;
