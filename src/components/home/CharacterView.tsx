
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  IS_WEB,
  PHONE_MAX_WIDTH,
} from '../../theme';


type CharacterViewProps = {

  source:
    ImageSourcePropType;

  gender?:
    'female' | 'male';

};


/* =========================================================
   CHARACTER VIEW
========================================================= */

export default function CharacterView({
  source,
}: CharacterViewProps) {

  const {
    width,
    height,
  } =
    useWindowDimensions();


  /* =======================================================
     PHONE FRAME WIDTH
  ======================================================= */

  const frameWidth =
    IS_WEB
      ? Math.min(
          width,
          PHONE_MAX_WIDTH
        )
      : width;


  /* =======================================================
     CHARACTER SIZE
  ======================================================= */

  const characterWidth =
    Math.min(
      frameWidth * 0.56,
      270
    );


  const characterHeight =
    Math.min(
      height * 0.36,
      390
    );


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <View
      style={
        styles.wrapper
      }

      pointerEvents="none"
    >

      <Image
        source={
          source
        }

        resizeMode="contain"

        style={{
          width:
            characterWidth,

          height:
            characterHeight,
        }}
      />

    </View>

  );

}


/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({

    wrapper: {

      alignItems:
        'center',

      justifyContent:
        'flex-end',

      transform: [
        {
          translateY:
            -35,
        },
      ],

    },

  });