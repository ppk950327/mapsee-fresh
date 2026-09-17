import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  Image,
  ImageBackground,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';


import BottomNavigation from '../components/navigation/BottomNavigation';

import CorrectModal from '../components/quest/CorrectModal';

import ItemRewardModal from '../components/quest/ItemRewardModal';

import BackgroundRewardModal from '../components/quest/BackgroundRewardModal';

import QuizModal from '../components/quest/QuizModal';

import RewardRevealModal from '../components/quest/reward-reveal-modal';

import { useCollection } from '../context/CollectionContext';


/* =========================================================
   SEOUL
========================================================= */

import {
  SEOUL_QUESTS,
} from '../data/seoulQuests';

import type {
  SeoulQuest,
} from '../data/seoulQuests';


/* =========================================================
   ANDONG
========================================================= */

import {
  ANDONG_QUESTS,
} from '../data/andongQuests';

import type {
  AndongQuest,
} from '../data/andongQuests';


import {
  colors,
  IS_WEB,
  PHONE_MAX_WIDTH,
} from '../theme';



/* =========================================================
   QUEST TYPE
========================================================= */

type SelectedQuest =
  SeoulQuest |
  AndongQuest;



/* =========================================================
   TYPE CHECK
========================================================= */

function isAndongQuest(
  quest: SelectedQuest
): quest is AndongQuest {

  return (
    'placeName' in quest
  );

}



/* =========================================================
   QUIZ TITLE
========================================================= */

function getQuestTitle(
  quest: SelectedQuest
) {

  if (
    isAndongQuest(
      quest
    )
  ) {

    return quest.placeName;

  }


  return quest.title;

}



/* =========================================================
   REWARD ITEM NAME
========================================================= */

function getRewardItemName(
  quest: SelectedQuest
) {

  if (
    isAndongQuest(
      quest
    )
  ) {

    return quest.itemName;

  }


  return quest.title;

}



/* =========================================================
   COLLECTION IDS

   collection.tsx 와 정확히 같은 ID 규칙을 사용합니다.
========================================================= */


function getBonusCollectionItemId(
  quest: AndongQuest
) {

  return `andong-${quest.id}-bonus`;

}


function getCollectionBackgroundId(
  quest: AndongQuest
) {

  return `background-${quest.id}`;

}



/* =========================================================
   ★ ANDONG MAP DISPLAY TITLE

   지도 위 작은 박스에서만
   줄바꿈을 예쁘게 고정.

   QuizModal에서는
   quest.placeName 그대로 사용.
========================================================= */

function getAndongMapTitle(
  quest: AndongQuest
) {

  switch (
    quest.id
  ) {

    case 'haknam':

      return 'Haknam Historic\nHouse';


    case 'dosan':

      return 'Dosan Seowon';


    case 'yekki':

      return 'Yekki Art Village';


    case 'seonseong':

      return 'Seonseong\nSusang-gil';


    case 'wolyeonggyo':

      return 'Wolyeonggyo\nBridge';


    case 'hahoe':

      return 'Hahoe Village';


    default:

      return quest.placeName;

  }

}



/* =========================================================
   MAP ASSETS
========================================================= */

const SEOUL_MAP =
  require(
    '../../assets/images/seoul-map.png'
  );


const ANDONG_MAP =
  require(
    '../../assets/images/Andong-map.png'
  );


const QUEST_BOX =
  require(
    '../../assets/images/quest-box.png'
  );


const QUEST_PIN =
  require(
    '../../assets/images/quest-pin.png'
  );



/* =========================================================
   MAP IMAGE SIZE
========================================================= */

const IMAGE_WIDTH =
  1254;


const IMAGE_HEIGHT =
  1254;


const IMAGE_RATIO =
  IMAGE_HEIGHT /
  IMAGE_WIDTH;



/* =========================================================
   ZOOM SETTINGS
========================================================= */

const MIN_ZOOM =
  1;


const MAX_ZOOM =
  2;


const WHEEL_ZOOM_STEP =
  0.1;



/* =========================================================
   MAP DRAG SIZE
========================================================= */

const DRAG_SCALE =
  1.12;



/* =========================================================
   QUEST UI
========================================================= */

const QUEST_BOX_WIDTH =
  112;


const QUEST_BOX_HEIGHT =
  80;


const QUEST_PIN_WIDTH =
  21;


const QUEST_PIN_HEIGHT =
  27;


const QUEST_ITEM_SIZE =
  26;




/* =========================================================
   SEOUL DISPLAY POSITIONS

   서울의 실제 구 위치 흐름은 최대한 유지하면서
   팝업끼리만 겹치지 않도록 화면 표시용 위치를 미세 조정.

   - seoulQuests.ts의 원본 x / y는 건드리지 않음
   - 서울에서만 아래 표시용 좌표 사용
   - 안동은 기존 좌표 그대로 사용
========================================================= */

const SEOUL_DISPLAY_POSITIONS: Record<
  string,
  {
    x: number;
    y: number;
  }
