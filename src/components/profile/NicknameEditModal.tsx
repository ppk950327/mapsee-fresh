import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


/* =========================================================
   STORAGE KEY
========================================================= */

export const PROFILE_NICKNAME_STORAGE_KEY =
  'mapsee-profile-nickname';


/* =========================================================
   PROPS
========================================================= */

type NicknameEditModalProps = {

  visible:
    boolean;

  nickname:
    string;

  tempNickname:
    string;

  onChangeNickname:
    (
      value: string
    ) => void;

  onClose:
    () => void;

  onSaved:
    (
      nickname: string
    ) => void;

};


/* =========================================================
   NICKNAME EDIT MODAL
========================================================= */

export default function NicknameEditModal({

  visible,
  nickname,
  tempNickname,
  onChangeNickname,
  onClose,
  onSaved,

}: NicknameEditModalProps) {


  /* =======================================================
     SAVE NICKNAME
  ======================================================= */

  const saveNickname =
    async () => {

      const trimmedNickname =
        tempNickname
          .trim();


      /*
        아무것도 입력하지 않았으면
        기존 이름 유지
      */

      const nextNickname =
        trimmedNickname.length > 0
          ? trimmedNickname
          : nickname;


      try {

        await AsyncStorage.setItem(
          PROFILE_NICKNAME_STORAGE_KEY,
          nextNickname
        );


        onSaved(
          nextNickname
        );

      } catch (
        error
      ) {

        console.log(
          'Nickname save error:',
          error
        );


        /*
          저장에 실패해도
          현재 실행 중인 앱에서는
          변경된 이름을 사용
        */

        onSaved(
          nextNickname
        );

      }

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

        <View
          style={
            styles.modalContainer
          }
        >


          {/* =================================================
              TITLE
          ================================================= */}

          <Text
            style={
              styles.title
            }
          >
            Edit Your Name
          </Text>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <Text
            style={
              styles.description
            }
          >
            Choose the name you want to use on MAPSEE.
          </Text>


          {/* =================================================
              INPUT
          ================================================= */}

          <TextInput
            value={
              tempNickname
            }

            onChangeText={
              onChangeNickname
            }

            maxLength={
              18
            }

            autoFocus

            autoCorrect={
              false
            }

            returnKeyType="done"

            onSubmitEditing={
              saveNickname
            }

            placeholder="Traveler"

            placeholderTextColor="#B08A68"

            style={
              styles.input
            }
          />


          {/* =================================================
              CHARACTER COUNT
          ================================================= */}

          <Text
            style={
              styles.characterCount
            }
          >
            {
              tempNickname.length
            }
            /18
          </Text>


          {/* =================================================
              SAVE
          ================================================= */}

          <Pressable
            style={({ pressed }) => [

              styles.confirmButton,

              pressed &&
                styles.buttonPressed,

            ]}

            onPress={
              saveNickname
            }
          >

            <Text
              style={
                styles.confirmText
              }
            >
              Save
            </Text>

          </Pressable>


          {/* =================================================
              CANCEL
          ================================================= */}

          <Pressable
            style={({ pressed }) => [

              styles.cancelButton,

              pressed &&
                styles.buttonPressed,

            ]}

            onPress={
              onClose
            }
          >

            <Text
              style={
                styles.cancelText
              }
            >
              Cancel
            </Text>

          </Pressable>


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
        'rgba(40, 25, 15, 0.48)',

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal:
        28,

    },


    /* =====================================================
       MODAL
    ===================================================== */

    modalContainer: {

      width:
        '100%',

      maxWidth:
        340,

      backgroundColor:
        '#FFF2D5',

      borderWidth:
        3,

      borderColor:
        '#B77B47',

      borderRadius:
        20,

      paddingHorizontal:
        22,

      paddingTop:
        24,

      paddingBottom:
        18,

      alignItems:
        'center',

    },


    /* =====================================================
       TITLE
    ===================================================== */

    title: {

      color:
        '#3C291C',

      fontSize:
        21,

      lineHeight:
        26,

      fontFamily:
        'MapseeFredokaBold',

      textAlign:
        'center',

    },


    /* =====================================================
       DESCRIPTION
    ===================================================== */

    description: {

      width:
        '100%',

      marginTop:
        6,

      color:
        '#8A6648',

      fontSize:
        11,

      lineHeight:
        15,

      fontFamily:
        'MapseeFredokaMedium',

      textAlign:
        'center',

    },


    /* =====================================================
       INPUT
    ===================================================== */

    input: {

      width:
        '100%',

      height:
        48,

      marginTop:
        20,

      paddingHorizontal:
        14,

      borderWidth:
        2,

      borderColor:
        '#D5A778',

      borderRadius:
        12,

      backgroundColor:
        '#FFF9EA',

      color:
        '#3B281A',

      fontSize:
        16,

      fontFamily:
        'MapseeFredokaMedium',

      textAlign:
        'center',

    },


    /* =====================================================
       CHARACTER COUNT
    ===================================================== */

    characterCount: {

      width:
        '100%',

      marginTop:
        5,

      color:
        '#A78363',

      fontSize:
        9.5,

      fontFamily:
        'MapseeFredokaMedium',

      textAlign:
        'right',

    },


    /* =====================================================
       SAVE BUTTON
    ===================================================== */

    confirmButton: {

      width:
        '100%',

      marginTop:
        17,

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

      justifyContent:
        'center',

    },


    confirmText: {

      color:
        '#FFF9EC',

      fontSize:
        14,

      fontFamily:
        'MapseeFredokaBold',

    },


    /* =====================================================
       CANCEL
    ===================================================== */

    cancelButton: {

      marginTop:
        7,

      paddingHorizontal:
        18,

      paddingVertical:
        7,

    },


    cancelText: {

      color:
        '#7F6048',

      fontSize:
        11,

      fontFamily:
        'MapseeFredokaMedium',

    },


    buttonPressed: {

      opacity:
        0.75,

    },


  });