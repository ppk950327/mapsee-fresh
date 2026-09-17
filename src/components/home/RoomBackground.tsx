import React from 'react';

import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';

import {
  ROOM_BACKGROUNDS,
} from '../../constants/assets';


type RoomBackgroundProps = {
  source?: ImageSourcePropType;

  children?: React.ReactNode;

  /*
    기본 한옥방에서만 사용하던
    러그 + 낮은 상을 보여줄지 여부.

    안동 Background를 적용할 때는 false로 넘겨
    획득한 배경 자체가 온전히 보이도록 합니다.
  */
  showDefaultDecor?: boolean;
};


/* =========================================================
   ROOM DECOR ASSETS
========================================================= */

const ROOM_RUG =
  require(
    '../../../assets/images/hanok-room-rug.png'
  );

const LOW_TABLE =
  require(
    '../../../assets/images/hanok-low-table.png'
  );


/* =========================================================
   ROOM BACKGROUND
========================================================= */

export default function RoomBackground({
  source = ROOM_BACKGROUNDS.hanok,
  children,
  showDefaultDecor = true,
}: RoomBackgroundProps) {

  return (

    <ImageBackground
      source={
        source
      }

      resizeMode="stretch"

      style={
        styles.background
      }

      imageStyle={
        styles.backgroundImage
      }
    >


      {/* =================================================
          DEFAULT HANOK RUG

          안동에서 획득한 Background를 사용 중이면
          숨깁니다.
      ================================================= */}

      {
        showDefaultDecor
        &&
        (
          <View
            style={
              styles.rugLayer
            }

            pointerEvents="none"
          >

            <Image
              source={
                ROOM_RUG
              }

              style={
                styles.roomRug
              }

              resizeMode="contain"
            />

          </View>
        )
      }


      {/* =================================================
          HOME CONTENT

          ★ 캐릭터
          ★ 획득 아이템 장식
          ★ 상단 UI
          ★ 하단 Navigation
      ================================================= */}

      <View
        style={
          styles.contentLayer
        }
      >

        {
          children
        }

      </View>


      {/* =================================================
          DEFAULT HANOK TABLE

          안동 Background를 사용 중이면 숨깁니다.
      ================================================= */}

      {
        showDefaultDecor
        &&
        (
          <View
            style={
              styles.tableLayer
            }

            pointerEvents="none"
          >

            <Image
              source={
                LOW_TABLE
              }

              style={
                styles.lowTable
              }

              resizeMode="contain"
            />

          </View>
        )
      }


    </ImageBackground>

  );

}


/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({


    background: {

      flex:
        1,

      width:
        '100%',

      height:
        '100%',

      backgroundColor:
        '#7A431F',

      position:
        'relative',

    },


    backgroundImage: {

      width:
        '100%',

      height:
        '100%',

    },


    rugLayer: {

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
        2,

    },


    roomRug: {

      position:
        'absolute',

      left:
        '-5%',

      bottom:
        '1%',

      width:
        '110%',

      height:
        '50%',

      transform: [
        {
          scale:
            1.5,
        },
      ],

    },


    contentLayer: {

      flex:
        1,

      zIndex:
        5,

    },


    tableLayer: {

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

      /*
        캐릭터/꾸미기 아이템보다 뒤.
        기존에는 zIndex 8이라 캐릭터를 덮을 수 있었습니다.
      */
      zIndex:
        4,

    },


    lowTable: {

      position:
        'absolute',

      right:
        '-4%',

      bottom:
        '13%',

      width:
        '38%',

      height:
        '33%',

    },


  });
