import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useAudioPlayer,
} from 'expo-audio';


type QuizModalProps = {
  visible: boolean;
  title: string;
  question: string;
  answers: string[];
  correctIndex: number;
  onClose: () => void;
  onCorrect: () => void;
};


/* =========================================================
   ASSETS
========================================================= */

const QUIZ_MODAL_BG =
  require(
    '../../../assets/images/quest/quiz-modal-bg.png'
  );

const QUIZ_ANSWER_BUTTON =
  require(
    '../../../assets/images/quest/quiz-answer-button.png'
  );

const QUIZ_ANSWER_WRONG =
  require(
    '../../../assets/images/quest/quiz-answer-wrong.png'
  );


/* =========================================================
   SOUND

   ★ 오답 효과음
========================================================= */

const WRONG_SOUND =
  require(
    '../../../assets/sounds/wrong.mp3'
  );


/* =========================================================
   ★ 정답 효과음
========================================================= */

const CORRECT_SOUND =
  require(
    '../../../assets/sounds/correct.mp3'
  );


/* =========================================================
   QUIZ MODAL
========================================================= */

export default function QuizModal({
  visible,
  title,
  question,
  answers,
  correctIndex,
  onClose,
  onCorrect,
}: QuizModalProps) {


  /* =======================================================
     WRONG ANSWERS
  ======================================================= */

  const [
    wrongAnswerIndexes,
    setWrongAnswerIndexes,
  ] =
    useState<Set<number>>(
      new Set()
    );


  /* =======================================================
     WRONG SOUND PLAYER

     useAudioPlayer가 컴포넌트 생명주기를
     자동으로 관리함.
  ======================================================= */

  const wrongSoundPlayer =
    useAudioPlayer(
      WRONG_SOUND
    );


  /* =======================================================
     CORRECT SOUND PLAYER
  ======================================================= */

  const correctSoundPlayer =
    useAudioPlayer(
      CORRECT_SOUND
    );



  /* =======================================================
     RESET WHEN QUIZ OPENS
  ======================================================= */

  useEffect(() => {

    if (
      visible
    ) {

      setWrongAnswerIndexes(
        new Set()
      );

    }

  }, [
    visible,
  ]);



  /* =======================================================
     MAX 4 ANSWERS
  ======================================================= */

  const quizAnswers =
    useMemo(
      () =>
        answers.slice(
          0,
          4
        ),
      [
        answers,
      ]
    );



  /* =======================================================
     PLAY WRONG SOUND

     ★ 이미 한 번 재생된 음원도
       반드시 0초부터 다시 재생
  ======================================================= */

  const playWrongSound =
    async () => {

      try {

        await wrongSoundPlayer.seekTo(
          0
        );

        wrongSoundPlayer.play();

      } catch (
        error
      ) {

        /*
          효과음 실패 때문에
          퀴즈 자체가 멈추지 않도록 함.
        */

        console.log(
          'Wrong sound playback error:',
          error
        );

      }

  };


  /* =======================================================
     PLAY CORRECT SOUND

     ★ 정답을 누를 때마다
       반드시 0초부터 다시 재생
  ======================================================= */

  const playCorrectSound =
    async () => {

      try {

        await correctSoundPlayer.seekTo(
          0
        );

        correctSoundPlayer.play();

      } catch (
        error
      ) {

        /*
          효과음 실패 때문에
          퀴즈 자체가 멈추지 않도록 함.
        */

        console.log(
          'Correct sound playback error:',
          error
        );

      }

  };



  /* =======================================================
     ANSWER PRESS
  ======================================================= */

  const handleAnswerPress =
    (
      answerIndex:
        number
    ) => {


      /*
        이미 틀린 선택지를 다시 누른 경우
        아무 동작 안 함.
      */

      if (
        wrongAnswerIndexes.has(
          answerIndex
        )
      ) {

        return;

      }



      /* =====================================================
         CORRECT

         ★ 현재 정답 효과음은 없음
      ===================================================== */

      if (
        answerIndex ===
        correctIndex
      ) {

        void playCorrectSound();

        onCorrect();

        return;

      }



      /* =====================================================
         WRONG

         ★ 오답 누르는 순간 효과음
      ===================================================== */

      void playWrongSound();



      setWrongAnswerIndexes(
        previous => {

          const next =
            new Set(
              previous
            );

          next.add(
            answerIndex
          );

          return next;

        }
      );

  };



  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <Modal
      visible={
        visible
      }

      transparent

      animationType="fade"

      statusBarTranslucent

      onRequestClose={
        onClose
      }
    >

      <View
        style={
          styles.overlay
        }
      >


        {/* =================================================
            SCROLL
        ================================================= */}

        <View
          style={
            styles.scrollContainer
          }
        >


          <ImageBackground
            source={
              QUIZ_MODAL_BG
            }

            style={
              styles.scrollBackground
            }

            resizeMode="contain"
          >


            {/* =============================================
                CLOSE
            ============================================= */}

            <Pressable
              style={
                styles.closeButton
              }

              onPress={
                onClose
              }

              hitSlop={
                8
              }
            >

              <Text
                style={
                  styles.closeText
                }
              >
                ×
              </Text>

            </Pressable>



            {/* =============================================
                CONTENT
            ============================================= */}

            <View
              style={
                styles.paperContent
              }
            >


              {/* ===========================================
                  ITEM NAME
                  Fredoka Bold
              =========================================== */}

              <Text
                style={
                  styles.title
                }

                numberOfLines={
                  3
                }

                adjustsFontSizeToFit

                minimumFontScale={
                  0.86
                }
              >
                {title}
              </Text>



              {/* ===========================================
                  QUESTION
              =========================================== */}

              <View
                style={
                  styles.questionRow
                }
              >


                {/* Q. */}

                <Text
                  style={
                    styles.questionLabel
                  }
                >
                  Q.
                </Text>



                {/* QUESTION */}

                <Text
                  style={
                    styles.questionText
                  }

                  numberOfLines={
                    4
                  }

                  adjustsFontSizeToFit

                  minimumFontScale={
                    0.80
                  }
                >
                  {question}
                </Text>


              </View>



              {/* ===========================================
                  DIVIDER
              =========================================== */}

              <View
                style={
                  styles.divider
                }
              />



              {/* ===========================================
                  ANSWERS
              =========================================== */}

              <View
                style={
                  styles.answersArea
                }
              >

                {
                  quizAnswers.map(
                    (
                      answer,
                      index
                    ) => {


                      const isWrong =
                        wrongAnswerIndexes.has(
                          index
                        );


                      return (

                        <Pressable
                          key={
                            `${index}-${answer}`
                          }

                          style={
                            styles.answerPressable
                          }

                          onPress={() =>
                            handleAnswerPress(
                              index
                            )
                          }
                        >


                          <ImageBackground
                            source={
                              isWrong
                                ? QUIZ_ANSWER_WRONG
                                : QUIZ_ANSWER_BUTTON
                            }

                            style={
                              styles.answerBackground
                            }

                            resizeMode="stretch"
                          >


                            {/* =============================
                                NUMBER
                            ============================= */}

                            <View
                              style={[

                                styles.numberCircle,

                                isWrong &&
                                  styles.numberCircleWrong,

                              ]}
                            >

                              <Text
                                style={
                                  styles.numberText
                                }
                              >
                                {
                                  index + 1
                                }
                              </Text>

                            </View>



                            {/* =============================
                                ANSWER
                            ============================= */}

                            <Text
                              style={[

                                styles.answerText,

                                isWrong &&
                                  styles.answerTextWrong,

                              ]}

                              numberOfLines={
                                3
                              }

                              adjustsFontSizeToFit

                              minimumFontScale={
                                0.78
                              }
                            >
                              {answer}
                            </Text>



                            {/* =============================
                                WRONG X
                            ============================= */}

                            {
                              isWrong
                              &&
                              (

                                <Text
                                  style={
                                    styles.wrongMark
                                  }
                                >
                                  ×
                                </Text>

                              )
                            }


                          </ImageBackground>


                        </Pressable>

                      );

                    }
                  )
                }


              </View>


            </View>


          </ImageBackground>


        </View>


      </View>


    </Modal>

  );

}



