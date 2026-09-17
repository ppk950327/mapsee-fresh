import {
  useEffect,
  useState,
} from 'react';

import {
  router,
} from 'expo-router';

import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import NicknameEditModal, {
  PROFILE_NICKNAME_STORAGE_KEY,
} from '../components/profile/NicknameEditModal';


import LanguageButton from '../components/home/LanguageButton';
import NotificationButton from '../components/home/NotificationButton';
import BottomNavigation from '../components/navigation/BottomNavigation';
import { TAB_ICONS } from '../constants/assets';

import { useCollection } from '../context/CollectionContext';

import {
  CharacterGender,
  useCharacter,
} from '../context/CharacterContext';

import {
  colors,
  IS_WEB,
  PHONE_MAX_WIDTH,
} from '../theme';


/* =========================================================
   ASSETS
========================================================= */

const HEADER_FRAME =
  require('../../assets/images/header-frame.png');

const PROFILE_MAIN_PANEL =
  require('../../assets/images/profile-main-panel.png');


/* =========================================================
   CHARACTER PNG
========================================================= */

const CHARACTER_FEMALE =
  require('../../assets/images/character-female.png');

const CHARACTER_MALE =
  require('../../assets/images/character-male.png');


/* =========================================================
   PROFILE SCREEN
========================================================= */

