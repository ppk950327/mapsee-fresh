import {
    useEffect,
    useMemo,
    useRef,
} from 'react';

import {
    Animated,
    Image,
    ImageSourcePropType,
    PanResponder,
    StyleSheet,
} from 'react-native';

import type {
    RoomItemPlacement,
} from '../../context/CollectionContext';


type RoomDecorationItemProps = {
  placement: RoomItemPlacement;

  image: ImageSourcePropType;

  canvasWidth: number;

  canvasHeight: number;

  editable: boolean;

  selected: boolean;

  onSelect: (
    itemId: string
  ) => void;

  onMoveEnd: (
    placement: RoomItemPlacement
  ) => void;
};


const clamp = (
  value: number,
  min: number,
  max: number
) => {

  return Math.max(
    min,
    Math.min(
      value,
      max
    )
  );

};


/* =========================================================
   DRAGGABLE ROOM ITEM
========================================================= */

export default function RoomDecorationItem({
  placement,
  image,
  canvasWidth,
  canvasHeight,
  editable,
  selected,
  onSelect,
  onMoveEnd,
}: RoomDecorationItemProps) {

  const drag =
    useRef(
      new Animated.ValueXY({
        x: 0,
        y: 0,
      })
    ).current;


  const baseSize =
    Math.min(
      canvasWidth * 0.23,
      98
    );


  const itemSize =
    baseSize *
    placement.scale;


  const left =
    placement.x *
      canvasWidth -
    itemSize /
      2;


  const top =
    placement.y *
      canvasHeight -
    itemSize /
      2;


  useEffect(
    () => {

      drag.setValue({
        x: 0,
        y: 0,
      });

    },
    [
      drag,
      placement.x,
      placement.y,
      placement.scale,
      canvasWidth,
      canvasHeight,
    ]
  );


  const panResponder =
    useMemo(
      () =>
        PanResponder.create({

          onStartShouldSetPanResponder:
            () =>
              editable,

          onMoveShouldSetPanResponder:
            () =>
              editable,


          onPanResponderGrant:
            () => {

              if (
                editable
              ) {

                onSelect(
                  placement.itemId
                );

              }

            },


          onPanResponderMove:
            (
              _event,
              gesture
            ) => {

              if (
                !editable
              ) {
                return;
              }


              drag.setValue({

                x:
                  gesture.dx,

                y:
                  gesture.dy,

              });

            },


          onPanResponderRelease:
            (
              _event,
              gesture
            ) => {

              if (
                !editable
                ||
                canvasWidth <= 0
                ||
                canvasHeight <= 0
              ) {

                drag.setValue({
                  x: 0,
                  y: 0,
                });

                return;
              }


              const centerX =
                clamp(
                  placement.x *
                    canvasWidth +
                    gesture.dx,
                  canvasWidth *
                    0.06,
                  canvasWidth *
                    0.94
                );


              const centerY =
                clamp(
                  placement.y *
                    canvasHeight +
                    gesture.dy,
                  canvasHeight *
                    0.10,
                  canvasHeight *
                    0.82
                );


              drag.setValue({
                x: 0,
                y: 0,
              });


              onMoveEnd({

                ...placement,

                x:
                  centerX /
                  canvasWidth,

                y:
                  centerY /
                  canvasHeight,

              });

            },


          onPanResponderTerminate:
            () => {

              drag.setValue({
                x: 0,
                y: 0,
              });

            },

        }),
      [
        canvasHeight,
        canvasWidth,
        drag,
        editable,
        onMoveEnd,
        onSelect,
        placement,
      ]
    );


  return (

    <Animated.View
      {...panResponder.panHandlers}

      pointerEvents={
        editable
          ? 'auto'
          : 'none'
      }

      style={[
        styles.itemWrap,

        {
          width:
            itemSize,

          height:
            itemSize,

          left,

          top,

          zIndex:
            selected
              ? 24
              : 12,

          transform: [
            {
              translateX:
                drag.x,
            },
            {
              translateY:
                drag.y,
            },
          ],
        },

        selected
        &&
        styles.itemSelected,
      ]}
    >

      <Image
        source={
          image
        }

        resizeMode="contain"

        style={
          styles.itemImage
        }
      />

    </Animated.View>

  );

}


/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({

    itemWrap: {

      position:
        'absolute',

      alignItems:
        'center',

      justifyContent:
        'center',

      borderRadius:
        12,

    },


    itemSelected: {

      borderWidth:
        2,

      borderColor:
        '#E4777D',

      backgroundColor:
        'rgba(255, 246, 226, 0.28)',

    },


    itemImage: {

      width:
        '100%',

      height:
        '100%',

    },

  });
