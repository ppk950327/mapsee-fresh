import {
  Animated,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  View,
} from 'react-native';

import {
  useEffect,
  useRef,
  useState,
} from 'react';


type RewardRevealModalProps = {
  visible: boolean;
  itemImage: ImageSourcePropType;
  onFinish: () => void;
};


/* =========================================================
   ASSETS
========================================================= */

const REWARD_BOX_CLOSED =
  require(
    '../../../assets/images/quest/reward-box-closed.png'
  );

const REWARD_BOX_OPEN =
  require(
    '../../../assets/images/quest/reward-box-open.png'
  );

const REWARD_GLOW =
  require(
    '../../../assets/images/quest/reward-glow.png'
  );


/* =========================================================
   REWARD REVEAL MODAL
========================================================= */

export default function RewardRevealModal({
  visible,
  itemImage,
  onFinish,
}: RewardRevealModalProps) {


  /* =======================================================
     STATE
  ======================================================= */

  const [
    isBoxOpen,
    setIsBoxOpen,
  ] =
    useState(false);


  /*
    빛 + 유물을 동시에 등장시키기 위한 상태
  */

  const [
    showRewardFx,
    setShowRewardFx,
  ] =
    useState(false);



  /* =======================================================
     BOX SHAKE
  ======================================================= */

  const boxShake =
    useRef(
      new Animated.Value(0)
    ).current;


  const boxRotate =
    boxShake.interpolate({

      inputRange:
        [-1, 0, 1],

      outputRange:
        [
          '-2.2deg',
          '0deg',
          '2.2deg',
        ],

    });


  const boxTranslateX =
    boxShake.interpolate({

      inputRange:
        [-1, 0, 1],

      outputRange:
        [-5, 0, 5],

    });



  /* =======================================================
     GLOW ANIMATION
  ======================================================= */

  const glowOpacity =
    useRef(
      new Animated.Value(0)
    ).current;


  const glowScale =
    useRef(
      new Animated.Value(0.35)
    ).current;



  /* =======================================================
     ITEM ANIMATION
  ======================================================= */

  const itemScale =
    useRef(
      new Animated.Value(0.25)
    ).current;


  /*
    처음에는 아래쪽에서 시작해서
    위로 뿅 올라옴
  */

  const itemTranslateY =
    useRef(
      new Animated.Value(45)
    ).current;


  const itemOpacity =
    useRef(
      new Animated.Value(0)
    ).current;



  /* =======================================================
     ANIMATION SEQUENCE
  ======================================================= */

  useEffect(() => {

    if (!visible) {
      return;
    }


    /* =====================================================
       RESET
    ===================================================== */

    setIsBoxOpen(
      false
    );


    setShowRewardFx(
      false
    );


    boxShake.setValue(
      0
    );


    glowOpacity.setValue(
      0
    );


    glowScale.setValue(
      0.35
    );


    itemScale.setValue(
      0.25
    );


    itemTranslateY.setValue(
      45
    );


    itemOpacity.setValue(
      0
    );



    /* =====================================================
       1. CLOSED BOX
    ===================================================== */

    const shakeTimer =
      setTimeout(() => {


        /* =================================================
           2. BOX SHAKE

           살짝 흔들린 뒤 중앙으로 복귀
        ================================================= */

        Animated.sequence([

          Animated.timing(
            boxShake,
            {
              toValue:
                -1,

              duration:
                80,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            boxShake,
            {
              toValue:
                1,

              duration:
                110,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            boxShake,
            {
              toValue:
                -0.75,

              duration:
                100,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            boxShake,
            {
              toValue:
                0.75,

              duration:
                100,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            boxShake,
            {
              toValue:
                0,

              duration:
                120,

              useNativeDriver:
                true,
            }
          ),

        ]).start();


      }, 600);



    /* =====================================================
       3. OPEN BOX

       흔들린 뒤 잠깐 텀을 두고 열림
    ===================================================== */

    const openTimer =
      setTimeout(() => {

        setIsBoxOpen(
          true
        );

      }, 1500);



    /* =====================================================
       4. GLOW + ITEM

       ★ 빛과 유물이 정확히 동시에 등장
    ===================================================== */

    const revealTimer =
      setTimeout(() => {


        setShowRewardFx(
          true
        );


        Animated.parallel([


          /* =========================
             GLOW OPACITY
          ========================= */

          Animated.timing(
            glowOpacity,
            {
              toValue:
                1,

              duration:
                350,

              useNativeDriver:
                true,
            }
          ),


          /* =========================
             GLOW SCALE
          ========================= */

          Animated.spring(
            glowScale,
            {
              toValue:
                1,

              friction:
                6,

              tension:
                55,

              useNativeDriver:
                true,
            }
          ),



          /* =========================
             ITEM OPACITY
          ========================= */

          Animated.timing(
            itemOpacity,
            {
              toValue:
                1,

              duration:
                250,

              useNativeDriver:
                true,
            }
          ),


          /* =========================
             ITEM SCALE
          ========================= */

          Animated.spring(
            itemScale,
            {
              toValue:
                1,

              friction:
                5,

              tension:
                70,

              useNativeDriver:
                true,
            }
          ),


          /* =========================
             ITEM POP
          ========================= */

          Animated.spring(
            itemTranslateY,
            {
              /*
                숫자 증가 → 유물 아래
                숫자 감소 → 유물 위
              */

              toValue:
                8,

              friction:
                5,

              tension:
                65,

              useNativeDriver:
                true,
            }
          ),

        ]).start();


      }, 2050);



    /* =====================================================
       5. HOLD

       유물 + 빛을 잠깐 보여준 뒤
       Item Acquired 화면으로 이동
    ===================================================== */

    const finishTimer =
      setTimeout(() => {

        onFinish();

      }, 4850);



    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {

      clearTimeout(
        shakeTimer
      );

      clearTimeout(
        openTimer
      );

      clearTimeout(
        revealTimer
      );

      clearTimeout(
        finishTimer
      );

    };


  }, [
    visible,
    boxShake,
    glowOpacity,
    glowScale,
    itemScale,
    itemTranslateY,
    itemOpacity,
    onFinish,
  ]);



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
    >

      <View
        style={
          styles.overlay
        }
      >


        <View
          style={
            styles.revealArea
          }
        >


          {/* =================================================
              BOX
          ================================================= */}

          <Animated.Image

            source={
              isBoxOpen
                ? REWARD_BOX_OPEN
                : REWARD_BOX_CLOSED
            }

            resizeMode="contain"

            style={[

              styles.box,

              {

                transform: [

                  {
                    translateX:
                      boxTranslateX,
                  },

                  {
                    rotate:
                      boxRotate,
                  },

                ],

              },

            ]}

          />



          {/* =================================================
              GLOW + ITEM

              ★ 둘이 동시에 등장
          ================================================= */}

          {
            showRewardFx
            &&
            (

              <>


                {/* =========================
                    GLOW
                ========================= */}

                <Animated.Image

                  source={
                    REWARD_GLOW
                  }

                  resizeMode="contain"

                  style={[

                    styles.glow,

                    {

                      opacity:
                        glowOpacity,

                      transform: [

                        {
                          scale:
                            glowScale,
                        },

                      ],

                    },

                  ]}

                />



                {/* =========================
                    ITEM
                ========================= */}

                <Animated.Image

                  source={
                    itemImage
                  }

                  resizeMode="contain"

                  style={[

                    styles.itemImage,

                    {

                      opacity:
                        itemOpacity,

                      transform: [

                        {
                          translateY:
                            itemTranslateY,
                        },

                        {
                          scale:
                            itemScale,
                        },

                      ],

                    },

                  ]}

                />


              </>

            )
          }


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
        'rgba(35, 22, 13, 0.62)',

      alignItems:
        'center',

      justifyContent:
        'center',

      overflow:
        'visible',

    },



    /* =====================================================
       REVEAL AREA
    ===================================================== */

    revealArea: {

      width:
        '88%',

      maxWidth:
        380,

      aspectRatio:
        1,

      position:
        'relative',

      alignItems:
        'center',

      justifyContent:
        'center',

    },



    /* =====================================================
       BOX
    ===================================================== */

    box: {

      position:
        'absolute',

      width:
        '82%',

      height:
        '82%',

      bottom:
        '0%',

      alignSelf:
        'center',

      zIndex:
        3,

    },



    /* =====================================================
       GLOW

       ★ 이번 수정 포인트

       기존:
       62% × 62%
       top 23%

       변경:
       66% × 66%
       top 25%

       → 빛을 조금 더 크게
       → 동시에 조금 아래로 내려서
         유물 중앙과 맞춤
    ===================================================== */

    glow: {

      position:
        'absolute',

      width:
        '90%',

      height:
        '90%',

      top:
        '4%',

      alignSelf:
        'center',

      zIndex:
        4,

    },



    /* =====================================================
       ITEM

       ★ 현재 마음에 든 작은 크기 유지

       34% × 34%
       top 34%
    ===================================================== */

    itemImage: {

      position:
        'absolute',

      width:
        '46%',

      height:
        '66%',

      top:
        '13%',

      alignSelf:
        'center',

      zIndex:
        6,

    },


  });