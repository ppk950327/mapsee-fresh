import {
  router,
  type Href,
} from 'expo-router';

import React from 'react';

import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  TAB_ICONS,
} from '../../constants/assets';

import {
  colors,
} from '../../theme';


export type TabKey =
  'home' |
  'map' |
  'collection' |
  'profile';


type TabItem = {

  key:
    TabKey;

  label:
    string;

  icon:
    ImageSourcePropType;

};


const TABS:
  TabItem[] = [

    {
      key:
        'home',

      label:
        'Home',

      icon:
        TAB_ICONS.home,
    },

    {
      key:
        'map',

      label:
        'Map',

      icon:
        TAB_ICONS.map,
    },

    {
      key:
        'collection',

      label:
        'Collection',

      icon:
        TAB_ICONS.collection,
    },

    {
      key:
        'profile',

      label:
        'Profile',

      icon:
        TAB_ICONS.profile,
    },

  ];


type BottomNavigationProps = {

  activeTab?:
    TabKey;

  onTabPress?:
    (
      key: TabKey
    ) => void;

};


/* =========================================================
   BOTTOM NAVIGATION
========================================================= */

export default function BottomNavigation({

  activeTab =
    'home',

  onTabPress,

}: BottomNavigationProps) {

  return (

    <View
      style={
        styles.container
      }
    >

      {
        TABS.map(
          (
            tab,
            index
          ) => {

            const isActive =
              tab.key ===
              activeTab;


            return (

              <React.Fragment
                key={
                  tab.key
                }
              >

                {
                  index > 0
                  &&
                  (
                    <View
                      style={
                        styles.divider
                      }
                    />
                  )
                }


                <Pressable

                  style={({
                    pressed,
                  }) => [

                    styles.tab,

                    pressed
                    &&
                    styles.pressed,

                  ]}

                  onPress={() => {

                    if (
                      tab.key ===
                      'home'
                    ) {

                      router.push(
                        '/'
                      );

                    } else if (
                      tab.key ===
                      'map'
                    ) {

                      router.push(
                        '/map' as Href
                      );

                    } else if (
                      tab.key ===
                      'collection'
                    ) {

                      router.push(
                        '/collection' as Href
                      );

                    } else if (
                      tab.key ===
                      'profile'
                    ) {

                      router.push(
                        '/profile'
                      );

                    }


                    onTabPress?.(
                      tab.key
                    );

                  }}
                >


                  <Image

                    source={
                      tab.icon
                    }

                    style={
                      styles.icon
                    }

                    resizeMode="contain"

                  />


                  <Text

                    numberOfLines={
                      1
                    }

                    style={[

                      styles.label,

                      isActive
                      &&
                      styles.labelActive,

                    ]}
                  >

                    {
                      tab.label
                    }

                  </Text>


                </Pressable>


              </React.Fragment>

            );

          }
        )
      }

    </View>

  );

}


/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({


    container: {

      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        colors.cream,

      borderRadius:
        12,

      borderWidth:
        2,

      borderColor:
        colors.creamBorder,

      paddingVertical:
        2,

      paddingHorizontal:
        4,

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


    tab: {

      flex:
        1,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingVertical:
        0,

    },


    pressed: {

      opacity:
        0.7,

    },


    icon: {

      width:
        30,

      height:
        30,

      marginBottom:
        1,

    },


    divider: {

      width:
        1,

      height:
        32,

      backgroundColor:
        colors.divider,

    },


    /* =====================================================
       TAB LABEL
       Fredoka Medium
    ===================================================== */

    label: {

      fontSize:
        11,

      fontFamily:
        'MapseeFredokaMedium',

      color:
        colors.textDark,

      textAlign:
        'center',

    },


    /* =====================================================
       ACTIVE TAB LABEL

       굵기는 그대로 Medium 유지
       → 아이콘/점이 이미 active 상태를 보여줌
    ===================================================== */

    labelActive: {

      fontFamily:
        'MapseeFredokaMedium',

      color:
        colors.textDark,

    },


  });