import {
    Image,
    ImageBackground,
    ImageSourcePropType,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';


type BackgroundRewardModalProps = {
  visible: boolean;
  backgroundImage: ImageSourcePropType;
  backgroundName: string;
  onOk: () => void;
};


const ITEM_REWARD_BG =
  require(
    '../../../assets/images/quest/item-reward-bg.png'
  );

const REWARD_OK_BUTTON =
  require(
    '../../../assets/images/quest/reward-ok-button.png'
  );


export default function BackgroundRewardModal({
  visible,
  backgroundImage,
  backgroundName,
  onOk,
}: BackgroundRewardModalProps) {

  return (

    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onOk}
    >

      <View style={styles.overlay}>

        <View style={styles.rewardContainer}>

          <ImageBackground
            source={ITEM_REWARD_BG}
            style={styles.rewardBackground}
            resizeMode="contain"
          >

            <View style={styles.rewardContent}>


              {/* =========================
                  BACKGROUND ACQUIRED
              ========================= */}

              <Text style={styles.rewardTitle}>
                Background Acquired!
              </Text>


              {/* =========================
                  BACKGROUND IMAGE
              ========================= */}

              <View style={styles.backgroundArea}>

                <Image
                  source={backgroundImage}
                  style={styles.backgroundImage}
                  resizeMode="contain"
                />

              </View>


              {/* =========================
                  BACKGROUND NAME
              ========================= */}

              <Text
                style={styles.backgroundName}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.82}
              >
                {backgroundName}
              </Text>


              {/* =========================
                  DESCRIPTION
              ========================= */}

              <Text style={styles.description}>
                Added to your background collection.
              </Text>


              {/* =========================
                  OK BUTTON
              ========================= */}

              <Pressable
                style={styles.okPressable}
                onPress={onOk}
              >

                <ImageBackground
                  source={REWARD_OK_BUTTON}
                  style={styles.okBackground}
                  resizeMode="contain"
                >

                  <Text style={styles.okText}>
                    OK
                  </Text>

                </ImageBackground>

              </Pressable>


            </View>

          </ImageBackground>

        </View>

      </View>

    </Modal>

  );

}


const styles =
  StyleSheet.create({


    /* =========================
       OVERLAY
    ========================= */

    overlay: {

      flex: 1,

      backgroundColor:
        'rgba(35, 22, 13, 0.48)',

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal:
        12,

    },


    /* =========================
       REWARD CONTAINER
    ========================= */

    rewardContainer: {

      width:
        '82%',

      maxWidth:
        350,

      aspectRatio:
        1037 / 1284,

    },


    rewardBackground: {

      width:
        '100%',

      height:
        '100%',

      position:
        'relative',

    },


    /* =========================
       CONTENT POSITION
    ========================= */

    rewardContent: {

      position:
        'absolute',

      top:
        '17%',

      bottom:
        '6%',

      left:
        '13%',

      right:
        '13%',

      alignItems:
        'center',

    },


    /* =========================
       TITLE
    ========================= */

    rewardTitle: {

      color:
        '#A96A24',

      fontSize:
        20,

      lineHeight:
        24,

      fontFamily:
        'MapseePixelBold',

      textAlign:
        'center',

      marginBottom:
        12,

    },


    /* =========================
       BACKGROUND AREA
    ========================= */

    backgroundArea: {

      width:
        '100%',

      height:
        135,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginBottom:
        10,

    },


    backgroundImage: {

      width:
        '100%',

      height:
        '100%',

    },


    /* =========================
       BACKGROUND NAME
    ========================= */

    backgroundName: {

      width:
        '100%',

      color:
        '#3B281A',

      fontSize:
        15,

      lineHeight:
        19,

      fontFamily:
        'MapseeFredokaBold',

      textAlign:
        'center',

      paddingHorizontal:
        4,

      marginTop:
        2,

    },


    /* =========================
       DESCRIPTION
    ========================= */

    description: {

      width:
        '92%',

      color:
        '#76583B',

      fontSize:
        11,

      lineHeight:
        15,

      fontFamily:
        'MapseeFredokaMedium',

      textAlign:
        'center',

      marginTop:
        12,

      marginBottom:
        18,

    },


    /* =========================
       OK BUTTON
    ========================= */

    okPressable: {

      width:
        '52%',

      aspectRatio:
        378 / 136,

      alignSelf:
        'center',

    },


    okBackground: {

      width:
        '100%',

      height:
        '100%',

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    okText: {

      color:
        '#3D2C1E',

      fontSize:
        14,

      fontFamily:
        'MapseePixel',

      textAlign:
        'center',

    },


  });