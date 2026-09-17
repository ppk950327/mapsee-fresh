import {
    ImageSourcePropType,
} from 'react-native';


/* =========================================================
   QUIZ TYPE
========================================================= */

export type AndongQuestQuiz = {

  question:
    string;

  answers:
    string[];

  correctIndex:
    number;

  funFact:
    string;

};


/* =========================================================
   ITEM TYPE

   wearable = 캐릭터 착용 아이템
   decor    = 방 장식 아이템
========================================================= */

export type AndongItemType =
  'wearable' |
  'decor';



/* =========================================================
   ANDONG QUEST TYPE
========================================================= */

export type AndongQuest = {

  id:
    string;

  placeName:
    string;

  itemName:
    string;


  /* =======================================================
     MAIN ITEM TYPE
  ======================================================= */

  itemType?:
    AndongItemType;


  /* =======================================================
     BONUS ITEM

     ★ 하회마을에서만 사용
  ======================================================= */

  bonusItemName?:
    string;

  bonusItemImage?:
    ImageSourcePropType;

  bonusItemType?:
    AndongItemType;


  /* =======================================================
     MAP POSITION
  ======================================================= */

  x:
    number;

  y:
    number;


  progress:
    number;

  total:
    number;


  /* =======================================================
     MAIN ITEM IMAGE
  ======================================================= */

  itemImage:
    ImageSourcePropType;


  /* =======================================================
     BACKGROUND REWARD

     ★ 안동 퀘스트 완료 후
       아이템 보상 다음 단계에서 획득할 배경
  ======================================================= */

  backgroundName:
    string;

  backgroundImage:
    ImageSourcePropType;


  quiz:
    AndongQuestQuiz;

};



/* =========================================================
   ANDONG QUESTS
========================================================= */