> = {

  /* ---------- NORTH-WEST / NORTH ---------- */

  'seodaemun': {
    x: 0.20,
    y: 0.30,
  },

  'seodaemun-celadon-stool': {
    x: 0.31,
    y: 0.40,
  },

  'seongbuk-chaekgeori': {
    x: 0.50,
    y: 0.18,
  },

  'seongbuk': {
    x: 0.72,
    y: 0.20,
  },

  'dongdaemun-sejong-stele': {
    x: 0.80,
    y: 0.35,
  },


  /* ---------- JONGNO / CENTRAL-NORTH ---------- */

  'jongno-geunjeongjeon': {
    x: 0.38,
    y: 0.31,
  },

  'jongno': {
    x: 0.45,
    y: 0.43,
  },

  'jongno-gojong-seal': {
    x: 0.59,
    y: 0.31,
  },


  /* ---------- WEST / CENTRAL ---------- */

  'mapo-dragon-jar': {
    x: 0.23,
    y: 0.42,
  },

  'jung': {
    x: 0.71,
    y: 0.44,
  },


  /* ---------- YONGSAN ---------- */

  'yongsan-museum': {
    x: 0.39,
    y: 0.50,
  },

  'yongsan-pensive-78': {
    x: 0.53,
    y: 0.50,
  },

  'yongsan-pensive-83': {
    x: 0.46,
    y: 0.52,
  },


  /* ---------- WEST / SOUTH-CENTRAL ---------- */

  'gangseo-mitasa-buddha': {
    x: 0.14,
    y: 0.63,
  },

  'dongjak-globe': {
    x: 0.43,
    y: 0.76,
  },

  'gangnam-white-porcelain': {
    x: 0.80,
    y: 0.74,
  },


  /* ---------- SOUTH ---------- */

  'gwanak': {
    x: 0.28,
    y: 0.84,
  },

  'seocho': {
    x: 0.62,
    y: 0.83,
  },

};


/* =========================================================
   SEOUL DISPLAY POSITION HELPER
========================================================= */

function getSeoulDisplayPosition(
  quest: SeoulQuest
) {

  return (
    SEOUL_DISPLAY_POSITIONS[
      quest.id
    ] ?? {
      x:
        quest.x,
      y:
        quest.y,
    }
  );

}



/* =========================================================
   MAP SCREEN
========================================================= */

