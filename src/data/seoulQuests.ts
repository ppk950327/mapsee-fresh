import {
  ImageSourcePropType,
} from 'react-native';


/* =========================================================
   QUIZ TYPE
========================================================= */

export type QuestQuiz = {

  question:
    string;

  answers:
    string[];

  /*
    화면 번호와 코드 index는 다름.

    화면 1번 → index 0
    화면 2번 → index 1
    화면 3번 → index 2
    화면 4번 → index 3
  */
  correctIndex:
    number;

  funFact:
    string;

};


/* =========================================================
   SEOUL QUEST TYPE
========================================================= */

export type SeoulQuest = {

  id:
    string;

  district:
    string;

  title:
    string;


  /*
    Position on the Seoul map

    x:
    0 = far left
    1 = far right

    y:
    0 = top
    1 = bottom
  */

  x:
    number;

  y:
    number;


  progress:
    number;

  total:
    number;


  itemImage:
    ImageSourcePropType;


  type:
    'normal' | 'special';


  /*
    Quiz data
  */

  quiz:
    QuestQuiz;

};


/* =========================================================
   SEOUL QUESTS
========================================================= */

export const SEOUL_QUESTS:
  SeoulQuest[] = [


  /* =======================================================
     1. SEONGBUK-GU
     EXISTING
  ======================================================= */

  {

    id:
      'seongbuk',

    district:
      'Seongbuk-gu',

    title:
      'Celadon Prunus Vase with Inlaid Cloud and Crane Design',


    x:
      0.67,

    y:
      0.20,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/celadon-vase.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What are the main designs on this Goryeo celadon?',


      answers: [

        'Tigers and mountains',

        'Clouds and cranes',

        'Dragons and fire',

        'Flowers and butterflies',

      ],


      correctIndex:
        1,


      funFact:
        'Clouds and cranes were symbols of long life and good fortune.',

    },

  },


  /* =======================================================
     2. JONGNO-GU
     EXISTING
  ======================================================= */

  {

    id:
      'jongno',

    district:
      'Jongno-gu',

    title:
      'Ten-story Stone Pagoda at Wongaksa Temple Site',


    x:
      0.48,

    y:
      0.29,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/wongak-pagoda.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What makes this pagoda special?',


      answers: [

        'It is made of wood.',

        'It is made of marble and has 10 stories.',

        "It is Seoul's oldest watchtower.",

        'It was once a royal palace.',

      ],


      correctIndex:
        1,


      funFact:
        'This beautiful marble pagoda was built during the Joseon Dynasty.',

    },

  },


  /* =======================================================
     3. JUNG-GU
     EXISTING
  ======================================================= */

  {

    id:
      'jung',

    district:
      'Jung-gu',

    title:
      'Sungnyemun Gate',


    x:
      0.54,

    y:
      0.40,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/sungnyemun.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What was Sungnyemun used for in old Seoul?',


      answers: [

        'A royal palace',

        'The main southern gate of the city',

        'A traditional market',

        'A Buddhist temple',

      ],


      correctIndex:
        1,


      funFact:
        'Sungnyemun is also called Namdaemun, which means "South Gate."',


    },

  },


  /* =======================================================
     4. YONGSAN-GU
     EXISTING / SPECIAL
  ======================================================= */

  {

    id:
      'yongsan-museum',

    district:
      'Yongsan-gu',

    title:
      'Gold Crown Ornament from Hwangnamdaechong Tomb',


    x:
      0.48,

    y:
      0.53,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/gold-ornament.png'
      ),


    type:
      'special',


    quiz: {

      question:
        'Which ancient Korean kingdom made these gold ornaments?',


      answers: [

        'Silla',

        'Joseon',

        'Goryeo',

        'Goguryeo',

      ],


      correctIndex:
        0,


      funFact:
        'Silla is famous for its beautiful gold crowns and jewelry.',

    },

  },


  /* =======================================================
     5. SEODAEMUN-GU
     EXISTING
  ======================================================= */

  {

    id:
      'seodaemun',

    district:
      'Seodaemun-gu',

    title:
      'Dongnimmun Gate',


    x:
      0.28,

    y:
      0.32,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/dongnimmun.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What does Independence Gate symbolize?',


      answers: [

        "Korea's independence",

        'The entrance to a royal palace',

        'Victory in an ancient war',

        'The beginning of Seoul',

      ],


      correctIndex:
        0,


      funFact:
        "Independence Gate was built in the late 1800s as a symbol of Korea's independence and sovereignty.",

    },

  },


  /* =======================================================
     6. GWANAK-GU
     EXISTING
  ======================================================= */

  {

    id:
      'gwanak',

    district:
      'Gwanak-gu',

    title:
      'Gilt-bronze Seated Mahasthamaprapta Bodhisattva',


    x:
      0.31,

    y:
      0.78,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/bodhisattva.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What material was mainly used to make this statue?',


      answers: [

        'Wood',

        'Stone',

        'Gilt-bronze',

        'Glass',

      ],


      correctIndex:
        2,


      funFact:
        '"Gilt-bronze" means bronze covered with a thin layer of gold.',

    },

  },


  /* =======================================================
     7. SEOCHO-GU
     EXISTING
  ======================================================= */

  {

    id:
      'seocho',

    district:
      'Seocho-gu',

    title:
      'Bronze Bell with Inscription of Daehyewon',


    x:
      0.68,

    y:
      0.74,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/daehyewon-bell.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What kind of object is this?',


      answers: [

        'A crown',

        'A Buddhist bronze bell',

        'A royal mirror',

        'A traditional drum',

      ],


      correctIndex:
        1,


      funFact:
        'The writing on the bell helps us learn when and why it was made.',

    },

  },


  /* =======================================================
     8. JONGNO-GU
     GYEONGBOKGUNG GEUNJEONGJEON
     NEW
  ======================================================= */

  {

    id:
      'jongno-geunjeongjeon',

    district:
      'Jongno-gu',

    title:
      'Gyeongbokgung Geunjeongjeon',


    x:
      0.43,

    y:
      0.23,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/geunjeongjeon-hall.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What was Geunjeongjeon used for?',


      answers: [

        'Official state ceremonies',

        'Sleeping quarters',

        'Cooking royal meals',

        'Studying for exams',

      ],


      correctIndex:
        0,


      funFact:
        'Geunjeongjeon is the largest single-story wooden building in Korea where major state ceremonies took place.',

    },

  },


  /* =======================================================
     9. YONGSAN-GU
     PENSIVE BODHISATTVA NO. 78
     NEW
  ======================================================= */

  {

    id:
      'yongsan-pensive-78',

    district:
      'Yongsan-gu',

    title:
      'Gilt-bronze Maitreya Bodhisattva Half-Pensive Statue, No. 78',


    x:
      0.43,

    y:
      0.49,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/pensive-bodhisattva-1.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What is unique about National Treasure No. 78?',


      answers: [

        'Heavy iron armor',

        'A sharp crown and smooth lines',

        'A dragon-engraved gold crown',

        'A hunting bow and arrows',

      ],


      correctIndex:
        1,


      funFact:
        'It features a striking, unique crown and wonderfully refined drapery lines from the late 6th century.',

    },

  },


  /* =======================================================
     10. YONGSAN-GU
     PENSIVE BODHISATTVA NO. 83
     NEW
  ======================================================= */

  {

    id:
      'yongsan-pensive-83',

    district:
      'Yongsan-gu',

    title:
      'Gilt-bronze Maitreya Bodhisattva Half-Pensive Statue, No. 83',


    x:
      0.55,

    y:
      0.50,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/pensive-bodhisattva-2.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What is famous about National Treasure No. 83?',


      answers: [

        'A scary, roaring face',

        'A fierce animal mask',

        'A flower wreath',

        'A gentle, mysterious smile',

      ],


      correctIndex:
        3,


      funFact:
        'It is world-famous for its simple cap-like crown and wonderfully subtle, serene smile.',

    },

  },


  /* =======================================================
     11. JONGNO-GU
     IMPERIAL SEAL OF EMPEROR GOJONG
     NEW
  ======================================================= */

  {

    id:
      'jongno-gojong-seal',

    district:
      'Jongno-gu',

    title:
      'Imperial Seal of Emperor Gojong',


    x:
      0.55,

    y:
      0.27,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/emperor-gojong-imperial-seal.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        "What does Gojong's imperial seal symbolize?",


      answers: [

        "A child's toy",

        'Commercial shopping vouchers',

        'The sovereign power of the Korean Empire',

        'A theater ticket',

      ],


      correctIndex:
        2,


      funFact:
        'This seal represents the independent imperial power and proud sovereignty proclaimed by the Korean Empire.',

    },

  },


  /* =======================================================
     12. GANGNAM-GU
     WHITE PORCELAIN FLAT BOTTLE
     NEW
  ======================================================= */

  {

    id:
      'gangnam-white-porcelain',

    district:
      'Gangnam-gu',

    title:
      'White Porcelain Flat Bottle with Inlaid Peony Leaf Design',


    x:
      0.69,

    y:
      0.59,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/white-porcelain-peony-bottle.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What technique is used on this white porcelain?',


      answers: [

        'Goryeo-style inlay',

        'Oil painting',

        'Brick carving',

        'Fabric weaving',

      ],


      correctIndex:
        0,


      funFact:
        'This rare piece beautifully combines traditional Goryeo inlay techniques with Joseon white porcelain.',

    },

  },


  /* =======================================================
     13. DONGJAK-GU
     TERRESTRIAL GLOBE
     NEW
  ======================================================= */

  {

    id:
      'dongjak-globe',

    district:
      'Dongjak-gu',

    title:
      'Terrestrial Globe',


    x:
      0.43,

    y:
      0.68,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/terrestrial-globe.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What does a historical globe represent?',


      answers: [

        'The Earth and geographical worldview',

        'A fortress blueprint',

        'A ship navigation sail',

        'A fortune-telling chart',

      ],


      correctIndex:
        0,


      funFact:
        'Historical globes show how people in the past understood and visualized the spherical Earth and global geography!',

    },

  },


  /* =======================================================
     14. MAPO-GU
     BLUE-AND-WHITE PORCELAIN JAR
     NEW
  ======================================================= */

  {

    id:
      'mapo-dragon-jar',

    district:
      'Mapo-gu',

    title:
      'Blue-and-White Porcelain Jar with Cloud and Dragon Design',


    x:
      0.25,

    y:
      0.43,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/blue-white-dragon-jar.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What do dragons and clouds symbolize in traditional Korean art?',


      answers: [

        'Dangerous storms',

        'Royal authority and good fortune',

        'Crop failure',

        'Autumn leaves',

      ],


      correctIndex:
        1,


      funFact:
        'The dragon paired with clouds was a supreme symbol of royal authority and good fortune in court art!',

    },

  },


  /* =======================================================
     15. SEODAEMUN-GU
     CELADON OPENWORK RING-DESIGN STOOL
     NEW
  ======================================================= */

  {

    id:
      'seodaemun-celadon-stool',

    district:
      'Seodaemun-gu',

    title:
      'Celadon Openwork Ring-Design Stool',


    x:
      0.32,

    y:
      0.39,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/bronze-openwork-chair.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What makes this celadon stool special?',


      answers: [

        'A heavy log construction',

        'A portable folding design',

        'Delicate openwork carved patterns',

        'A soft sleeping cushion',

      ],


      correctIndex:
        2,


      funFact:
        'This piece showcases the peak of Goryeo craftsmanship with its delicate cut-out designs!',

    },

  },


  /* =======================================================
     16. SEONGBUK-GU
     MITASA CHAEKGEORI
     NEW
  ======================================================= */

  {

    id:
      'seongbuk-chaekgeori',

    district:
      'Seongbuk-gu',

    title:
      'Chaekgeori Folding Screen at Mitasa Temple',


    x:
      0.61,

    y:
      0.17,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/mitasa-chaekgeori-screen.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        "What does a 'Chaekgeori' painting depict?",


      answers: [

        'Royal clothing',

        'Foreign maps',

        'Military weapons',

        'Books and scholarly objects',

      ],


      correctIndex:
        3,


      funFact:
        'Chaekgeori reflects the passionate scholar culture and deep love for learning during the Joseon Dynasty!',

    },

  },


  /* =======================================================
     17. DONGDAEMUN-GU
     KING SEJONG'S STELE AT YEONGNEUNG
     NEW
  ======================================================= */

  {

    id:
      'dongdaemun-sejong-stele',

    district:
      'Dongdaemun-gu',

    title:
      "King Sejong's Stele at Yeongneung",


    x:
      0.62,

    y:
      0.33,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/sejong-yeongneung-stele.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What does this stone monument tell us about?',


      answers: [

        'The life and achievements of King Sejong',

        'A famous Korean general',

        'An old Seoul market',

        'A traditional Korean game',

      ],


      correctIndex:
        0,


      funFact:
        'King Sejong is best known for creating Hangeul, the Korean alphabet!',

    },

  },


  /* =======================================================
     18. GANGSEO-GU
     STANDING STONE BUDDHA OF MITA-SA
     NEW
  ======================================================= */

  {

    id:
      'gangseo-mitasa-buddha',

    district:
      'Gangseo-gu',

    title:
      'Standing Stone Buddha of Mita-sa',


    x:
      0.17,

    y:
      0.47,


    progress:
      0,

    total:
      1,


    itemImage:
      require(
        '../../assets/images/items/mitasa-standing-stone-buddha.png'
      ),


    type:
      'normal',


    quiz: {

      question:
        'What is this cultural heritage?',


      answers: [

        'A stone Buddha statue',

        'A royal tomb',

        'A giant bell',

        'A stone lantern',

      ],


      correctIndex:
        0,


      funFact:
        'Stone Buddha statues like this show the long history of Buddhism in Korea.',

    },

  },

];