export const ANDONG_QUESTS:
  AndongQuest[] = [


  /* =======================================================
     1. HAHOE VILLAGE

     MAIN
     → Hahoe Mask

     BONUS
     → Hahoe Mask Display

     BACKGROUND
     → Hahoe Village
  ======================================================= */

  {

    id:
      'hahoe',

    placeName:
      'Hahoe Village',


    itemName:
      'Hahoe Mask',

    itemType:
      'wearable',

    itemImage:
      require(
        '../../assets/images/items/hahoe-mask.png'
      ),


    bonusItemName:
      'Hahoe Mask Display',

    bonusItemType:
      'decor',

    bonusItemImage:
      require(
        '../../assets/images/items/hahoe-mask-display.png'
      ),


    x:
      0.29,

    y:
      0.63,


    progress:
      0,

    total:
      1,


    backgroundName:
      'Hahoe Village',

    backgroundImage:
      require(
        '../../assets/images/andong-backgrounds/hahoe-village.png'
      ),


    quiz: {

      question:
        'Which traditional performance is Hahoe Village famous for?',

      answers: [

        'Royal Court Music',

        'Hahoe Mask Dance Drama',

        'Pansori Singing',

        'Traditional Drum Parade',

      ],

      correctIndex:
        1,

      funFact:
        'Hahoe Byeolsingut Tallori is a famous mask dance tradition from Hahoe Village.',

    },

  },



  /* =======================================================
     2. HAKNAM HISTORIC HOUSE
  ======================================================= */

  {

    id:
      'haknam',

    placeName:
      'Haknam Historic House',

    itemName:
      'Brass Bowl',


    x:
      0.49,

    y:
      0.24,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/brass-bowl.png'
      ),


    backgroundName:
      'Haknam Historic House',

    backgroundImage:
      require(
        '../../assets/images/andong-backgrounds/haknam-historic-house.png'
      ),


    quiz: {

      question:
        'What historical role is linked to Haknam Historic House?',

      answers: [

        'A royal guesthouse',

        'A military training post',

        'A hiding place for independence activists',

        'A government office',

      ],

      correctIndex:
        2,

      funFact:
        'Its attic was used by independence activists, and the family preserved around 10,000 historic relics and records.',

    },

  },



  /* =======================================================
     3. YEKKI ART VILLAGE
  ======================================================= */

  {

    id:
      'yekki',

    placeName:
      'Yekki Art Village',

    itemName:
      'Biseokchigi Game Set',


    x:
      0.47,

    y:
      0.42,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/biseokchigi-game-set.png'
      ),


    backgroundName:
      'Yekki Art Village',

    backgroundImage:
      require(
        '../../assets/images/andong-backgrounds/yekki-village.png'
      ),


    quiz: {

      question:
        'What is Yekki Art Village best known for today?',

      answers: [

        'A large royal palace',

        'A traditional military camp',

        'A winter ski resort',

        'Colorful murals and sculptures',

      ],

      correctIndex:
        3,

      funFact:
        'Yekki Village sits by Andongho Lake and is known for colorful murals and sculptures throughout the village.',

    },

  },



  /* =======================================================
     4. WOLYEONGGYO BRIDGE
  ======================================================= */

  {

    id:
      'wolyeonggyo',

    placeName:
      'Wolyeonggyo Bridge',

    itemName:
      'Wolyeonggyo Night Mood Lamp',


    x:
      0.48,

    y:
      0.58,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/wolyeonggyo-night-mood-lamp.png'
      ),


    backgroundName:
      'Wolyeonggyo Bridge',

    backgroundImage:
      require(
        '../../assets/images/andong-backgrounds/wolyeonggyo-bridge.png'
      ),


    quiz: {

      question:
        'What inspired the design of Wolyeonggyo Bridge?',

      answers: [

        'Traditional hemp shoes called Mituri',

        'A Joseon royal crown',

        'A traditional Korean fan',

        'A wooden fishing boat',

      ],

      correctIndex:
        0,

      funFact:
        'The 387-meter wooden bridge was inspired by Mituri linked to the love story of Yi Eung-tae and his wife.',

    },

  },



  /* =======================================================
     5. DOSAN SEOWON
  ======================================================= */

  {

    id:
      'dosan',

    placeName:
      'Dosan Seowon',

    itemName:
      'Brush and Inkstone',


    x:
      0.64,

    y:
      0.27,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/brush-and-inkstone.png'
      ),


    backgroundName:
      'Dosan Seowon',

    backgroundImage:
      require(
        '../../assets/images/andong-backgrounds/dosan-seowon.png'
      ),


    quiz: {

      question:
        'Which Joseon scholar is closely associated with Dosan Seowon?',

      answers: [

        'Jeong Yak-yong',

        'Yi Hwang (Toegye)',

        'Yi I (Yulgok)',

        'Kim Jeong-ho',

      ],

      correctIndex:
        1,

      funFact:
        'Toegye Yi Hwang founded Dosan Seodang, and his portrait appears on Korea’s 1,000-won banknote.',

    },

  },



  /* =======================================================
     6. SEONSEONG SUSANG-GIL
  ======================================================= */

  {

    id:
      'seonseong',

    placeName:
      'Seonseong Susang-gil',

    itemName:
      'Sunset Water Globe',


    x:
      0.61,

    y:
      0.40,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/sunset-water-globe.png'
      ),


    backgroundName:
      'Seonseong Susang-gil',

    backgroundImage:
      require(
        '../../assets/images/andong-backgrounds/seonseong-floating-walkway.png'
      ),


    quiz: {

      question:
        'What makes Seonseong Susang-gil unique?',

      answers: [

        'It runs through an underground tunnel',

        'It follows a steep mountain ridge',

        'It is a floating walkway on the lake',

        'It is built along an old fortress wall',

      ],

      correctIndex:
        2,

      funFact:
        'The 1.1-kilometer floating walkway connects Yekki Village with a nearby recreation forest.',

    },

  },

];
