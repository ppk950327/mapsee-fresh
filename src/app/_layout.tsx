import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';

import { CharacterProvider } from '../context/CharacterContext';
import { CollectionProvider } from '../context/CollectionContext';


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Pixelify
    MapseePixel:
      require('../../assets/fonts/pixelify.ttf'),

    MapseePixelBold:
      require('../../assets/fonts/pixelify_bold.ttf'),


    // Fredoka
    MapseeFredoka:
      require('../../assets/fonts/fredoka.ttf'),

    MapseeFredokaMedium:
      require('../../assets/fonts/fredoka_medium.ttf'),

    MapseeFredokaBold:
      require('../../assets/fonts/fredoka_bold.ttf'),
  });


  if (!fontsLoaded) {
    return null;
  }


  return (
    <CollectionProvider>
      <CharacterProvider>
        <Slot />
      </CharacterProvider>
    </CollectionProvider>
  );
}