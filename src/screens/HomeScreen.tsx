import {
  useMemo,
  useState,
} from 'react';

import {
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import CharacterView from '../components/home/CharacterView';
import NotificationButton from '../components/home/NotificationButton';
import RoomBackground from '../components/home/RoomBackground';
import RoomDecorationItem from '../components/home/RoomDecorationItem';

import BottomNavigation, {
  TabKey,
} from '../components/navigation/BottomNavigation';

import {
  CHARACTERS,
  ROOM_BACKGROUNDS,
} from '../constants/assets';

import {
  useCharacter,
} from '../context/CharacterContext';

import {
  useCollection,
} from '../context/CollectionContext';

import {
  SEOUL_QUESTS,
} from '../data/seoulQuests';

import {
  ANDONG_QUESTS,
} from '../data/andongQuests';

import {
  IS_WEB,
  PHONE_MAX_WIDTH,
  colors,
} from '../theme';


/* =========================================================
   TYPES
========================================================= */

type DecorTab =
  | 'items'
  | 'backgrounds';


type DecorItem = {
  id: string;
  name: string;
  image: ImageSourcePropType;
};


type DecorBackground = {
  id: string;
  name: string;
  image: ImageSourcePropType;
};


/* =========================================================
   DECOR DATA
========================================================= */

const SEOUL_DECOR_ITEMS: DecorItem[] =
  SEOUL_QUESTS.map(
    (quest) => ({
      id:
        `seoul-${quest.id}`,

      name:
        quest.title,

      image:
        quest.itemImage,
    })
  );


const ANDONG_MAIN_DECOR_ITEMS: DecorItem[] =
  ANDONG_QUESTS.map(
    (quest) => ({
      id:
        `andong-${quest.id}`,

      name:
        quest.itemName,

      image:
        quest.itemImage,
    })
  );


const ANDONG_BONUS_DECOR_ITEMS: DecorItem[] =
  ANDONG_QUESTS.flatMap(
    (quest) => {

      if (
        !quest.bonusItemImage
        ||
        !quest.bonusItemName
      ) {

        return [];

      }


      return [
        {
          id:
            `andong-${quest.id}-bonus`,

          name:
            quest.bonusItemName,

          image:
            quest.bonusItemImage,
        },
      ];

    }
  );


const ALL_DECOR_ITEMS: DecorItem[] = [
  ...SEOUL_DECOR_ITEMS,
  ...ANDONG_MAIN_DECOR_ITEMS,
  ...ANDONG_BONUS_DECOR_ITEMS,
];


const ALL_ANDONG_BACKGROUNDS:
  DecorBackground[] =
    ANDONG_QUESTS.map(
      (quest) => ({
        id:
          `background-${quest.id}`,

        name:
          quest.backgroundName,

        image:
          quest.backgroundImage,
      })
    );


/* =========================================================
   HOME SCREEN
========================================================= */

export default function HomeScreen() {

  const insets =
    useSafeAreaInsets();


  /* =======================================================
     CHARACTER
  ======================================================= */

  const {
    characterGender,
  } =
    useCharacter();


  const currentCharacter =
    characterGender ===
      'female'

      ? CHARACTERS.female

      : CHARACTERS.male;


  /* =======================================================
     COLLECTION / ROOM
  ======================================================= */

  const {
    acquiredItemIds,
    acquiredBackgroundIds,

    roomItems,
    placeRoomItem,
    removeRoomItem,

    selectedRoomBackgroundId,
    setRoomBackground,
  } =
    useCollection();


  /* =======================================================
     EDITOR STATE
  ======================================================= */

  const [
    decorateMode,
    setDecorateMode,
  ] =
    useState(
      false
    );


  const [
    decorTab,
    setDecorTab,
  ] =
    useState<DecorTab>(
      'items'
    );


  const [
    selectedRoomItemId,
    setSelectedRoomItemId,
  ] =
    useState<
      string |
      null
    >(
      null
    );


  const [
    roomCanvasSize,
    setRoomCanvasSize,
  ] =
    useState({
      width:
        0,

      height:
        0,
    });


  /* =======================================================
     INVENTORY
  ======================================================= */

  const availableItems =
    useMemo(
      () => {

        const unlocked =
          new Set(
            acquiredItemIds
          );


        return ALL_DECOR_ITEMS.filter(
          (item) =>
            unlocked.has(
              item.id
            )
        );

      },
      [
        acquiredItemIds,
      ]
    );


  const availableBackgrounds =
    useMemo(
      () => {

        const unlocked =
          new Set(
            acquiredBackgroundIds
          );


        return ALL_ANDONG_BACKGROUNDS.filter(
          (background) =>
            unlocked.has(
              background.id
            )
        );

      },
      [
        acquiredBackgroundIds,
      ]
    );


  /* =======================================================
     CURRENT BACKGROUND
  ======================================================= */

  const selectedBackground =
    useMemo(
      () =>
        ALL_ANDONG_BACKGROUNDS.find(
          (background) =>
            background.id ===
            selectedRoomBackgroundId
        ),
      [
        selectedRoomBackgroundId,
      ]
    );


  const currentRoomBackground =
    selectedBackground
      ?.image
    ??
    ROOM_BACKGROUNDS.hanok;


  /* =======================================================
     SELECTED ITEM
  ======================================================= */

  const selectedRoomItem =
    roomItems.find(
      (item) =>
        item.itemId ===
        selectedRoomItemId
    );


  /* =======================================================
     CANVAS
  ======================================================= */

  const handleRoomCanvasLayout =
    (
      event:
        LayoutChangeEvent
    ) => {

      const {
        width,
        height,
      } =
        event.nativeEvent
          .layout;


      setRoomCanvasSize({
        width,
        height,
      });

    };


  /* =======================================================
     ITEM ACTIONS
  ======================================================= */

  const handleInventoryItemPress =
    (
      item:
        DecorItem
    ) => {

      const existing =
        roomItems.find(
          (
            roomItem
          ) =>
            roomItem.itemId ===
            item.id
        );


      if (
        existing
      ) {

        setSelectedRoomItemId(
          item.id
        );

        return;

      }


      /*
        새 아이템은 방 중앙보다 살짝 왼쪽,
        바닥보다 위쪽에 생성합니다.
      */

      placeRoomItem({

        itemId:
          item.id,

        x:
          0.43,

        y:
          0.54,

        scale:
          0.85,

      });


      setSelectedRoomItemId(
        item.id
      );

    };


  const changeSelectedItemScale =
    (
      amount:
        number
    ) => {

      if (
        !selectedRoomItem
      ) {
        return;
      }


      placeRoomItem({

        ...selectedRoomItem,

        scale:
          Math.max(
            0.4,
            Math.min(
              selectedRoomItem
                .scale +
                amount,
              2
            )
          ),

      });

    };


  const removeSelectedItem =
    () => {

      if (
        !selectedRoomItemId
      ) {
        return;
      }


      removeRoomItem(
        selectedRoomItemId
      );


      setSelectedRoomItemId(
        null
      );

    };


  /* =======================================================
     BACKGROUND
  ======================================================= */

  const applyBackground =
    (
      backgroundId:
        string |
        null
    ) => {

      setRoomBackground(
        backgroundId
      );

    };


  /* =======================================================
     DECORATE MODE

     Context가 위치/크기/배경을 즉시 저장하므로
     Done & Save는 편집 UI를 닫는 역할입니다.
  ======================================================= */

  const openDecorateMode =
    () => {

      setDecorateMode(
        true
      );

      setDecorTab(
        'items'
      );

    };


  const finishDecorateMode =
    () => {

      setSelectedRoomItemId(
        null
      );

      setDecorateMode(
        false
      );

    };


  /* =======================================================
     BOTTOM TAB
  ======================================================= */

  const handleTabPress = (
    tab: TabKey
  ) => {

    console.log(
      'tab pressed:',
      tab
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

        <RoomBackground
          source={
            currentRoomBackground
          }

          showDefaultDecor={
            selectedRoomBackgroundId ===
            null
          }
        >


          {/* =============================================
              ROOM DECORATION LAYER
          ============================================= */}

          <View
            onLayout={
              handleRoomCanvasLayout
            }

            pointerEvents="box-none"

            style={
              styles.roomDecorationLayer
            }
          >

            {
              roomCanvasSize.width >
                0
              &&
              roomCanvasSize.height >
                0
              &&
              roomItems.map(
                (
                  placement
                ) => {

                  const item =
                    ALL_DECOR_ITEMS.find(
                      (
                        candidate
                      ) =>
                        candidate.id ===
                        placement.itemId
                    );


                  if (
                    !item
                  ) {
                    return null;
                  }


                  return (

                    <RoomDecorationItem
                      key={
                        placement.itemId
                      }

                      placement={
                        placement
                      }

                      image={
                        item.image
                      }

                      canvasWidth={
                        roomCanvasSize.width
                      }

                      canvasHeight={
                        roomCanvasSize.height
                      }

                      editable={
                        decorateMode
                      }

                      selected={
                        selectedRoomItemId ===
                        placement.itemId
                      }

                      onSelect={
                        setSelectedRoomItemId
                      }

                      onMoveEnd={
                        placeRoomItem
                      }
                    />

                  );

                }
              )
            }

          </View>


          {/* =============================================
              TOP UI
          ============================================= */}

          <View
            style={[
              styles.topBar,

              {
                paddingTop:
                  insets.top +
                  8,
              },
            ]}
          >

            <NotificationButton
              count={
                0
              }
            />


            <Pressable
              onPress={
                decorateMode
                  ? finishDecorateMode
                  : openDecorateMode
              }

              style={[
                styles.topDecorateButton,
                decorateMode
                &&
                styles.topDecorateButtonDone,
              ]}
            >

              <Ionicons
                name={
                  decorateMode
                    ? 'checkmark'
                    : 'color-palette-outline'
                }
                size={
                  17
                }
                color="#4A3023"
              />

              <Text
                style={
                  styles.topDecorateButtonText
                }
              >
                {
                  decorateMode
                    ? 'Done'
                    : 'Decorate'
                }
              </Text>

            </Pressable>

          </View>


          {/* =============================================
              CHARACTER
          ============================================= */}

          <View
            pointerEvents={
              decorateMode
                ? 'none'
                : 'auto'
            }

            style={[
              styles.characterArea,

              characterGender ===
                'female'
              &&
              styles.characterAreaFemale,

              characterGender ===
                'male'
              &&
              styles.characterAreaMale,
            ]}
          >

            <CharacterView
              source={
                currentCharacter
              }

              gender={
                characterGender
              }
            />

          </View>


          {/* =============================================
              DECORATE TRAY
          ============================================= */}

          {
            decorateMode
            &&
            (
              <View
                style={[
                  styles.decorateTray,

                  {
                    paddingBottom:
                      Math.max(
                        insets.bottom,
                        8
                      ),
                  },
                ]}
              >

                <View
                  style={
                    styles.trayHeaderRow
                  }
                >

                  <View
                    style={
                      styles.decorTabs
                    }
                  >

                    <Pressable
                      onPress={() =>
                        setDecorTab(
                          'items'
                        )
                      }

                      style={[
                        styles.decorTab,

                        decorTab ===
                          'items'
                        &&
                        styles.decorTabActive,
                      ]}
                    >

                      <Text
                        style={[
                          styles.decorTabText,

                          decorTab ===
                            'items'
                          &&
                          styles.decorTabTextActive,
                        ]}
                      >
                        Items
                      </Text>

                    </Pressable>


                    <Pressable
                      onPress={() =>
                        setDecorTab(
                          'backgrounds'
                        )
                      }

                      style={[
                        styles.decorTab,

                        decorTab ===
                          'backgrounds'
                        &&
                        styles.decorTabActive,
                      ]}
                    >

                      <Text
                        style={[
                          styles.decorTabText,

                          decorTab ===
                            'backgrounds'
                          &&
                          styles.decorTabTextActive,
                        ]}
                      >
                        Backgrounds
                      </Text>

                    </Pressable>

                  </View>


                  {
                    selectedRoomItem
                    &&
                    decorTab === 'items'
                    &&
                    (
                      <View
                        style={
                          styles.inlineItemToolbar
                        }
                      >

                        <Pressable
                          onPress={() =>
                            changeSelectedItemScale(
                              -0.1
                            )
                          }

                          style={
                            styles.inlineToolButton
                          }
                        >

                          <Ionicons
                            name="remove"
                            size={
                              16
                            }
                            color="#4A3023"
                          />

                        </Pressable>


                        <Pressable
                          onPress={
                            removeSelectedItem
                          }

                          style={[
                            styles.inlineToolButton,
                            styles.deleteToolButton,
                          ]}
                        >

                          <Ionicons
                            name="trash-outline"
                            size={
                              15
                            }
                            color="#8B3F47"
                          />

                        </Pressable>


                        <Pressable
                          onPress={() =>
                            changeSelectedItemScale(
                              0.1
                            )
                          }

                          style={
                            styles.inlineToolButton
                          }
                        >

                          <Ionicons
                            name="add"
                            size={
                              16
                            }
                            color="#4A3023"
                          />

                        </Pressable>

                      </View>
                    )
                  }

                </View>


                {
                  decorTab ===
                    'items'
                  ? (

                    <ScrollView
                      horizontal

                      showsHorizontalScrollIndicator={
                        false
                      }

                      contentContainerStyle={
                        styles.inventoryRow
                      }
                    >

                      {
                        availableItems.length ===
                          0
                        ? (
                          <Text
                            style={
                              styles.emptyText
                            }
                          >
                            Complete quizzes to unlock items.
                          </Text>
                        )
                        : (
                          availableItems.map(
                            (
                              item
                            ) => {

                              const placed =
                                roomItems.some(
                                  (
                                    roomItem
                                  ) =>
                                    roomItem.itemId ===
                                    item.id
                                );


                              return (

                                <Pressable
                                  key={
                                    item.id
                                  }

                                  onPress={() =>
                                    handleInventoryItemPress(
                                      item
                                    )
                                  }

                                  style={[
                                    styles.inventoryCard,

                                    selectedRoomItemId ===
                                      item.id
                                    &&
                                    styles.inventoryCardSelected,
                                  ]}
                                >

                                  <Image
                                    source={
                                      item.image
                                    }

                                    resizeMode="contain"

                                    style={
                                      styles.inventoryItemImage
                                    }
                                  />

                                  <Text
                                    numberOfLines={
                                      2
                                    }

                                    style={
                                      styles.inventoryName
                                    }
                                  >
                                    {
                                      item.name
                                    }
                                  </Text>


                                  {
                                    placed
                                    &&
                                    (
                                      <View
                                        style={
                                          styles.placedBadge
                                        }
                                      >

                                        <Text
                                          style={
                                            styles.placedBadgeText
                                          }
                                        >
                                          In Room
                                        </Text>

                                      </View>
                                    )
                                  }

                                </Pressable>

                              );

                            }
                          )
                        )
                      }

                    </ScrollView>

                  )
                  : (

                    <ScrollView
                      horizontal

                      showsHorizontalScrollIndicator={
                        false
                      }

                      contentContainerStyle={
                        styles.inventoryRow
                      }
                    >

                      <Pressable
                        onPress={() =>
                          applyBackground(
                            null
                          )
                        }

                        style={[
                          styles.backgroundCard,

                          selectedRoomBackgroundId ===
                            null
                          &&
                          styles.backgroundCardSelected,
                        ]}
                      >

                        <Image
                          source={
                            ROOM_BACKGROUNDS.hanok
                          }

                          resizeMode="cover"

                          style={
                            styles.backgroundPreview
                          }
                        />

                        <Text
                          numberOfLines={
                            1
                          }

                          style={
                            styles.inventoryName
                          }
                        >
                          Hanok Room
                        </Text>

                      </Pressable>


                      {
                        availableBackgrounds.map(
                          (
                            background
                          ) => (

                            <Pressable
                              key={
                                background.id
                              }

                              onPress={() =>
                                applyBackground(
                                  background.id
                                )
                              }

                              style={[
                                styles.backgroundCard,

                                selectedRoomBackgroundId ===
                                  background.id
                                &&
                                styles.backgroundCardSelected,
                              ]}
                            >

                              <Image
                                source={
                                  background.image
                                }

                                resizeMode="cover"

                                style={
                                  styles.backgroundPreview
                                }
                              />

                              <Text
                                numberOfLines={
                                  1
                                }

                                style={
                                  styles.inventoryName
                                }
                              >
                                {
                                  background.name
                                }
                              </Text>

                            </Pressable>

                          )
                        )
                      }


                      {
                        availableBackgrounds.length ===
                          0
                        &&
                        (
                          <Text
                            style={
                              styles.backgroundHint
                            }
                          >
                            Earn Andong backgrounds to use them here.
                          </Text>
                        )
                      }

                    </ScrollView>

                  )
                }

              </View>
            )
          }


          {/* =============================================
              BOTTOM NAVIGATION
          ============================================= */}

          {
            !decorateMode
            &&
            (
              <View
                style={[
                  styles.bottomArea,

                  {
                    paddingBottom:
                      Math.max(
                        insets.bottom,
                        12
                      ),
                  },
                ]}
              >

                <BottomNavigation
                  activeTab="home"

                  onTabPress={
                    handleTabPress
                  }
                />

              </View>
            )
          }


        </RoomBackground>

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

      overflow:
        'hidden',

    },


    /* =====================================================
       ROOM
    ===================================================== */

    roomDecorationLayer: {

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

      zIndex:
        4,

    },


    /* =====================================================
       TOP BAR
    ===================================================== */

    topBar: {

      zIndex:
        40,

      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'flex-start',

      paddingHorizontal:
        16,

    },


    topDecorateButton: {

      height:
        42,

      paddingHorizontal:
        12,

      borderRadius:
        14,

      borderWidth:
        2,

      borderColor:
        colors.creamBorder,

      backgroundColor:
        colors.cream,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap:
        6,

      shadowColor:
        colors.shadow,

      shadowOpacity:
        0.25,

      shadowRadius:
        4,

      shadowOffset: {
        width:
          0,

        height:
          2,
      },

      elevation:
        3,

    },


    topDecorateButtonDone: {

      backgroundColor:
        colors.cream,

      borderColor:
        colors.creamBorder,

    },


    topDecorateButtonText: {

      color:
        colors.textDark,

      fontSize:
        12,

      fontFamily:
        'MapseeFredokaBold',

    },


    /* =====================================================
       EDIT HEADER
    ===================================================== */

    editHeader: {

      position:
        'absolute',

      left:
        14,

      right:
        14,

      zIndex:
        80,

      minHeight:
        54,

      paddingLeft:
        14,

      paddingRight:
        7,

      paddingVertical:
        7,

      borderRadius:
        15,

      borderWidth:
        2,

      borderColor:
        '#A87852',

      backgroundColor:
        'rgba(255, 246, 226, 0.96)',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      shadowColor:
        '#2E1F12',

      shadowOpacity:
        0.18,

      shadowRadius:
        4,

      shadowOffset: {
        width:
          0,

        height:
          2,
      },

      elevation:
        4,

    },


    editTitle: {

      color:
        '#4B3021',

      fontSize:
        14,

      fontFamily:
        'MapseeFredokaBold',

    },


    editHint: {

      color:
        '#7D6047',

      fontSize:
        8.5,

      marginTop:
        1,

      fontFamily:
        'MapseeFredokaMedium',

    },


    doneButton: {

      height:
        38,

      minWidth:
        78,

      paddingHorizontal:
        12,

      borderRadius:
        11,

      backgroundColor:
        '#D96F78',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap:
        5,

    },


    doneButtonText: {

      color:
        '#FFF8E8',

      fontSize:
        12,

      fontFamily:
        'MapseeFredokaBold',

    },


    /* =====================================================
       CHARACTER
    ===================================================== */

    characterArea: {

      flex:
        1,

      zIndex:
        8,

      justifyContent:
        'flex-end',

      alignItems:
        'center',

      paddingBottom:
        4,

    },


    characterAreaFemale: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            -15,
        },
      ],

    },


    characterAreaMale: {

      transform: [
        {
          translateX:
            0,
        },
        {
          translateY:
            -26,
        },
      ],

    },


    /* =====================================================
       NORMAL DECORATE BUTTON
    ===================================================== */

    decorateButton: {

      position:
        'absolute',

      right:
        16,

      zIndex:
        60,

      height:
        42,

      paddingHorizontal:
        15,

      borderRadius:
        15,

      borderWidth:
        2,

      borderColor:
        '#8B5740',

      backgroundColor:
        '#D96F78',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap:
        6,

      shadowColor:
        '#2E1F12',

      shadowOpacity:
        0.22,

      shadowRadius:
        4,

      shadowOffset: {
        width:
          0,

        height:
          2,
      },

      elevation:
        4,

    },


    decorateButtonText: {

      color:
        '#FFF8E8',

      fontSize:
        13,

      fontFamily:
        'MapseeFredokaBold',

    },


    /* =====================================================
       ITEM TOOLBAR

       선택 도구는 캐릭터 얼굴 위에 띄우지 않고
       하단 트레이 안에 넣습니다.
    ===================================================== */

    trayHeaderRow: {

      minHeight:
        36,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      marginBottom:
        5,

      gap:
        7,

    },


    inlineItemToolbar: {

      flexDirection:
        'row',

      alignItems:
        'center',

      gap:
        4,

      padding:
        3,

      borderRadius:
        10,

      borderWidth:
        1.5,

      borderColor:
        '#B88962',

      backgroundColor:
        '#FFF6E2',

    },


    inlineToolButton: {

      width:
        29,

      height:
        29,

      borderRadius:
        8,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#F4E0BE',

    },


    deleteToolButton: {

      backgroundColor:
        '#F4D4D3',

    },


    /* =====================================================
       TRAY
    ===================================================== */

    decorateTray: {

      position:
        'absolute',

      left:
        8,

      right:
        8,

      bottom:
        0,

      height:
        146,

      zIndex:
        70,

      paddingTop:
        7,

      paddingHorizontal:
        8,

      borderTopLeftRadius:
        18,

      borderTopRightRadius:
        18,

      borderWidth:
        2,

      borderBottomWidth:
        0,

      borderColor:
        '#9B6948',

      backgroundColor:
        'rgba(255, 244, 220, 0.98)',

    },


    decorTabs: {

      flexDirection:
        'row',

      padding:
        3,

      borderRadius:
        11,

      backgroundColor:
        '#E7D0AA',

    },


    decorTab: {

      minWidth:
        82,

      paddingVertical:
        6,

      paddingHorizontal:
        9,

      borderRadius:
        8,

      alignItems:
        'center',

    },


    decorTabActive: {

      backgroundColor:
        '#D96F78',

    },


    decorTabText: {

      color:
        '#654632',

      fontSize:
        11,

      fontFamily:
        'MapseeFredokaMedium',

    },


    decorTabTextActive: {

      color:
        '#FFF8E8',

      fontFamily:
        'MapseeFredokaBold',

    },


    inventoryRow: {

      height:
        90,

      alignItems:
        'center',

      paddingHorizontal:
        2,

      gap:
        7,

    },


    inventoryCard: {

      width:
        68,

      height:
        84,

      padding:
        4,

      borderRadius:
        10,

      borderWidth:
        1.4,

      borderColor:
        '#C69B68',

      backgroundColor:
        '#FFF4DE',

      alignItems:
        'center',

      justifyContent:
        'flex-start',

      position:
        'relative',

    },


    inventoryCardSelected: {

      borderWidth:
        2.3,

      borderColor:
        '#D96F78',

      backgroundColor:
        '#FFF0E9',

    },


    inventoryItemImage: {

      width:
        48,

      height:
        51,

      marginBottom:
        1,

    },


    inventoryName: {

      color:
        '#4B3021',

      fontSize:
        7.5,

      lineHeight:
        9,

      fontFamily:
        'MapseeFredokaMedium',

      textAlign:
        'center',

    },


    placedBadge: {

      position:
        'absolute',

      top:
        3,

      right:
        3,

      paddingHorizontal:
        4,

      paddingVertical:
        2,

      borderRadius:
        5,

      backgroundColor:
        '#D96F78',

    },


    placedBadgeText: {

      color:
        '#FFF8E8',

      fontSize:
        5.5,

      fontFamily:
        'MapseeFredokaBold',

    },


    backgroundCard: {

      width:
        100,

      height:
        84,

      padding:
        4,

      borderRadius:
        10,

      borderWidth:
        1.4,

      borderColor:
        '#C69B68',

      backgroundColor:
        '#FFF4DE',

      alignItems:
        'center',

    },


    backgroundCardSelected: {

      borderWidth:
        2.3,

      borderColor:
        '#D96F78',

      backgroundColor:
        '#FFF0E9',

    },


    backgroundPreview: {

      width:
        90,

      height:
        57,

      borderRadius:
        7,

      marginBottom:
        2,

    },


    emptyText: {

      width:
        240,

      color:
        '#795D47',

      fontSize:
        10,

      textAlign:
        'center',

      fontFamily:
        'MapseeFredokaMedium',

    },


    backgroundHint: {

      width:
        180,

      marginLeft:
        4,

      color:
        '#795D47',

      fontSize:
        9,

      lineHeight:
        12,

      textAlign:
        'center',

      fontFamily:
        'MapseeFredokaMedium',

    },


    /* =====================================================
       BOTTOM NAV
    ===================================================== */

    bottomArea: {

      zIndex:
        50,

      paddingHorizontal:
        14,

      paddingTop:
        6,

    },

  });