export default function MapScreen() {


  /* =======================================================
     COLLECTION

     Quiz reward -> actual Collection storage
  ======================================================= */

  const {
    collectQuest,
    isCollected,
    acquireItem,
    acquireBackground,
  } = useCollection();


  /* =======================================================
     REGION
  ======================================================= */

  const [
    region,
    setRegion,
  ] =
    useState<
      'seoul' |
      'andong'
    >(
      'seoul'
    );



  /* =======================================================
     SELECTED QUEST
  ======================================================= */

  const [
    selectedQuest,
    setSelectedQuest,
  ] =
    useState<
      SelectedQuest |
      null
    >(
      null
    );


  /* =======================================================
     HOVERED QUEST

     Web:
     빨간 핀에 마우스를 올리면 말풍선 표시

     Mobile:
     hover 없음 → 핀만 표시
     핀 터치 시 바로 퀴즈 오픈
  ======================================================= */

  const [
    hoveredQuestId,
    setHoveredQuestId,
  ] =
    useState<
      string |
      null
    >(
      null
    );



  /* =======================================================
     QUIZ FLOW
  ======================================================= */

  const [
    showQuiz,
    setShowQuiz,
  ] =
    useState(
      false
    );


  const [
    showCorrect,
    setShowCorrect,
  ] =
    useState(
      false
    );


  const [
    showReveal,
    setShowReveal,
  ] =
    useState(
      false
    );


  const [
    showReward,
    setShowReward,
  ] =
    useState(
      false
    );


  /* =======================================================
     HAHOE BONUS REWARD

     Hahoe Mask 획득 후
     Hahoe Mask Display를 한 번 더 보여줌.
  ======================================================= */

  const [
    showBonusReward,
    setShowBonusReward,
  ] =
    useState(
      false
    );




  /* =======================================================
     ANDONG BACKGROUND REWARD

     일반 안동:
     Item Reward → Background Reward

     하회:
     Hahoe Mask → Hahoe Mask Display → Background Reward
  ======================================================= */

  const [
    showBackgroundReward,
    setShowBackgroundReward,
  ] =
    useState(
      false
    );



  /* =======================================================
     SCREEN SIZE
  ======================================================= */

  const {
    width,
    height,
  } =
    useWindowDimensions();



  const phoneWidth =
    IS_WEB
      ? Math.min(
          width,
          PHONE_MAX_WIDTH
        )
      : width;



  const phoneHeight =
    height;



  /* =======================================================
     MAP DISPLAY SIZE
  ======================================================= */

  const widthBasedMapWidth =
    phoneWidth;


  const widthBasedMapHeight =
    widthBasedMapWidth *
    IMAGE_RATIO;


  const baseMapWidth =
    widthBasedMapHeight >=
    phoneHeight

      ? widthBasedMapWidth

      : phoneHeight /
        IMAGE_RATIO;


  const mapWidth =
    baseMapWidth *
    DRAG_SCALE;


  const mapHeight =
    mapWidth *
    IMAGE_RATIO;



  /* =======================================================
     INITIAL POSITION
  ======================================================= */

  const initialX =
    (
      phoneWidth -
      mapWidth
    ) /
    2;


  const initialY =
    (
      phoneHeight -
      mapHeight
    ) /
    2;



  /* =======================================================
     CURRENT MAP
  ======================================================= */

  const currentMap =
    region ===
      'seoul'

      ? SEOUL_MAP

      : ANDONG_MAP;



  /* =======================================================
     PAN
  ======================================================= */

  const pan =
    useRef(
      new Animated.ValueXY({

        x:
          initialX,

        y:
          initialY,

      })
    ).current;



  /* =======================================================
     SCALE
  ======================================================= */

  const scale =
    useRef(
      new Animated.Value(
        1
      )
    ).current;



  /* =======================================================
     POSITION
  ======================================================= */

  const currentPosition =
    useRef({

      x:
        initialX,

      y:
        initialY,

    });



  const dragStartPosition =
    useRef({

      x:
        initialX,

      y:
        initialY,

    });



  const currentZoom =
    useRef(
      1
    );



  const pinchStartDistance =
    useRef<
      number |
      null
    >(
      null
    );


  const pinchStartZoom =
    useRef(
      1
    );



  /* =======================================================
     RESET WHEN WINDOW CHANGES
  ======================================================= */

  useEffect(() => {


    currentZoom.current =
      1;


    currentPosition.current = {

      x:
        initialX,

      y:
        initialY,

    };


    dragStartPosition.current = {

      x:
        initialX,

      y:
        initialY,

    };


    pan.setValue({

      x:
        initialX,

      y:
        initialY,

    });


    scale.setValue(
      1
    );


  }, [
    initialX,
    initialY,
    pan,
    scale,
  ]);



  /* =======================================================
     CLAMP POSITION
  ======================================================= */

  const clampPosition = (
    x:
      number,

    y:
      number,

    zoom:
      number
  ) => {


    const extraWidth =
      (
        mapWidth *
          zoom -
        mapWidth
      ) /
      2;


    const extraHeight =
      (
        mapHeight *
          zoom -
        mapHeight
      ) /
      2;


    const minX =
      phoneWidth -
      mapWidth -
      extraWidth;


    const maxX =
      extraWidth;


    const minY =
      phoneHeight -
      mapHeight -
      extraHeight;


    const maxY =
      extraHeight;


    return {

      x:
        Math.max(
          minX,

          Math.min(
            x,
            maxX
          )
        ),


      y:
        Math.max(
          minY,

          Math.min(
            y,
            maxY
          )
        ),

    };

  };



  /* =======================================================
     TOUCH DISTANCE
  ======================================================= */

  const getTouchDistance = (
    touches:
      readonly any[]
  ) => {


    if (
      touches.length <
      2
    ) {

      return 0;

    }


    const first =
      touches[0];


    const second =
      touches[1];


    const dx =
      second.pageX -
      first.pageX;


    const dy =
      second.pageY -
      first.pageY;


    return Math.sqrt(
      dx *
        dx +
      dy *
        dy
    );

  };



  /* =======================================================
     APPLY ZOOM
  ======================================================= */

  const applyZoom = (
    requestedZoom:
      number
  ) => {


    const nextZoom =
      Math.max(
        MIN_ZOOM,

        Math.min(
          requestedZoom,
          MAX_ZOOM
        )
      );


    currentZoom.current =
      nextZoom;


    scale.setValue(
      nextZoom
    );


    const clamped =
      clampPosition(

        currentPosition
          .current.x,

        currentPosition
          .current.y,

        nextZoom

      );


    currentPosition.current =
      clamped;


    pan.setValue(
      clamped
    );

  };



  /* =======================================================
     WEB WHEEL ZOOM
  ======================================================= */

  const handleWheel = (
    event:
      any
  ) => {


    if (
      !IS_WEB
    ) {

      return;

    }


    if (
      event
        ?.preventDefault
    ) {

      event.preventDefault();

    }


    const deltaY =
      event
        ?.nativeEvent
        ?.deltaY
      ??
      event
        ?.deltaY
      ??
      0;


    if (
      deltaY ===
      0
    ) {

      return;

    }


    const direction =
      deltaY <
      0

        ? 1

        : -1;


    applyZoom(
      currentZoom.current +
      direction *
      WHEEL_ZOOM_STEP
    );

  };



  const webWheelProps:
    any =
      IS_WEB

        ? {

            onWheel:
              handleWheel,

          }

        : {};



  /* =======================================================
     PAN RESPONDER
  ======================================================= */

  const panResponder =
    useRef(
      PanResponder.create({


        onStartShouldSetPanResponder:
          () =>
            true,


        onMoveShouldSetPanResponder:
          () =>
            true,


        onPanResponderGrant: (
          event
        ) => {


          const touches =
            event.nativeEvent
              .touches;


          if (
            touches.length >=
            2
          ) {


            pinchStartDistance.current =
              getTouchDistance(
                touches
              );


            pinchStartZoom.current =
              currentZoom.current;


            return;

          }


          dragStartPosition.current = {

            x:
              currentPosition
                .current.x,

            y:
              currentPosition
                .current.y,

          };

        },


        onPanResponderMove: (
          event,
          gesture
        ) => {


          const touches =
            event.nativeEvent
              .touches;


          if (
            touches.length >=
            2
          ) {


            const distance =
              getTouchDistance(
                touches
              );


            if (
              pinchStartDistance
                .current ===
                null
              ||
              pinchStartDistance
                .current ===
                0
            ) {


              pinchStartDistance.current =
                distance;


              pinchStartZoom.current =
                currentZoom.current;


              return;

            }


            const ratio =
              distance /
              pinchStartDistance
                .current;


            applyZoom(
              pinchStartZoom
                .current *
              ratio
            );


            return;

          }


          const clamped =
            clampPosition(

              dragStartPosition
                .current.x +
              gesture.dx,

              dragStartPosition
                .current.y +
              gesture.dy,

              currentZoom.current

            );


          pan.setValue(
            clamped
          );

        },


        onPanResponderRelease: (
          _event,
          gesture
        ) => {


          if (
            pinchStartDistance
              .current !==
            null
          ) {


            pinchStartDistance.current =
              null;


            const clamped =
              clampPosition(

                currentPosition
                  .current.x,

                currentPosition
                  .current.y,

                currentZoom.current

              );


            currentPosition.current =
              clamped;


            pan.setValue(
              clamped
            );


            return;

          }


          const clamped =
            clampPosition(

              dragStartPosition
                .current.x +
              gesture.dx,

              dragStartPosition
                .current.y +
              gesture.dy,

              currentZoom.current

            );


          currentPosition.current =
            clamped;


          pan.setValue(
            clamped
          );

        },


        onPanResponderTerminate: (
          _,
          gesture
        ) => {


          pinchStartDistance.current =
            null;


          const clamped =
            clampPosition(

              dragStartPosition
                .current.x +
              gesture.dx,

              dragStartPosition
                .current.y +
              gesture.dy,

              currentZoom.current

            );


          currentPosition.current =
            clamped;


          pan.setValue(
            clamped
          );

        },

      })
    ).current;



  /* =======================================================
     RESET MAP POSITION
  ======================================================= */

  const resetMapPosition = () => {


    currentZoom.current =
      1;


    scale.setValue(
      1
    );


    pinchStartDistance.current =
      null;


    currentPosition.current = {

      x:
        initialX,

      y:
        initialY,

    };


    dragStartPosition.current = {

      x:
        initialX,

      y:
        initialY,

    };


    pan.setValue({

      x:
        initialX,

      y:
        initialY,

    });

  };



  /* =======================================================
     RESET FLOW
  ======================================================= */

  const resetFlow = () => {


    setSelectedQuest(
      null
    );


    setShowQuiz(
      false
    );


    setShowCorrect(
      false
    );


    setShowReveal(
      false
    );


    setShowReward(
      false
    );


    setShowBonusReward(
      false
    );


    setShowBackgroundReward(
      false
    );

  };



  /* =======================================================
     REGION
  ======================================================= */

  const selectSeoul = () => {


    setRegion(
      'seoul'
    );


    setHoveredQuestId(
      null
    );


    resetFlow();


    resetMapPosition();

  };


  const selectAndong = () => {


    setRegion(
      'andong'
    );


    setHoveredQuestId(
      null
    );


    resetFlow();


    resetMapPosition();

  };



  /* =======================================================
     QUEST FLOW
  ======================================================= */

  const openQuest = (
    quest:
      SelectedQuest
  ) => {


    setSelectedQuest(
      quest
    );


    setShowCorrect(
      false
    );


    setShowReveal(
      false
    );


    setShowReward(
      false
    );


    setShowBonusReward(
      false
    );


    setShowBackgroundReward(
      false
    );


    setShowQuiz(
      true
    );

  };


  const closeQuizFlow = () => {


    resetFlow();

  };


  const handleCorrect = () => {


    setShowQuiz(
      false
    );


    setShowCorrect(
      true
    );

  };


  const handleNext = () => {


    setShowCorrect(
      false
    );


    setShowReveal(
      true
    );

  };


  const handleRevealFinish = () => {


    setShowReveal(
      false
    );


    setShowReward(
      true
    );

  };


  const handleRewardOk = () => {


    if (
      !selectedQuest
    ) {

      return;

    }


    /*
      ========================================================
      ★ STRICT 1 QUEST → 1 MAIN ITEM

      일반 아이템은 acquireItem()으로 따로 저장하지 않습니다.

      collectQuest() 하나만 저장하고,
      CollectionContext가 questId에서
      정확한 itemId를 1:1로 계산합니다.
      ========================================================
    */


    /*
      ★ ANDONG

      메인 아이템 보상에서 OK를 누르는 순간
      해당 안동 퀘스트 하나만 완료 처리.
    */

    if (
      isAndongQuest(
        selectedQuest
      )
    ) {

      collectQuest(
        selectedQuest.id,
        'andong'
      );


      /*
        HAHOE:
        메인 아이템 → 보너스 아이템
      */

      if (
        selectedQuest.id ===
          'hahoe'
        &&
        selectedQuest.bonusItemImage
        &&
        selectedQuest.bonusItemName
      ) {

        setShowReward(
          false
        );


        setShowBonusReward(
          true
        );


        return;

      }


      /*
        일반 ANDONG:
        메인 아이템 → 배경 보상
      */

      setShowReward(
        false
      );


      setShowBackgroundReward(
        true
      );


      return;

    }


    /*
      ★ SEOUL

      딱 현재 selectedQuest 하나만 완료 처리.
      예:
      seongbuk-chaekgeori
        → seoul:seongbuk-chaekgeori
        → seoul-seongbuk-chaekgeori
    */

    collectQuest(
      selectedQuest.id,
      'seoul'
    );


    setShowReward(
      false
    );


    setSelectedQuest(
      null
    );

  };


  /* =======================================================
     HAHOE BONUS REWARD OK
  ======================================================= */

  const handleBonusRewardOk = () => {


    if (
      selectedQuest
      &&
      isAndongQuest(
        selectedQuest
      )
      &&
      selectedQuest.bonusItemImage
      &&
      selectedQuest.bonusItemName
    ) {

      /*
        Hahoe Mask Display 저장.

        collection.tsx ID:
        andong-hahoe-bonus
      */

      acquireItem(
        getBonusCollectionItemId(
          selectedQuest
        )
      );

    }


    /*
      Hahoe Mask Display에서 OK
      → Hahoe Village Background
    */

    setShowBonusReward(
      false
    );


    setShowBackgroundReward(
      true
    );

  };


  /* =======================================================
     BACKGROUND REWARD OK
  ======================================================= */

  const handleBackgroundRewardOk = () => {


    if (
      selectedQuest
      &&
      isAndongQuest(
        selectedQuest
      )
    ) {

      /*
        안동 배경 저장.

        collection.tsx ID:
        background-{quest.id}
      */

      acquireBackground(
        getCollectionBackgroundId(
          selectedQuest
        )
      );

    }


    setShowBackgroundReward(
      false
    );


    setSelectedQuest(
      null
    );

  };


  /* =======================================================
     RENDER
  ======================================================= */

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


        {/* =================================================
            MAP
        ================================================= */}

        <View
          style={
            styles.mapViewport
          }
        >


          <Animated.View

            {...webWheelProps}

            {...panResponder.panHandlers}

            style={[

              styles.movableMap,

              {

                width:
                  mapWidth,

                height:
                  mapHeight,

                transform: [

                  {
                    translateX:
                      pan.x,
                  },

                  {
                    translateY:
                      pan.y,
                  },

                  {
                    scale:
                      scale,
                  },

                ],

              },

            ]}
          >


            {/* =============================================
                MAP IMAGE
            ============================================= */}

            <Image

              source={
                currentMap
              }

              style={
                styles.mapImage
              }

              resizeMode="stretch"

            />



            {/* =============================================
                SEOUL QUESTS

                ★ 기본: 빨간 핀만 표시
                ★ Web hover: 해당 핀의 말풍선만 표시
                ★ 핀 클릭/터치: 퀴즈 오픈
            ============================================= */}

            {
              region ===
                'seoul'
              &&
              SEOUL_QUESTS
                .filter(
                  (quest) =>
                    Boolean(
                      quest.itemImage
                    )
                )
                .map(
                (
                  quest
                ) => (

                  <View

                    key={
                      quest.id
                    }

                    style={[

                      styles.questMarkerContainer,

                      {

                        left:
                          mapWidth *
                            getSeoulDisplayPosition(
                              quest
                            ).x -
                          QUEST_BOX_WIDTH /
                            2,

                        top:
                          mapHeight *
                            getSeoulDisplayPosition(
                              quest
                            ).y -
                          QUEST_BOX_HEIGHT -
                          QUEST_PIN_HEIGHT +
                          2,

                      },

                    ]}
                  >


                    {/* =========================================
                        HOVER SPEECH BUBBLE
                    ========================================= */}

                    {
                      hoveredQuestId ===
                        quest.id
                      &&
                      (

                        <View
                          style={
                            styles.questBubble
                          }

                          pointerEvents="none"
                        >

                          <ImageBackground

                            source={
                              QUEST_BOX
                            }

                            resizeMode="stretch"

                            style={
                              styles.questBox
                            }
                          >


                            {
                              (
                                quest.type ===
                                  'special'
                                ||
                                quest.id ===
                                  'yongsan-pensive-78'
                                ||
                                quest.id ===
                                  'yongsan-pensive-83'
                              )
                              &&
                              (

                                <View
                                  style={
                                    styles.specialBadge
                                  }
                                >

                                  <Text
                                    style={
                                      styles.specialText
                                    }
                                  >
                                    SPECIAL
                                  </Text>

                                </View>

                              )
                            }


                            <Text

                              numberOfLines={
                                1
                              }

                              adjustsFontSizeToFit

                              minimumFontScale={
                                0.75
                              }

                              style={
                                styles.questDistrict
                              }
                            >

                              {
                                quest.district
                              }

                            </Text>


                            <View
                              style={
                                styles.questContent
                              }
                            >


                              <Image

                                source={
                                  quest.itemImage
                                }

                                style={
                                  styles.questItem
                                }

                                resizeMode="contain"

                              />


                              <Text
                                style={
                                  styles.questProgress
                                }
                              >

                                {
                                  isCollected(
                                    quest.id,
                                    'seoul'
                                  )
                                    ? 1
                                    : quest.progress
                                }

                                /

                                {
                                  quest.total
                                }

                              </Text>


                            </View>


                          </ImageBackground>

                        </View>

                      )
                    }


                    {/* =========================================
                        RED PIN
                        ★ hover target
                        ★ click/touch target
                    ========================================= */}

                    <Pressable

                      style={
                        styles.questPinPressable
                      }

                      onHoverIn={() => {

                        if (
                          IS_WEB
                        ) {

                          setHoveredQuestId(
                            quest.id
                          );

                        }

                      }}

                      onHoverOut={() => {

                        if (
                          IS_WEB
                        ) {

                          setHoveredQuestId(
                            (
                              current
                            ) =>
                              current ===
                                quest.id
                                ? null
                                : current
                          );

                        }

                      }}

                      onPress={() => {

                        setHoveredQuestId(
                          null
                        );

                        openQuest(
                          quest
                        );

                      }}
                    >

                      <Image

                        source={
                          QUEST_PIN
                        }

                        style={
                          styles.questPinImage
                        }

                        resizeMode="contain"

                      />

                    </Pressable>


                  </View>

                )
              )
            }



            {/* =============================================
                ANDONG QUESTS

                ★ 기본: 빨간 핀만 표시
                ★ Web hover: 해당 핀의 말풍선만 표시
                ★ 핀 클릭/터치: 퀴즈 오픈
            ============================================= */}

            {
              region ===
                'andong'
              &&
              ANDONG_QUESTS.map(
                (
                  quest
                ) => (

                  <View

                    key={
                      quest.id
                    }

                    style={[

                      styles.questMarkerContainer,

                      {

                        left:
                          mapWidth *
                            quest.x -
                          QUEST_BOX_WIDTH /
                            2,

                        top:
                          mapHeight *
                            quest.y -
                          QUEST_BOX_HEIGHT -
                          QUEST_PIN_HEIGHT +
                          2,

                      },

                    ]}
                  >


                    {/* =========================================
                        HOVER SPEECH BUBBLE
                    ========================================= */}

                    {
                      hoveredQuestId ===
                        quest.id
                      &&
                      (

                        <View
                          style={
                            styles.questBubble
                          }

                          pointerEvents="none"
                        >

                          <ImageBackground

                            source={
                              QUEST_BOX
                            }

                            resizeMode="stretch"

                            style={
                              styles.andongQuestBox
                            }
                          >


                            {/* =========================
                                TITLE AREA
                            ========================= */}

                            <View
                              style={
                                styles.andongTitleArea
                              }
                            >

                              <Text

                                numberOfLines={
                                  2
                                }

                                style={[
                                  styles.andongQuestTitle,

                                  quest.id === 'hahoe' &&
                                    styles.titleHahoe,

                                  quest.id === 'haknam' &&
                                    styles.titleHaknam,

                                  quest.id === 'dosan' &&
                                    styles.titleDosan,

                                  quest.id === 'yekki' &&
                                    styles.titleYekki,

                                  quest.id === 'seonseong' &&
                                    styles.titleSeonseong,

                                  quest.id === 'wolyeonggyo' &&
                                    styles.titleWolyeonggyo,
                                ]}
                              >

                                {
                                  getAndongMapTitle(
                                    quest
                                  )
                                }

                              </Text>

                            </View>



                            {/* =========================
                                ITEM + PROGRESS
                            ========================= */}

                            <View
                              style={
                                styles.andongRewardRow
                              }
                            >


                              <View
                                style={
                                  styles.andongItemSlot
                                }
                              >

                                <Image

                                  source={
                                    quest.itemImage
                                  }

                                  style={[
                                    styles.andongQuestItem,

                                    quest.id === 'hahoe' &&
                                      styles.itemHahoe,

                                    quest.id === 'haknam' &&
                                      styles.itemHaknam,

                                    quest.id === 'dosan' &&
                                      styles.itemDosan,

                                    quest.id === 'yekki' &&
                                      styles.itemYekki,

                                    quest.id === 'seonseong' &&
                                      styles.itemSeonseong,

                                    quest.id === 'wolyeonggyo' &&
                                      styles.itemWolyeonggyo,
                                  ]}

                                  resizeMode="contain"

                                />

                              </View>



                              <Text
                                style={[
                                  styles.andongQuestProgress,

                                  quest.id === 'hahoe' &&
                                    styles.progressHahoe,

                                  quest.id === 'haknam' &&
                                    styles.progressHaknam,

                                  quest.id === 'dosan' &&
                                    styles.progressDosan,

                                  quest.id === 'yekki' &&
                                    styles.progressYekki,

                                  quest.id === 'seonseong' &&
                                    styles.progressSeonseong,

                                  quest.id === 'wolyeonggyo' &&
                                    styles.progressWolyeonggyo,
                                ]}
                              >

                                {
                                  isCollected(
                                    quest.id,
                                    'andong'
                                  )
                                    ? 1
                                    : quest.progress
                                }

                                /

                                {
                                  quest.total
                                }

                              </Text>


                            </View>


                          </ImageBackground>

                        </View>

                      )
                    }


                    {/* =========================================
                        RED PIN
                    ========================================= */}

                    <Pressable

                      style={
                        styles.questPinPressable
                      }

                      onHoverIn={() => {

                        if (
                          IS_WEB
                        ) {

                          setHoveredQuestId(
                            quest.id
                          );

                        }

                      }}

                      onHoverOut={() => {

                        if (
                          IS_WEB
                        ) {

                          setHoveredQuestId(
                            (
                              current
                            ) =>
                              current ===
                                quest.id
                                ? null
                                : current
                          );

                        }

                      }}

                      onPress={() => {

                        setHoveredQuestId(
                          null
                        );

                        openQuest(
                          quest
                        );

                      }}
                    >

                      <Image

                        source={
                          QUEST_PIN
                        }

                        style={
                          styles.questPinImage
                        }

                        resizeMode="contain"

                      />

                    </Pressable>


                  </View>

                )
              )
            }


          </Animated.View>


        </View>



        {/* =================================================
            REGION SWITCH
        ================================================= */}

        <View
          style={
            styles.regionSwitch
          }
        >


          <Pressable

            style={[

              styles.regionButton,

              region ===
                'seoul'
              &&
              styles.regionButtonActive,

            ]}

            onPress={
              selectSeoul
            }
          >

            <Text
              style={[

                styles.regionText,

                region ===
                  'seoul'
                &&
                styles.regionTextActive,

              ]}
            >
              Seoul
            </Text>

          </Pressable>



          <Pressable

            style={[

              styles.regionButton,

              region ===
                'andong'
              &&
              styles.regionButtonActive,

            ]}

            onPress={
              selectAndong
            }
          >

            <Text
              style={[

                styles.regionText,

                region ===
                  'andong'
                &&
                styles.regionTextActive,

              ]}
            >
              Andong
            </Text>

          </Pressable>


        </View>



        {/* =================================================
            QUIZ FLOW
        ================================================= */}

        {
          selectedQuest
          &&
          (

            <>


              <QuizModal

                visible={
                  showQuiz
                }

                title={
                  getQuestTitle(
                    selectedQuest
                  )
                }

                question={
                  selectedQuest
                    .quiz
                    .question
                }

                answers={
                  selectedQuest
                    .quiz
                    .answers
                }

                correctIndex={
                  selectedQuest
                    .quiz
                    .correctIndex
                }

                onClose={
                  closeQuizFlow
                }

                onCorrect={
                  handleCorrect
                }

              />


              <CorrectModal

                visible={
                  showCorrect
                }

                onClose={
                  closeQuizFlow
                }

                onNext={
                  handleNext
                }

              />


              <RewardRevealModal

                visible={
                  showReveal
                }

                itemImage={
                  selectedQuest
                    .itemImage
                }

                onFinish={
                  handleRevealFinish
                }

              />


              <ItemRewardModal

                visible={
                  showReward
                }

                itemImage={
                  selectedQuest
                    .itemImage
                }

                itemName={
                  getRewardItemName(
                    selectedQuest
                  )
                }

                funFact={
                  selectedQuest
                    .quiz
                    .funFact
                }

                compactOk={
                  !isAndongQuest(
                    selectedQuest
                  )
                }

                onOk={
                  handleRewardOk
                }

              />


              {/* =============================================
                  ★ HAHOE BONUS ITEM REWARD

                  Hahoe Mask
                      ↓ OK
                  Hahoe Mask Display
              ============================================= */}

              {
                isAndongQuest(
                  selectedQuest
                )
                &&
                selectedQuest.id ===
                  'hahoe'
                &&
                selectedQuest.bonusItemImage
                &&
                selectedQuest.bonusItemName
                &&
                (

                  <ItemRewardModal

                    visible={
                      showBonusReward
                    }

                    itemImage={
                      selectedQuest
                        .bonusItemImage
                    }

                    itemName={
                      selectedQuest
                        .bonusItemName
                    }

                    funFact={
                      selectedQuest
                        .quiz
                        .funFact
                    }

                    onOk={
                      handleBonusRewardOk
                    }

                  />

                )
              }



              {/* =============================================
                  ★ ANDONG BACKGROUND REWARD

                  일반 안동:
                  Item Reward → Background

                  하회:
                  Mask → Display → Background
              ============================================= */}

              {
                isAndongQuest(
                  selectedQuest
                )
                &&
                (

                  <BackgroundRewardModal

                    visible={
                      showBackgroundReward
                    }

                    backgroundImage={
                      selectedQuest
                        .backgroundImage
                    }

                    backgroundName={
                      selectedQuest
                        .backgroundName
                    }

                    onOk={
                      handleBackgroundRewardOk
                    }

                  />

                )
              }


            </>

          )
        }



        {/* =================================================
            BOTTOM NAV
        ================================================= */}

        <View
          style={
            styles.bottomArea
          }
        >

          <BottomNavigation
            activeTab="map"
          />

        </View>


      </View>


    </View>

  );

}



