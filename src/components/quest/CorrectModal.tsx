import {
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';


type CorrectModalProps = {
  visible: boolean;
  onClose: () => void;
  onNext: () => void;
};


const QUIZ_RESULT_BG =
  require(
    '../../../assets/images/quest/quiz-result-bg.png'
  );

const QUIZ_NEXT_BUTTON =
  require(
    '../../../assets/images/quest/quiz-next-button.png'
  );


export default function CorrectModal({
  visible,
  onClose,
  onNext,
}: CorrectModalProps) {

  return (

    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >

      <View style={styles.overlay}>


        <View style={styles.resultContainer}>


          <ImageBackground
            source={QUIZ_RESULT_BG}
            style={styles.resultBackground}
            resizeMode="contain"
          >


            {/* =========================
                CLOSE BUTTON
            ========================= */}

            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={8}
            >

              <Text style={styles.closeText}>
                ×
              </Text>

            </Pressable>


            {/* =========================
                CONTENT
            ========================= */}

            <View style={styles.content}>


              {/* =========================
                  CORRECT O
              ========================= */}

              <View style={styles.correctCircle} />


              {/* =========================
                  CORRECT
              ========================= */}

              <Text style={styles.correctTitle}>
                Correct!
              </Text>


              {/* =========================
                  GREAT JOB
              ========================= */}

              <Text style={styles.correctSubtitle}>
                Great job!
              </Text>


              {/* =========================
                  NEXT BUTTON
              ========================= */}

              <Pressable
                style={styles.nextPressable}
                onPress={onNext}
              >

                <ImageBackground
                  source={QUIZ_NEXT_BUTTON}
                  style={styles.nextBackground}
                  resizeMode="contain"
                >

                  <Text style={styles.nextText}>
                    Next
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
        18,

    },


    /* =========================
       RESULT BOX
    ========================= */

    resultContainer: {

      width:
        '88%',

      maxWidth:
        380,

      aspectRatio:
        1277 / 684,

    },


    resultBackground: {

      width:
        '100%',

      height:
        '100%',

      position:
        'relative',

    },


    /* =========================
       CONTENT
    ========================= */

    content: {

      position:
        'absolute',

      top:
        '11%',

      bottom:
        '10%',

      left:
        '10%',

      right:
        '10%',

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    /* =========================
       CLOSE BUTTON
    ========================= */

    closeButton: {

      position:
        'absolute',

      top:
        '12%',

      right:
        '8%',

      width:
        24,

      height:
        24,

      borderRadius:
        6,

      backgroundColor:
        '#C95D61',

      borderWidth:
        1.5,

      borderColor:
        '#8E3E40',

      alignItems:
        'center',

      justifyContent:
        'center',

      zIndex:
        100,

    },


    closeText: {

      color:
        '#FFF8E8',

      fontSize:
        18,

      lineHeight:
        19,

      fontWeight:
        '700',

      marginTop:
        -1,

    },


    /* =========================
       SIMPLE GREEN O
    ========================= */

    correctCircle: {

      width:
        38,

      height:
        38,

      borderRadius:
        19,

      borderWidth:
        7,

      borderColor:
        '#4F824B',

      backgroundColor:
        'transparent',

      marginBottom:
        10,

    },


    /* =========================
       CORRECT
       Pixelify Bold
    ========================= */

    correctTitle: {

      color:
        '#527F4E',

      fontSize:
        26,

      lineHeight:
        30,

      fontFamily:
        'MapseePixelBold',

      textAlign:
        'center',

      marginBottom:
        7,

    },


    /* =========================
       GREAT JOB
       Fredoka Medium
    ========================= */

    correctSubtitle: {

      color:
        '#6A4B32',

      fontSize:
        14,

      lineHeight:
        18,

      fontFamily:
        'MapseeFredokaMedium',

      textAlign:
        'center',

      marginBottom:
        13,

    },


    /* =========================
       NEXT BUTTON
    ========================= */

    nextPressable: {

      width:
        '40%',

      aspectRatio:
        378 / 136,

      alignSelf:
        'center',

    },


    nextBackground: {

      width:
        '100%',

      height:
        '100%',

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    /* =========================
       NEXT
       Pixelify
    ========================= */

    nextText: {

      color:
        '#3E3920',

      fontSize:
        14,

      fontFamily:
        'MapseePixel',

      textAlign:
        'center',

    },


  });