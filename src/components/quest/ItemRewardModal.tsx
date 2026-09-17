import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';


type ItemRewardModalProps = {
  visible: boolean;
  itemImage: ImageSourcePropType;
  itemName: string;
  funFact: string;
  compactOk?: boolean;
  onOk: () => void;
};


const ITEM_REWARD_BG =
  require(
    '../../../assets/images/quest/item-reward-bg.png'
  );

const REWARD_OK_BUTTON =
  require(
    '../../../assets/images/quest/reward-ok-button.png'
  );


export default function ItemRewardModal({
  visible,
  itemImage,
  itemName,
  funFact,
  compactOk = false,
  onOk,
}: ItemRewardModalProps) {

  return (

    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onOk}
    >

      <View style={styles.overlay}>

        <View style={styles.rewardContainer}>

          <ImageBackground
            source={ITEM_REWARD_BG}
            style={styles.rewardBackground}
            resizeMode="contain"
          >

            <View style={styles.rewardContent}>

              <Text style={styles.rewardTitle}>
                Item Acquired!
              </Text>


              <View style={styles.itemArea}>

                <Image
                  source={itemImage}
                  style={styles.itemImage}
                  resizeMode="contain"
                />

              </View>


              <Text
                style={styles.itemName}
                numberOfLines={3}
                adjustsFontSizeToFit
                minimumFontScale={0.84}
              >
                {itemName}
              </Text>


              <View style={styles.funFactArea}>

                <Text style={styles.funFactLabel}>
                  💡 Fun Fact
                </Text>

                <Text
                  style={styles.funFactText}
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  minimumFontScale={0.80}
                >
                  {funFact}
                </Text>

              </View>


              <Pressable
                style={[
                  styles.okPressable,
                  compactOk &&
                    styles.okPressableCompact,
                ]}
                onPress={onOk}
              >

                <ImageBackground
                  source={REWARD_OK_BUTTON}
                  style={styles.okBackground}
                  resizeMode="contain"
                >

                  <Text style={styles.okText}>
                    OK
                  </Text>

                </ImageBackground>

              </Pressable>


            </View>

          </ImageBackground>

        </View>

      </View>

    </Modal>

  );

}


const styles =
  StyleSheet.create({

    overlay: {
      flex: 1,
      backgroundColor:
        'rgba(35, 22, 13, 0.48)',
      alignItems:
        'center',
      justifyContent:
        'center',
      paddingHorizontal:
        12,
    },


    rewardContainer: {
      width:
        '82%',
      maxWidth:
        350,
      aspectRatio:
        1037 / 1284,
    },


    rewardBackground: {
      width:
        '100%',
      height:
        '100%',
      position:
        'relative',
    },


    rewardContent: {
      position:
        'absolute',
      top:
        '17%',
      bottom:
        '6%',
      left:
        '13%',
      right:
        '13%',
      alignItems:
        'center',
    },


    rewardTitle: {
      color:
        '#A96A24',
      fontSize:
        22,
      lineHeight:
        26,
      fontFamily:
        'MapseePixelBold',
      textAlign:
        'center',
      marginBottom:
        8,
    },


    itemArea: {
      width:
        '100%',
      height:
        112,
      alignItems:
        'center',
      justifyContent:
        'center',
      marginBottom:
        8,
    },


    itemImage: {
      width:
        '84%',
      height:
        '84%',
    },


    itemName: {
      width:
        '100%',
      color:
        '#3B281A',
      fontSize:
        15,
      lineHeight:
        19,
      fontFamily:
        'MapseeFredokaBold',
      textAlign:
        'center',
      paddingHorizontal:
        4,
      marginTop:
        1,
    },


    funFactArea: {
      width:
        '90%',
      alignItems:
        'center',
      marginTop:
        10,
      marginBottom:
        14,
      paddingHorizontal:
        4,
    },


    funFactLabel: {
      color:
        '#9B6227',
      fontSize:
        11.5,
      lineHeight:
        15,
      fontFamily:
        'MapseeFredokaBold',
      textAlign:
        'center',
      marginBottom:
        4,
    },


    funFactText: {
      width:
        '100%',
      color:
        '#76583B',
      fontSize:
        10.5,
      lineHeight:
        14,
      fontFamily:
        'MapseeFredokaMedium',
      textAlign:
        'center',
    },


    okPressable: {
      width:
        '52%',
      aspectRatio:
        378 / 136,
      alignSelf:
        'center',
    },


    okPressableCompact: {
      width:
        '43%',
      transform: [
        {
          translateY:
            4,
        },
      ],
    },


    okBackground: {
      width:
        '100%',
      height:
        '100%',
      alignItems:
        'center',
      justifyContent:
        'center',
    },


    okText: {
      color:
        '#3D2C1E',
      fontSize:
        14,
      fontFamily:
        'MapseePixel',
      textAlign:
        'center',
    },

  });