export default function ProfileScreen() {

  /* =======================================================
     COLLECTION
  ======================================================= */

  const {
    collectedSeoulCount,
  } = useCollection();


  /* =======================================================
     PROFILE COLLECTION COUNTS

     현재 서울 퀘스트 18개
     현재 안동 퀘스트 6개

     안동 실제 수집 상태 저장은
     CollectionContext 연결 단계에서 추가 예정.
  ======================================================= */

  const SEOUL_TOTAL_COUNT =
    18;

  const ANDONG_TOTAL_COUNT =
    6;

  const collectedAndongCount =
    0;

  const totalCollectedCount =
    collectedSeoulCount +
    collectedAndongCount;

  const totalAvailableCount =
    SEOUL_TOTAL_COUNT +
    ANDONG_TOTAL_COUNT;

  const profileCollectionProgress =
    totalAvailableCount > 0
      ? Math.round(
          (
            totalCollectedCount /
            totalAvailableCount
          ) *
            100
        )
      : 0;


  /* =======================================================
     CHARACTER
  ======================================================= */

  const {
    characterGender,
    setCharacterGender,
  } = useCharacter();


  /* =======================================================
     NICKNAME

     AsyncStorage에서 저장된 이름을 불러오고,
     닉네임 수정은 NicknameEditModal에서 처리.
  ======================================================= */

  const [
    nickname,
    setNickname,
  ] =
    useState(
      'Traveler'
    );


  const [
    tempNickname,
    setTempNickname,
  ] =
    useState(
      'Traveler'
    );


  const [
    showNicknameModal,
    setShowNicknameModal,
  ] =
    useState(
      false
    );


  /* =======================================================
     LOAD SAVED NICKNAME
  ======================================================= */

  useEffect(
    () => {

      const loadNickname =
        async () => {

          try {

            const savedNickname =
              await AsyncStorage.getItem(
                PROFILE_NICKNAME_STORAGE_KEY
              );


            if (
              savedNickname
              &&
              savedNickname.trim().length >
                0
            ) {

              setNickname(
                savedNickname
              );

              setTempNickname(
                savedNickname
              );

            }

          } catch (
            error
          ) {

            console.log(
              'Nickname load error:',
              error
            );

          }

        };


      void loadNickname();

    },
    []
  );


  /* =======================================================
     OPEN NICKNAME MODAL
  ======================================================= */

  const openNicknameModal =
    () => {

      setTempNickname(
        nickname
      );

      setShowNicknameModal(
        true
      );

    };


  /* =======================================================
     NICKNAME SAVED
  ======================================================= */

  const handleNicknameSaved = (
    savedNickname:
      string
  ) => {

    setNickname(
      savedNickname
    );

    setTempNickname(
      savedNickname
    );

    setShowNicknameModal(
      false
    );

  };


  /* =======================================================
     CLOSE NICKNAME MODAL
  ======================================================= */

  const closeNicknameModal =
    () => {

      setTempNickname(
        nickname
      );

      setShowNicknameModal(
        false
      );

    };


  /* =======================================================
     CHARACTER MODAL
  ======================================================= */

  const [
    showCharacterModal,
    setShowCharacterModal,
  ] = useState(false);


  const [
    tempGender,
    setTempGender,
  ] =
    useState<CharacterGender>(
      characterGender
    );


  /* =======================================================
     SCREEN SIZE
  ======================================================= */

  const {
    width,
    height,
  } = useWindowDimensions();


  const phoneWidth =
    IS_WEB
      ? Math.min(
          width,
          PHONE_MAX_WIDTH
        )
      : width;


  /*
    PROFILE MAIN PANEL
    기존보다 좌우 여백을 줄여 메인 패널을 조금 더 크게 보이게 함.
  */
  const contentBaseWidth =
    phoneWidth - 30;

  const panelWidth =
    phoneWidth -22;


  const panelHeightByWidth =
    contentBaseWidth * 1.78;


  const availablePanelHeight =
    height - 72 - 78;


  const panelHeight =
    Math.min(
      panelHeightByWidth,
      availablePanelHeight
    );


  /*
    내부 UI 크기는 기존 비율 유지.
  */
  const scale =
    contentBaseWidth / 398;


  /* =======================================================
     CURRENT CHARACTER
  ======================================================= */

  const currentCharacterImage =
    characterGender === 'female'
      ? CHARACTER_FEMALE
      : CHARACTER_MALE;


  /* =======================================================
     OPEN CHARACTER MODAL
  ======================================================= */

  const openCharacterModal =
    () => {

      setTempGender(
        characterGender
      );

      setShowCharacterModal(
        true
      );

    };


  /* =======================================================
     CONFIRM CHARACTER
  ======================================================= */

  const confirmCharacter =
    () => {

      setCharacterGender(
        tempGender
      );

      setShowCharacterModal(
        false
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
            TOP BAR
        ================================================= */}

        <View
          style={
            styles.topBar
          }
        >

          {/* NOTIFICATION */}

          <NotificationButton
            count={0}
          />


          {/* PROFILE HEADER */}

          <ImageBackground
            source={
              HEADER_FRAME
            }
            style={
              styles.headerFrame
            }
            resizeMode="contain"
          >

            <Image
              source={
                TAB_ICONS.profile
              }
              style={
                styles.headerIcon
              }
              resizeMode="contain"
            />


            <Text
              style={
                styles.headerTitle
              }
            >
              Profile
            </Text>

          </ImageBackground>


          {/* LANGUAGE */}

          <LanguageButton
            language="EN"
          />


        </View>


        {/* =================================================
            MAIN PANEL
        ================================================= */}

        <View
          style={
            styles.panelArea
          }
        >

          <ImageBackground
            source={
              PROFILE_MAIN_PANEL
            }

            style={{
              width:
                panelWidth,

              height:
                panelHeight,
            }}

            resizeMode="stretch"
          >

            {/* =============================================
                PROFILE INFO
            ============================================= */}

            <View
              style={[
                styles.profileTop,

                {
                  top:
                    25 * scale,

                  left:
                    34 * scale,

                  right:
                    34 * scale,

                  height:
                    110 * scale,
                },
              ]}
            >

              {/* ===========================================
                  AVATAR
              =========================================== */}

              <View
                style={[
                  styles.avatarBox,

                  {
                    width:
                      72 * scale,

                    height:
                      94 * scale,

                    borderRadius:
                      29 * scale,
                  },
                ]}
              >

                <Image
                  source={
                    currentCharacterImage
                  }
                  style={
                    styles.avatarImage
                  }
                  resizeMode="contain"
                />

              </View>


              {/* PROFILE INFO */}

              <View
                style={[
                  styles.profileInfo,

                  {
                    marginLeft:
                      17 * scale,
                  },
                ]}
              >

                {/* NICKNAME */}

                <View
                  style={[
                    styles.nicknameRow,

                    {
                      marginBottom:
                        8 * scale,
                    },
                  ]}
                >

                  <Pressable
                    style={
                      styles.nicknameButton
                    }

                    onPress={
                      openNicknameModal
                    }
                  >

                    <Text
                      style={[
                        styles.nickname,

                        {
                          fontSize:
                            18 * scale,

                          marginRight:
                            7 * scale,
                        },
                      ]}
                      numberOfLines={
                        1
                      }
                    >
                      {
                        nickname
                      }
                    </Text>


                    <Ionicons
                      name="pencil"
                      size={
                        15 * scale
                      }
                      color="#332319"
                    />

                  </Pressable>

                </View>


                {/* COLLECTION */}

                <View
                  style={[
                    styles.levelRow,

                    {
                      marginBottom:
                        5 * scale,
                    },
                  ]}
                >

                  <Text
                    style={[
                      styles.levelText,

                      {
                        fontSize:
                          10 * scale,
                      },
                    ]}
                  >
                    Collection
                  </Text>


                  <Text
                    style={[
                      styles.levelText,

                      {
                        fontSize:
                          10 * scale,
                      },
                    ]}
                  >
                    {
                      profileCollectionProgress
                    }
                    %
                  </Text>

                </View>


                {/* PROGRESS BAR */}

                <View
                  style={[
                    styles.expTrack,

                    {
                      height:
                        7 * scale,

                      borderRadius:
                        4 * scale,
                    },
                  ]}
                >

                  <View
                    style={[
                      styles.expFill,

                      {
                        width:
                          `${profileCollectionProgress}%`,
                      },
                    ]}
                  />

                </View>

              </View>

            </View>


            {/* =============================================
                STATS

                Progress / Seoul / Andong
                동일한 3열 구조
            ============================================= */}

            <View
              style={[
                styles.statsCard,

                {
                  top:
                    137 * scale,

                  left:
                    26 * scale,

                  right:
                    26 * scale,

                  height:
                    55 * scale,

                  borderRadius:
                    7 * scale,
                },
              ]}
            >


              {/* PROGRESS */}

              <View
                style={
                  styles.statCenter
                }
              >

                <Text
                  style={[
                    styles.statLabel,

                    {
                      fontSize:
                        9.5 * scale,
                    },
                  ]}
                >
                  Progress
                </Text>


                <Text
                  style={[
                    styles.statValue,

                    {
                      fontSize:
                        14 * scale,
                    },
                  ]}
                >
                  {
                    profileCollectionProgress
                  }
                  %
                </Text>

              </View>


              <View
                style={[
                  styles.statDivider,

                  {
                    height:
                      32 * scale,
                  },
                ]}
              />


              {/* SEOUL */}

              <View
                style={
                  styles.statCenter
                }
              >

                <Text
                  style={[
                    styles.statLabel,

                    {
                      fontSize:
                        9.5 * scale,
                    },
                  ]}
                >
                  Seoul
                </Text>


                <Text
                  style={[
                    styles.statValue,

                    {
                      fontSize:
                        14 * scale,
                    },
                  ]}
                >
                  {
                    collectedSeoulCount
                  }
                  {' / '}
                  {
                    SEOUL_TOTAL_COUNT
                  }
                </Text>

              </View>


              <View
                style={[
                  styles.statDivider,

                  {
                    height:
                      32 * scale,
                  },
                ]}
              />


              {/* ANDONG */}

              <View
                style={
                  styles.statCenter
                }
              >

                <Text
                  style={[
                    styles.statLabel,

                    {
                      fontSize:
                        9.5 * scale,
                    },
                  ]}
                >
                  Andong
                </Text>


                <Text
                  style={[
                    styles.statValue,

                    {
                      fontSize:
                        14 * scale,
                    },
                  ]}
                >
                  {
                    collectedAndongCount
                  }
                  {' / '}
                  {
                    ANDONG_TOTAL_COUNT
                  }
                </Text>

              </View>


            </View>


            {/* =============================================
                MENU
            ============================================= */}

            <View
              style={[
                styles.menuArea,

                {
                  top:
                    197 * scale,

                  left:
                    26 * scale,

                  right:
                    26 * scale,

                  gap:
                    4 * scale,
                },
              ]}
            >

              {/* CHARACTER */}

              <MenuRow
                icon="people-outline"
                title="Character"

                value={
                  characterGender ===
                  'female'
                    ? 'Female'
                    : 'Male'
                }

                scale={
                  scale
                }

                onPress={
                  openCharacterModal
                }
              />


              {/* ACCOUNT */}

              <MenuRow
                icon="person-outline"
                title="Account"
                scale={
                  scale
                }

                onPress={() =>
                  router.push(
                    '/account'
                  )
                }
              />


              {/* NOTIFICATIONS */}

              <MenuRow
                icon="notifications-outline"
                title="Notifications"
                scale={
                  scale
                }

                onPress={() =>
                  router.push(
                    '/notifications'
                  )
                }
              />


              {/* USER GUIDE */}

              <MenuRow
                icon="book-outline"
                title="User Guide"
                scale={
                  scale
                }

                onPress={() =>
                  router.push(
                    '/user-guide'
                  )
                }
              />


              {/* ABOUT */}

              <MenuRow
                icon="information-circle-outline"
                title="About"
                value="Version 1.0.0"
                scale={
                  scale
                }

                onPress={() =>
                  router.push(
                    '/about'
                  )
                }
              />

            </View>

          </ImageBackground>

        </View>


        {/* =================================================
            BOTTOM NAV
        ================================================= */}

        <View
          style={
            styles.bottomArea
          }
        >

          <BottomNavigation
            activeTab="profile"
          />

        </View>


        {/* =================================================
            NICKNAME EDIT MODAL
        ================================================= */}

        <NicknameEditModal
          visible={
            showNicknameModal
          }

          nickname={
            nickname
          }

          tempNickname={
            tempNickname
          }

          onChangeNickname={
            setTempNickname
          }

          onClose={
            closeNicknameModal
          }

          onSaved={
            handleNicknameSaved
          }
        />


        {/* =================================================
            CHARACTER MODAL
        ================================================= */}

        <Modal
          visible={
            showCharacterModal
          }

          transparent

          animationType="fade"

          statusBarTranslucent

          onRequestClose={() =>
            setShowCharacterModal(
              false
            )
          }
        >

          <View
            style={
              styles.modalOverlay
            }
          >

            <View
              style={
                styles.characterModal
              }
            >

              {/* TITLE */}

              <Text
                style={
                  styles.modalTitle
                }
              >
                Choose Your Character
              </Text>


              <Text
                style={
                  styles.modalSubtitle
                }
              >
                Select the character you want to use.
              </Text>


              {/* ===========================================
                  OPTIONS
              =========================================== */}

              <View
                style={
                  styles.characterOptions
                }
              >

                {/* =========================================
                    FEMALE
                ========================================= */}

                <Pressable
                  style={[
                    styles.characterOption,

                    tempGender ===
                      'female' &&
                      styles.characterOptionSelected,
                  ]}

                  onPress={() =>
                    setTempGender(
                      'female'
                    )
                  }
                >

                  <View
                    style={
                      styles.characterPreviewArea
                    }
                  >

                    <Image
                      source={
                        CHARACTER_FEMALE
                      }

                      style={
                        styles.characterPreview
                      }

                      resizeMode="contain"
                    />

                  </View>


                  <Text
                    style={
                      styles.characterOptionTitle
                    }
                  >
                    Female
                  </Text>


                  <View
                    style={
                      styles.checkArea
                    }
                  >

                    {tempGender ===
                      'female' && (

                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#C86470"
                      />

                    )}

                  </View>

                </Pressable>


                {/* =========================================
                    MALE
                ========================================= */}

                <Pressable
                  style={[
                    styles.characterOption,

                    tempGender ===
                      'male' &&
                      styles.characterOptionSelected,
                  ]}

                  onPress={() =>
                    setTempGender(
                      'male'
                    )
                  }
                >

                  <View
                    style={
                      styles.characterPreviewArea
                    }
                  >

                    <Image
                      source={
                        CHARACTER_MALE
                      }

                      style={[
                        styles.characterPreview,
                        styles.characterPreviewMale,
                      ]}

                      resizeMode="contain"
                    />

                  </View>


                  <Text
                    style={[
                      styles.characterOptionTitle,
                      styles.characterOptionTitleMale,
                    ]}
                  >
                    Male
                  </Text>


                  <View
                    style={
                      styles.checkArea
                    }
                  >

                    {tempGender ===
                      'male' && (

                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#C86470"
                      />

                    )}

                  </View>

                </Pressable>

              </View>


              {/* ===========================================
                  CONFIRM
              =========================================== */}

              <Pressable
                style={
                  styles.confirmButton
                }

                onPress={
                  confirmCharacter
                }
              >

                <Text
                  style={
                    styles.confirmButtonText
                  }
                >
                  Confirm
                </Text>

              </Pressable>


              {/* ===========================================
                  CANCEL
              =========================================== */}

              <Pressable
                style={
                  styles.cancelButton
                }

                onPress={() =>
                  setShowCharacterModal(
                    false
                  )
                }
              >

                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel
                </Text>

              </Pressable>

            </View>

          </View>

        </Modal>

      </View>

    </View>

  );
}


