import {
    ImageBackground,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import {
    router,
} from 'expo-router';

import {
    IS_WEB,
    PHONE_MAX_WIDTH,
    colors,
} from '../theme';


/* =========================================================
   ABOUT SCREEN IMAGE
========================================================= */

const ABOUT_SCREEN =
  require(
    '../../assets/images/profile/about-screen.png'
  );


/* =========================================================
   ABOUT SCREEN
========================================================= */

export default function AboutScreen() {

  return (

    <View
      style={
        styles.screen
      }
    >

      <View
        style={
          styles.phoneFrame
        }
      >

        <ImageBackground
          source={
            ABOUT_SCREEN
          }

          style={
            styles.background
          }

          resizeMode="stretch"
        >

          {/* =========================
              BACK BUTTON
          ========================= */}

          <Pressable
            style={
              styles.backButton
            }

            onPress={() =>
              router.back()
            }
          />

        </ImageBackground>

      </View>

    </View>

  );

}


/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({

    screen: {

      flex:
        1,

      backgroundColor:
        colors.webBackdrop,

      alignItems:
        IS_WEB
          ? 'center'
          : 'stretch',

    },


    phoneFrame: {

      flex:
        1,

      width:
        '100%',

      maxWidth:
        IS_WEB
          ? PHONE_MAX_WIDTH
          : undefined,

      position:
        'relative',

      overflow:
        'hidden',

    },


    background: {

      flex:
        1,

      width:
        '100%',

      height:
        '100%',

    },


    backButton: {

      position:
        'absolute',

      top:
        '5%',

      left:
        '6%',

      width:
        '12%',

      height:
        '8%',

      zIndex:
        20,

    },

  });