/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({


    /* =====================================================
       OVERLAY
    ===================================================== */

    overlay: {

      flex:
        1,

      backgroundColor:
        'rgba(35, 22, 13, 0.48)',

      alignItems:
        'center',

      justifyContent:
        'center',

    },



    /* =====================================================
       SCROLL
    ===================================================== */

    scrollContainer: {

      width:
        '86%',

      maxWidth:
        370,

      aspectRatio:
        1130 / 1392,

    },


    scrollBackground: {

      width:
        '100%',

      height:
        '100%',

      position:
        'relative',

    },



    /* =====================================================
       CONTENT AREA
    ===================================================== */

    paperContent: {

      position:
        'absolute',

      top:
        '14%',

      bottom:
        '11%',

      left:
        '15%',

      right:
        '15%',

    },



    /* =====================================================
       CLOSE
    ===================================================== */

    closeButton: {

      position:
        'absolute',

      top:
        '13%',

      right:
        '18%',

      width:
        23,

      height:
        23,

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
        17,

      lineHeight:
        18,

      fontWeight:
        '700',

      marginTop:
        -1,

    },



    /* =====================================================
       ITEM NAME

       Fredoka Bold
    ===================================================== */

    title: {

      color:
        '#3B281A',

      fontSize:
        15.5,

      lineHeight:
        20,

      fontFamily:
        'MapseeFredokaBold',

      textAlign:
        'center',

      paddingLeft:
        10,

      paddingRight:
        38,

      marginLeft:
        28,

      marginBottom:
        12,

    },



    /* =====================================================
       QUESTION ROW
    ===================================================== */

    questionRow: {

      width:
        '100%',

      flexDirection:
        'row',

      alignItems:
        'flex-start',

      paddingLeft:
        16,

      paddingRight:
        8,

      marginBottom:
        8,

    },



    /* =====================================================
       Q.
       Pixelify
    ===================================================== */

    questionLabel: {

      color:
        '#4A3424',

      fontSize:
        11.5,

      lineHeight:
        14,

      fontFamily:
        'MapseePixel',

      marginRight:
        5,

      flexShrink:
        0,

    },



    /* =====================================================
       QUESTION
       Fredoka Medium
    ===================================================== */

    questionText: {

      flex:
        1,

      color:
        '#4A3424',

      fontSize:
        11.5,

      lineHeight:
        14,

      fontFamily:
        'MapseeFredokaMedium',

    },



    /* =====================================================
       DIVIDER
    ===================================================== */

    divider: {

      width:
        '92%',

      height:
        1,

      alignSelf:
        'center',

      backgroundColor:
        '#D6B98A',

      opacity:
        0.45,

      marginTop:
        3,

      marginBottom:
        6,

    },



    /* =====================================================
       ANSWERS
    ===================================================== */

    answersArea: {

      width:
        '100%',

      gap:
        10,

      marginTop:
        8,

    },



    /* =====================================================
       ANSWER BOX
    ===================================================== */

    answerPressable: {

      width:
        '88%',

      height:
        40,

      alignSelf:
        'center',

    },


    answerBackground: {

      width:
        '100%',

      height:
        40,

      flexDirection:
        'row',

      alignItems:
        'center',

      paddingLeft:
        10,

      paddingRight:
        12,

    },



    /* =====================================================
       NUMBER CIRCLE
    ===================================================== */

    numberCircle: {

      width:
        19,

      height:
        19,

      borderRadius:
        9.5,

      backgroundColor:
        '#6A3514',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight:
        8,

      flexShrink:
        0,

    },


    numberCircleWrong: {

      backgroundColor:
        '#B94D52',

    },



    /* =====================================================
       NUMBER
    ===================================================== */

    numberText: {

      color:
        '#FFF8E8',

      fontSize:
        9.5,

      fontFamily:
        'MapseePixel',

      textAlign:
        'center',

    },



    /* =====================================================
       ANSWER TEXT
       Fredoka Medium
    ===================================================== */

    answerText: {

      flex:
        1,

      color:
        '#35251A',

      fontSize:
        10.8,

      lineHeight:
        12.5,

      fontFamily:
        'MapseeFredokaMedium',

      paddingRight:
        2,

    },


    answerTextWrong: {

      color:
        '#91383D',

    },



    /* =====================================================
       WRONG X
    ===================================================== */

    wrongMark: {

      color:
        '#B83D45',

      fontSize:
        17,

      fontWeight:
        '800',

      marginLeft:
        2,

    },


  });