/* =========================================================
   MENU ROW
========================================================= */

type MenuIconName =
  | 'people-outline'
  | 'person-outline'
  | 'notifications-outline'
  | 'book-outline'
  | 'information-circle-outline';


type MenuRowProps = {

  icon:
    MenuIconName;

  title:
    string;

  value?:
    string;

  scale:
    number;

  onPress?:
    () => void;

};


function MenuRow({
  icon,
  title,
  value,
  scale,
  onPress,
}: MenuRowProps) {

  return (

    <Pressable
      style={({ pressed }) => [

        styles.menuRow,

        {
          height:
            36 * scale,

          borderRadius:
            7 * scale,

          paddingHorizontal:
            12 * scale,
        },

        pressed &&
          onPress &&
          styles.menuRowPressed,

      ]}

      onPress={
        onPress
      }

      disabled={
        !onPress
      }
    >

      <View
        style={
          styles.menuLeft
        }
      >

        <Ionicons
          name={
            icon
          }

          size={
            17 * scale
          }

          color="#332319"
        />


        <Text
          style={[
            styles.menuTitle,

            {
              fontSize:
                11 * scale,

              marginLeft:
                8 * scale,
            },
          ]}
        >
          {
            title
          }
        </Text>

      </View>


      <View
        style={
          styles.menuRight
        }
      >

        {value ? (

          <Text
            style={[
              styles.menuValue,

              {
                fontSize:
                  8.5 * scale,

                marginRight:
                  5 * scale,
              },
            ]}

            numberOfLines={
              1
            }
          >
            {
              value
            }
          </Text>

        ) : null}


        <Ionicons
          name="chevron-forward"

          size={
            14 * scale
          }

          color="#A47A53"
        />

      </View>

    </Pressable>

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

      backgroundColor:
        '#7B451F',

      position:
        'relative',

      overflow:
        'hidden',

    },


    /* =====================================================
       TOP BAR
    ===================================================== */

    topBar: {

      height:
        72,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      paddingHorizontal:
        16,

    },


    /* 가운데 Profile 상판 */

    headerFrame: {

      /*
        새 고해상도 header-frame.png 전용.
        contain으로 비율을 유지해서 장식이 늘어나지 않게 함.
      */
      width:
        270,

      height:
        70,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    headerIcon: {

      width:
        21,

      height:
        21,

      marginRight:
        7,

    },


    headerTitle: {

      fontSize:
        17,

      fontFamily:
        'MapseeFredokaBold',

      color:
        '#332319',

    },


    /* 알림 버튼 */

    /* EN 버튼 */

    /* 버튼 안쪽 */

    /* =====================================================
       PANEL
    ===================================================== */

    panelArea: {

      flex:
        1,

      alignItems:
        'center',

      justifyContent:
        'flex-start',

      marginTop:
        -1,

      paddingBottom:
        78,

    },


    /* =====================================================
       PROFILE
    ===================================================== */

    profileTop: {

      position:
        'absolute',

      flexDirection:
        'row',

      alignItems:
        'center',

    },


    avatarBox: {

      borderWidth:
        1,

      borderColor:
        '#D8AA77',

      backgroundColor:
        '#F4D0A3',

      alignItems:
        'center',

      justifyContent:
        'center',

      overflow:
        'hidden',

    },


    avatarImage: {

      width:
        '92%',

      height:
        '92%',

    },


    profileInfo: {

      flex:
        1,

      paddingRight:
        2,

    },


    nicknameRow: {

      flexDirection:
        'row',

      alignItems:
        'center',

    },


    nicknameButton: {

      flexDirection:
        'row',

      alignItems:
        'center',

      maxWidth:
        '100%',

    },


    nickname: {

      fontFamily:
        'MapseeFredokaBold',

      color:
        '#332319',

      flexShrink:
        1,

    },



    levelRow: {

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

    },


    levelText: {

      fontFamily:
        'MapseeFredokaMedium',

      color:
        '#332319',

    },


    expTrack: {

      width:
        '100%',

      borderWidth:
        1,

      borderColor:
        '#D5A778',

      backgroundColor:
        '#F4D8B2',

      overflow:
        'hidden',

    },


    expFill: {

      height:
        '100%',

      backgroundColor:
        '#E56F82',

    },


    /* =====================================================
       STATS
    ===================================================== */

    statsCard: {

      position:
        'absolute',

      borderWidth:
        1,

      borderColor:
        '#D4A575',

      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        'rgba(250,225,190,0.14)',

    },



    statCenter: {

      flex:
        1,

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    statLabel: {

      fontFamily:
        'MapseeFredokaMedium',

      color:
        '#433124',

      textAlign:
        'center',

    },


    statValue: {

      fontFamily:
        'MapseeFredokaBold',

      color:
        '#332319',

      textAlign:
        'center',

      marginTop:
        2,

    },


    statDivider: {

      width:
        1,

      backgroundColor:
        '#D3B288',

    },


    /* =====================================================
       MENU
    ===================================================== */

    menuArea: {

      position:
        'absolute',

    },


    menuRow: {

      borderWidth:
        1,

      borderColor:
        '#D2A372',

      backgroundColor:
        'rgba(250,224,187,0.11)',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

    },


    menuRowPressed: {

      backgroundColor:
        'rgba(232,185,168,0.28)',

    },


    menuLeft: {

      flexDirection:
        'row',

      alignItems:
        'center',

      flexShrink:
        1,

    },


    menuTitle: {

      fontFamily:
        'MapseeFredokaMedium',

      color:
        '#332319',

    },


    menuRight: {

      flexDirection:
        'row',

      alignItems:
        'center',

      marginLeft:
        8,

    },


    menuValue: {

      fontFamily:
        'MapseeFredokaMedium',

      color:
        '#997352',

      flexShrink:
        1,

    },


    /* =====================================================
       CHARACTER MODAL
    ===================================================== */

    modalOverlay: {

      flex:
        1,

      backgroundColor:
        'rgba(40, 25, 15, 0.45)',

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal:
        28,

    },


    characterModal: {

      width:
        '100%',

      maxWidth:
        360,

      backgroundColor:
        '#FFF2D5',

      borderWidth:
        3,

      borderColor:
        '#B77B47',

      borderRadius:
        20,

      paddingHorizontal:
        20,

      paddingTop:
        22,

      paddingBottom:
        16,

      alignItems:
        'center',

    },


    modalTitle: {

      fontSize:
        20,

      fontFamily:
        'MapseeFredokaBold',

      color:
        '#3C291C',

      textAlign:
        'center',

    },


    modalSubtitle: {

      marginTop:
        5,

      fontSize:
        11,

      fontFamily:
        'MapseeFredokaMedium',

      color:
        '#8A6648',

      textAlign:
        'center',

    },


    characterOptions: {

      width:
        '100%',

      marginTop:
        18,

      flexDirection:
        'row',

      gap:
        12,

    },


    characterOption: {

      flex:
        1,

      minHeight:
        185,

      paddingTop:
        12,

      paddingBottom:
        10,

      borderWidth:
        2,

      borderColor:
        '#D5AF7E',

      borderRadius:
        14,

      backgroundColor:
        '#F8DCB3',

      alignItems:
        'center',

      justifyContent:
        'flex-start',

      overflow:
        'hidden',

    },


    characterOptionSelected: {

      borderColor:
        '#C86470',

      backgroundColor:
        '#F7D0C6',

    },


    /* 실제 캐릭터가 들어가는 영역 */

    characterPreviewArea: {

      width:
        '100%',

      height:
        125,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal:
        4,

    },


    characterPreview: {

      width:
        '100%',

      height:
        '100%',

    },


    characterPreviewMale: {

      width:
        '100%',

      height:
        '100%',

      transform: [
        {
          translateY:
            6,
        },
      ],

    },


    characterOptionTitle: {

      marginTop:
        2,

      fontSize:
        13,

      fontFamily:
        'MapseeFredokaBold',

      color:
        '#4C3221',

    },


    characterOptionTitleMale: {

      transform: [
        {
          translateY:
            8,
        },
      ],

    },


    checkArea: {

      height:
        22,

      marginTop:
        4,

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    confirmButton: {

      width:
        '100%',

      marginTop:
        18,

      paddingVertical:
        12,

      borderRadius:
        11,

      backgroundColor:
        '#DD7C7D',

      borderWidth:
        2,

      borderColor:
        '#A95052',

      alignItems:
        'center',

    },


    confirmButtonText: {

      color:
        '#FFF9EC',

      fontSize:
        14,

      fontFamily:
        'MapseeFredokaBold',

    },


    cancelButton: {

      marginTop:
        7,

      paddingHorizontal:
        18,

      paddingVertical:
        7,

    },


    cancelButtonText: {

      fontSize:
        11,

      fontFamily:
        'MapseeFredokaMedium',

      color:
        '#7F6048',

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