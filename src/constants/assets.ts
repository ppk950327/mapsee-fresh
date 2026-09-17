import {
  ImageSourcePropType,
} from 'react-native';


/* =========================================================
   ROOM BACKGROUNDS
========================================================= */

export const ROOM_BACKGROUNDS: {
  hanok: ImageSourcePropType;
} = {

  hanok:
    require(
      '../../assets/images/hanok-room-background.png'
    ),

};


/* =========================================================
   CHARACTERS

   HomeScreen에서
   CHARACTERS.female
   CHARACTERS.male
   형태로 사용
========================================================= */

export const CHARACTERS: {
  female: ImageSourcePropType;
  male: ImageSourcePropType;
} = {

  female:
    require(
      '../../assets/images/character-female.png'
    ),

  male:
    require(
      '../../assets/images/character-male.png'
    ),

};


/* =========================================================
   TAB ICONS
========================================================= */

export const TAB_ICONS: {
  home: ImageSourcePropType;
  map: ImageSourcePropType;
  collection: ImageSourcePropType;
  profile: ImageSourcePropType;
} = {

  home:
    require(
      '../../assets/images/tabIcons/home.png'
    ),

  map:
    require(
      '../../assets/images/tabIcons/map.png'
    ),

  collection:
    require(
      '../../assets/images/tabIcons/collection.png'
    ),

  profile:
    require(
      '../../assets/images/tabIcons/profile.png'
    ),

};