/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({


    /* =====================================================
       SCREEN
    ===================================================== */

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

      backgroundColor:
        '#D6C49A',

    },



    /* =====================================================
       MAP
    ===================================================== */

    mapViewport: {

      position:
        'absolute',

      top:
        0,

      left:
        0,

      right:
        0,

      bottom:
        0,

      overflow:
        'hidden',

      backgroundColor:
        '#D6C49A',

    },


    movableMap: {

      position:
        'absolute',

      top:
        0,

      left:
        0,

    },


    mapImage: {

      position:
        'absolute',

      top:
        0,

      left:
        0,

      width:
        '100%',

      height:
        '100%',

    },



    /* =====================================================
       QUEST CONTAINER
    ===================================================== */

    questMarkerContainer: {

      position:
        'absolute',

      width:
        QUEST_BOX_WIDTH,

      height:
        QUEST_BOX_HEIGHT +
        QUEST_PIN_HEIGHT -
        2,

      overflow:
        'visible',

      zIndex:
        10,

    },


    questBubble: {

      position:
        'absolute',

      top:
        0,

      left:
        0,

      width:
        QUEST_BOX_WIDTH,

      height:
        QUEST_BOX_HEIGHT,

      zIndex:
        12,

    },



    /* =====================================================
       SEOUL QUEST BOX
    ===================================================== */

    questBox: {

      width:
        QUEST_BOX_WIDTH,

      height:
        QUEST_BOX_HEIGHT,

      paddingTop:
        13,

      paddingLeft:
        22,

      paddingRight:
        18,

      paddingBottom:
        6,

      alignItems:
        'center',

      justifyContent:
        'flex-start',

      overflow:
        'visible',

    },


    questDistrict: {

      width:
        72,

      marginTop:
        5,

      fontSize:
        8,

      lineHeight:
        10,

      fontWeight:
        '800',

      color:
        '#4B3021',

      textAlign:
        'center',

      flexShrink:
        1,

    },


    questContent: {

      width:
        70,

      marginTop:
        3,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-evenly',

    },


    questItem: {

      width:
        QUEST_ITEM_SIZE,

      height:
        QUEST_ITEM_SIZE,

      flexShrink:
        0,

    },


    questProgress: {

      minWidth:
        24,

      fontSize:
        9,

      lineHeight:
        11,

      fontWeight:
        '800',

      color:
        '#4B3021',

      textAlign:
        'center',

    },



    /* =====================================================
       ★ ANDONG QUEST BOX

       padding 안에서
       제목 영역 / 보상 영역을 나눔.
    ===================================================== */

    andongQuestBox: {

      width:
        QUEST_BOX_WIDTH,

      height:
        QUEST_BOX_HEIGHT,

      paddingTop:
        14,

      paddingLeft:
        22,

      paddingRight:
        18,

      paddingBottom:
        7,

      alignItems:
        'center',

      justifyContent:
        'flex-start',

      overflow:
        'visible',

    },



    /* =====================================================
       ★ ANDONG TITLE AREA

       1줄 / 2줄 관계없이
       동일한 높이 사용.
    ===================================================== */

    andongTitleArea: {

      width:
        72,

      height:
        19,

      marginTop:2,

      alignItems:
        'center',

      justifyContent:
        'center',

    },



    /* =====================================================
       ★ ANDONG TITLE
    ===================================================== */

    andongQuestTitle: {

      width:
        72,

      marginTop:4,

      fontSize:
        7.1,

      lineHeight:
        8.4,

      fontWeight:
        '800',

      color:
        '#4B3021',

      textAlign:
        'center',

    },



    /* =====================================================
       ★ ANDONG TITLE POSITION - INDIVIDUAL

       translateX 음수 → 왼쪽
       translateX 양수 → 오른쪽

       translateY 음수 → 위로
       translateY 양수 → 아래로

       각 장소 이름 위치만 따로 조정 가능.
    ===================================================== */

    titleHahoe: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            -2,
        },
      ],

    },


    titleHaknam: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            0,
        },
      ],

    },


    titleDosan: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            -2,
        },
      ],

    },


    titleYekki: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            -2,
        },
      ],

    },


    titleSeonseong: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            0,
        },
      ],

    },


    titleWolyeonggyo: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            0,
        },
      ],

    },



    /* =====================================================
       ★ ANDONG ITEM + PROGRESS ROW
    ===================================================== */

    andongRewardRow: {

      width:
        70,

      height:
        27,

      marginTop:
        1,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      paddingLeft:
        7,

      paddingRight:
        5,

    },



    /* =====================================================
       ★ ITEM SLOT

       원본 PNG별 투명 여백 차이를
       어느 정도 흡수.
    ===================================================== */

    andongItemSlot: {

      width:
        28,

      height:
        27,

      alignItems:
        'center',

      justifyContent:
        'center',

    },



    /* =====================================================
       ★ ANDONG ITEM
    ===================================================== */

    andongQuestItem: {

      width:
        23,

      height:
        23,

    },


    /* =====================================================
       ★ ANDONG ITEM POSITION - INDIVIDUAL

       translateY 음수 → 위로
       translateY 양수 → 아래로

       각 유물 위치만 따로 조정 가능.
    ===================================================== */

    itemHahoe: {

      width:
        23,

      height:
        23,

      transform: [
        {
          translateY:
            -4,
        },
      ],

    },


    itemHaknam: {

      width:
        23,

      height:
        23,

      transform: [
        {
          translateY:
            -4,
        },
      ],

    },


    itemDosan: {

      width:
        23,

      height:
        23,

      transform: [
        {
          translateY:
            -4,
        },
      ],

    },


    itemYekki: {

      width:
        23,

      height:
        23,

      transform: [
        {
          translateY:
            -6,
        },
      ],

    },


    itemSeonseong: {

      width:
        23,

      height:
        23,

      transform: [
        {
          translateY:
            -2,
        },
      ],

    },


    itemWolyeonggyo: {

      width:
        23,

      height:
        23,

      transform: [
        {
          translateY:
            -2,
        },
      ],

    },



    /* =====================================================
       ★ ANDONG PROGRESS
    ===================================================== */

    andongQuestProgress: {

      width:
        26,

      fontSize:
        9,

      lineHeight:
        11,

      fontWeight:
        '800',

      color:
        '#4B3021',

      textAlign:
        'center',

    },


    /* =====================================================
       ★ ANDONG PROGRESS POSITION - INDIVIDUAL

       translateX 음수 → 왼쪽
       translateX 양수 → 오른쪽

       translateY 음수 → 위로
       translateY 양수 → 아래로

       각 장소의 0/1 위치만 따로 조정 가능.
    ===================================================== */

    progressHahoe: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            -5,
        },
      ],

    },


    progressHaknam: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            -5,
        },
      ],

    },


    progressDosan: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            -5,
        },
      ],

    },


    progressYekki: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            -5,
        },
      ],

    },


    progressSeonseong: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            -5,
        },
      ],

    },


    progressWolyeonggyo: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            0,
        },
      ],

    },



    /* =====================================================
       SPECIAL
    ===================================================== */

    specialBadge: {

      position:
        'absolute',

      top:
        6,

      right:
        7,

      minWidth:
        26,

      paddingHorizontal:
        3,

      paddingVertical:
        1,

      alignItems:
        'center',

      justifyContent:
        'center',

      borderRadius:
        4,

      backgroundColor:
        '#D69A46',

      borderWidth:
        1,

      borderColor:
        '#8B5B29',

      zIndex:
        20,

    },


    specialText: {

      fontSize:
        4.5,

      lineHeight:
        6,

      fontWeight:
        '900',

      color:
        '#FFF8E8',

      textAlign:
        'center',

    },



    /* =====================================================
       PIN

       ★ 기본 상태에서 항상 표시
       ★ Web hover target
       ★ Mobile touch target
    ===================================================== */

    questPinPressable: {

      position:
        'absolute',

      width:
        QUEST_PIN_WIDTH,

      height:
        QUEST_PIN_HEIGHT,

      left:
        (
          QUEST_BOX_WIDTH -
          QUEST_PIN_WIDTH
        ) /
        2,

      top:
        QUEST_BOX_HEIGHT -
        2,

      zIndex:
        13,

    },


    questPinImage: {

      width:
        '100%',

      height:
        '100%',

    },



    /* =====================================================
       REGION SWITCH
    ===================================================== */

    regionSwitch: {

      position:
        'absolute',

      top:
        18,

      alignSelf:
        'center',

      flexDirection:
        'row',

      padding:
        4,

      borderRadius:
        14,

      backgroundColor:
        'rgba(255, 248, 232, 0.96)',

      borderWidth:
        1,

      borderColor:
        '#C69B68',

      zIndex:
        20,

      shadowColor:
        '#000',

      shadowOpacity:
        0.12,

      shadowRadius:
        3,

      shadowOffset: {

        width:
          0,

        height:
          2,

      },

      elevation:
        3,

    },


    regionButton: {

      minWidth:
        82,

      paddingHorizontal:
        18,

      paddingVertical:
        9,

      borderRadius:
        10,

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    regionButtonActive: {

      backgroundColor:
        '#E8B9A8',

    },


    regionText: {

      fontSize:
        13,

      fontWeight:
        '600',

      color:
        '#765B42',

    },


    regionTextActive: {

      color:
        '#4B3021',

      fontWeight:
        '700',

    },



    /* =====================================================
       BOTTOM NAV
    ===================================================== */

    bottomArea: {

      position:
        'absolute',

      left:
        10,

      right:
        10,

      bottom:
        18,

      zIndex:
        30,

    },


  });