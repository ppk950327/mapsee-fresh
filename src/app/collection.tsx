import {
  ReactNode,
  useMemo,
  useState,
} from 'react';

import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LanguageButton from '../components/home/LanguageButton';
import NotificationButton from '../components/home/NotificationButton';
import BottomNavigation from '../components/navigation/BottomNavigation';

import { TAB_ICONS } from '../constants/assets';
import { useCollection } from '../context/CollectionContext';
import { ANDONG_QUESTS } from '../data/andongQuests';
import { SEOUL_QUESTS } from '../data/seoulQuests';

import {
  colors,
  IS_WEB,
  PHONE_MAX_WIDTH,
} from '../theme';

/* =========================================================
   COLLECTION ASSETS
   assets/images/collection/
========================================================= */

const COLLECTION_BACKGROUND =
  require('../../assets/images/collection/collection-background.png');

const COLLECTION_CARD_LOCKED_1 =
  require('../../assets/images/collection/collection-card-locked1.png');

const COLLECTION_CARD_LOCKED_2 =
  require('../../assets/images/collection/collection-card-locked2.png');

const COLLECTION_CARD_UNLOCKED_1 =
  require('../../assets/images/collection/collection-card-unlocked1.png');

const COLLECTION_CARD_UNLOCKED_2 =
  require('../../assets/images/collection/collection-card-unlocked2.png');

const COLLECTION_DISPLAY_SHELF =
  require('../../assets/images/collection/collection-display-shelf.png');

const HEADER_FRAME =
  require('../../assets/images/header-frame.png');

const COLLECTION_SORT_BUTTON =
  require('../../assets/images/collection/collection-sort-button.png');

const COLLECTION_TAB_SELECTED =
  require('../../assets/images/collection/collection-tab-selected1.png');

const COLLECTION_TAB_DEFAULT =
  require('../../assets/images/collection/collection-tab-default1.png');

/* =========================================================
   IMPORTANT

   Several supplied PNGs are NOT tightly cropped assets.
   They are large transparent canvases with the real UI piece
   positioned somewhere inside the canvas.

   Instead of stretching the whole canvas over the screen,
   we crop the visible part in code and then use normal layout.
   This is what keeps the Collection page aligned and responsive.
========================================================= */

type CropBox = {
  canvasWidth: number;
  canvasHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

const CROP = {
  tab: {
    canvasWidth: 940,
    canvasHeight: 1672,
    x: 93,
    y: 288,
    width: 376,
    height: 66,
  },

  shelf: {
    canvasWidth: 940,
    canvasHeight: 1672,
    x: 104,
    y: 380,
    width: 735,
    height: 481,
  },

  sort: {
    canvasWidth: 940,
    canvasHeight: 1672,
    x: 656,
    y: 887,
    width: 153,
    height: 46,
  },

  lockedSmall: {
    canvasWidth: 1254,
    canvasHeight: 1254,
    x: 130,
    y: 132,
    width: 995,
    height: 983,
  },

  unlockedSmall: {
    canvasWidth: 1254,
    canvasHeight: 1254,
    x: 158,
    y: 161,
    width: 938,
    height: 932,
  },

  lockedTall: {
    canvasWidth: 1024,
    canvasHeight: 1536,
    x: 79,
    y: 67,
    width: 866,
    height: 1390,
  },

  unlockedTall: {
    canvasWidth: 1024,
    canvasHeight: 1536,
    x: 130,
    y: 96,
    width: 762,
    height: 1342,
  },
} satisfies Record<string, CropBox>;

/* =========================================================
   CROPPED PNG COMPONENT

   This turns a full transparent-canvas PNG into a normal,
   tightly cropped UI component WITHOUT making new PNG files.
========================================================= */

type CroppedAssetProps = {
  source: ImageSourcePropType;
  crop: CropBox;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  stretch?: boolean;
};

function CroppedAsset({
  source,
  crop,
  style,
  children,
  stretch = false,
}: CroppedAssetProps) {
  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setLayout({
      width,
      height,
    });
  };

  const ready = layout.width > 0 && layout.height > 0;

  const scaleX = ready
    ? layout.width / crop.width
    : 0;

  const scaleY = ready
    ? layout.height / crop.height
    : 0;

  const imageScaleX = stretch
    ? scaleX
    : scaleX;

  const imageScaleY = stretch
    ? scaleY
    : scaleX;

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.croppedAssetRoot,
        !stretch && {
          aspectRatio: crop.width / crop.height,
        },
        style,
      ]}
    >
      {ready && (
        <Image
          source={source}
          resizeMode="stretch"
          style={{
            position: 'absolute',
            width: crop.canvasWidth * imageScaleX,
            height: crop.canvasHeight * imageScaleY,
            left: -crop.x * imageScaleX,
            top: -crop.y * imageScaleY,
          }}
        />
      )}

      {children}
    </View>
  );
}

/* =========================================================
   TYPES
========================================================= */

type CollectionTab = 'items' | 'backgrounds';
type SortMode = 'acquired' | 'default';

type CollectionItem = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  source: 'seoul' | 'andong';
};

type BackgroundItem = {
  id: string;
  name: string;
  image: ImageSourcePropType;
};

/* =========================================================
   DATA
========================================================= */

const SEOUL_COLLECTION_ITEMS: CollectionItem[] =
  SEOUL_QUESTS.map((quest) => ({
    id: `seoul-${quest.id}`,
    name: quest.title,
    image: quest.itemImage,
    source: 'seoul',
  }));

const ANDONG_MAIN_ITEMS: CollectionItem[] =
  ANDONG_QUESTS.map((quest) => ({
    id: `andong-${quest.id}`,
    name: quest.itemName,
    image: quest.itemImage,
    source: 'andong',
  }));

const ANDONG_BONUS_ITEMS: CollectionItem[] =
  ANDONG_QUESTS.flatMap((quest) => {
    if (!quest.bonusItemImage || !quest.bonusItemName) {
      return [];
    }

    return [
      {
        id: `andong-${quest.id}-bonus`,
        name: quest.bonusItemName,
        image: quest.bonusItemImage,
        source: 'andong' as const,
      },
    ];
  });

const ALL_COLLECTION_ITEMS: CollectionItem[] = [
  ...SEOUL_COLLECTION_ITEMS,
  ...ANDONG_MAIN_ITEMS,
  ...ANDONG_BONUS_ITEMS,
];

const ALL_BACKGROUND_ITEMS: BackgroundItem[] =
  ANDONG_QUESTS.map((quest) => ({
    id: `background-${quest.id}`,
    name: quest.backgroundName,
    image: quest.backgroundImage,
  }));

/* =========================================================
   SHELF POSITIONS
   Relative to the CROPPED shelf itself.
========================================================= */

const SHELF_POSITIONS = [
  { left: '13%', top: '10%' },
  { left: '41%', top: '10%' },
  { left: '69%', top: '10%' },
  { left: '13%', top: '56%' },
  { left: '41%', top: '56%' },
  { left: '69%', top: '56%' },
] as const;

/* =========================================================
   SMALL DECORATIVE COMPONENTS
========================================================= */

function PanelCorners() {
  return (
    <>
      <View style={[styles.panelCorner, styles.cornerTopLeft]} />
      <View style={[styles.panelCorner, styles.cornerTopRight]} />
      <View style={[styles.panelCorner, styles.cornerBottomLeft]} />
      <View style={[styles.panelCorner, styles.cornerBottomRight]} />
    </>
  );
}

function GridMiniIcon() {
  return (
    <View style={styles.gridMiniIcon}>
      <View style={styles.gridMiniSquare} />
      <View style={styles.gridMiniSquare} />
      <View style={styles.gridMiniSquare} />
      <View style={styles.gridMiniSquare} />
    </View>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function CollectionScreen() {
  const {
    acquiredItemIds,
    acquiredBackgroundIds,
    shelfItemIds,
    setShelfItems,
    selectedRoomBackgroundId,
    setRoomBackground,
  } = useCollection();

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const phoneWidth =
    IS_WEB
      ? Math.min(width, PHONE_MAX_WIDTH)
      : width;

  // Profile 헤더처럼 좌우 폭은 과하게 키우지 않고,
  // 세로 높이만 조금 더 통통하게 잡습니다.
  // 이렇게 하면 알림 / EN 버튼과 겹치지 않으면서
  // Profile 헤더와 비슷한 존재감이 납니다.
  const headerFrameWidth = Math.min(
    phoneWidth * 0.48,
    205
  );

  const headerFrameHeight = 58;

  const headerTopPadding =
    Math.max(insets.top, 10) + 8;

  const [activeTab, setActiveTab] =
    useState<CollectionTab>('items');

  const [sortMode, setSortMode] =
    useState<SortMode>('acquired');

  const [selectedItemIds, setSelectedItemIds] =
    useState<string[]>([]);

  /* =======================================================
     REAL UNLOCK STATE

     Map에서 보상으로 실제 저장된 itemId만 해금합니다.
     더 이상 "앞에서부터 N개"를 임시 해금하지 않습니다.
  ======================================================= */

  const unlockedItemIds = useMemo(
    () => new Set(acquiredItemIds),
    [acquiredItemIds]
  );

  const unlockedItems = useMemo(
    () =>
      ALL_COLLECTION_ITEMS.filter((item) =>
        unlockedItemIds.has(item.id)
      ),
    [unlockedItemIds]
  );

  const sortedItems = useMemo(() => {
    if (sortMode === 'default') {
      return ALL_COLLECTION_ITEMS;
    }

    return [
      ...ALL_COLLECTION_ITEMS.filter((item) =>
        unlockedItemIds.has(item.id)
      ),
      ...ALL_COLLECTION_ITEMS.filter((item) =>
        !unlockedItemIds.has(item.id)
      ),
    ];
  }, [sortMode, unlockedItemIds]);

  const shelfItems = shelfItemIds
    .map((id) =>
      ALL_COLLECTION_ITEMS.find((item) => item.id === id)
    )
    .filter(
      (item): item is CollectionItem =>
        item !== undefined &&
        unlockedItemIds.has(item.id)
    )
    .slice(0, 6);

  const unlockedBackgroundIds = useMemo(
    () => new Set(acquiredBackgroundIds),
    [acquiredBackgroundIds]
  );

  const toggleItemSelection = (item: CollectionItem) => {
    if (!unlockedItemIds.has(item.id)) {
      return;
    }

    setSelectedItemIds((current) => {
      if (current.includes(item.id)) {
        return current.filter((id) => id !== item.id);
      }

      if (current.length >= 6) {
        return current;
      }

      return [...current, item.id];
    });
  };

  const placeSelectedItems = () => {
    if (selectedItemIds.length === 0) {
      return;
    }

    setShelfItems(selectedItemIds.slice(0, 6));
  };

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.phoneFrame,
          { width: phoneWidth },
        ]}
      >
        <ImageBackground
          source={COLLECTION_BACKGROUND}
          resizeMode="cover"
          style={styles.background}
        >
          {/* =================================================
              HEADER

              Profile 화면과 같은 header-frame.png를 재사용합니다.
              가운데 프레임은 화면 정중앙에 고정하고,
              알림/언어 버튼은 좌우에 독립적으로 배치합니다.
          ================================================= */}
          <View
            style={[
              styles.headerRow,
              { paddingTop: headerTopPadding },
            ]}
          >
            <View style={styles.headerSideLeft}>
              <NotificationButton count={0} />
            </View>

            <View
              pointerEvents="none"
              style={[
                styles.headerCenterWrap,
                { top: headerTopPadding },
              ]}
            >
              <ImageBackground
                source={HEADER_FRAME}
                resizeMode="stretch"
                style={[
                  styles.profileHeaderFrame,
                  {
                    width: headerFrameWidth,
                    height: headerFrameHeight,
                  },
                ]}
              >
                <Image
                  source={TAB_ICONS.collection}
                  resizeMode="contain"
                  style={styles.profileHeaderIcon}
                />

                <Text style={styles.profileHeaderTitle}>
                  Collection
                </Text>
              </ImageBackground>
            </View>

            <View style={styles.headerSideRight}>
              <LanguageButton language="EN" />
            </View>
          </View>

          {/* =================================================
              TABS
          ================================================= */}
          <View style={styles.tabsRow}>
            <Pressable
              onPress={() => setActiveTab('items')}
              style={styles.tabPressable}
            >
              <CroppedAsset
                source={
                  activeTab === 'items'
                    ? COLLECTION_TAB_SELECTED
                    : COLLECTION_TAB_DEFAULT
                }
                crop={CROP.tab}
                stretch
                style={styles.tabAsset}
              >
                <View style={styles.tabLabelRow}>
                  {activeTab === 'items' && (
                    <Text style={styles.tabSparkle}>✦</Text>
                  )}

                  <Text style={styles.tabText}>
                    Items
                  </Text>
                </View>
              </CroppedAsset>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('backgrounds')}
              style={styles.tabPressable}
            >
              <CroppedAsset
                source={
                  activeTab === 'backgrounds'
                    ? COLLECTION_TAB_SELECTED
                    : COLLECTION_TAB_DEFAULT
                }
                crop={CROP.tab}
                stretch
                style={styles.tabAsset}
              >
                <View style={styles.tabLabelRow}>
                  {activeTab === 'backgrounds' && (
                    <Text style={styles.tabSparkle}>✦</Text>
                  )}

                  <Text style={styles.tabText}>
                    Backgrounds
                  </Text>
                </View>
              </CroppedAsset>
            </Pressable>
          </View>

          {/* =================================================
              SCROLLING CONTENT
          ================================================= */}
          <ScrollView
            style={styles.mainScroll}
            contentContainerStyle={styles.mainScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'items' ? (
              <>
                {/* ===========================================
                    COLLECTED / DISPLAY PANEL
                =========================================== */}
                <View style={styles.panel}>
                  <View style={styles.panelInnerBorder} />
                  <PanelCorners />

                  <View style={styles.collectionCountRow}>
                    <View style={styles.countIconBox}>
                      <Text style={styles.countIconText}>▧</Text>
                    </View>

                    <Text style={styles.collectionCount}>
                      Collected Items{' '}
                      {unlockedItems.length}
                      {' / '}
                      {ALL_COLLECTION_ITEMS.length}
                    </Text>
                  </View>

                  <CroppedAsset
                    source={COLLECTION_DISPLAY_SHELF}
                    crop={CROP.shelf}
                    style={styles.shelfAsset}
                  >
                    {SHELF_POSITIONS.map((position, index) => {
                      const item = shelfItems[index];

                      if (!item) {
                        return null;
                      }

                      return (
                        <View
                          key={`${item.id}-${index}`}
                          pointerEvents="none"
                          style={[
                            styles.shelfItemSlot,
                            {
                              left: position.left,
                              top: position.top,
                            },
                          ]}
                        >
                          <Image
                            source={item.image}
                            resizeMode="contain"
                            style={styles.shelfItemImage}
                          />

                          <Text style={styles.shelfCount}>
                            ★ x1
                          </Text>
                        </View>
                      );
                    })}
                  </CroppedAsset>
                </View>

                {/* ===========================================
                    ALL ITEMS PANEL
                =========================================== */}
                <View style={[styles.panel, styles.itemsPanel]}>
                  <View style={styles.panelInnerBorder} />
                  <PanelCorners />

                  <View style={styles.itemsHeaderRow}>
                    <View style={styles.sectionTitleRow}>
                      <GridMiniIcon />
                      <Text style={styles.sectionTitle}>
                        All Items
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => {
                        setSortMode((current) =>
                          current === 'acquired'
                            ? 'default'
                            : 'acquired'
                        );
                      }}
                      style={styles.sortPressable}
                    >
                      <CroppedAsset
                        source={COLLECTION_SORT_BUTTON}
                        crop={CROP.sort}
                        style={styles.sortAsset}
                      >
                        <View style={styles.sortLabelRow}>
                          <Text style={styles.sortIcon}>☷</Text>
                          <Text style={styles.sortText}>
                            {sortMode === 'acquired'
                              ? 'Acquired'
                              : 'Default'}
                          </Text>
                          <Text style={styles.sortChevron}>⌄</Text>
                        </View>
                      </CroppedAsset>
                    </Pressable>
                  </View>

                  <View style={styles.itemGrid}>
                    {sortedItems.map((item) => {
                      const unlocked = unlockedItemIds.has(item.id);
                      const selected = selectedItemIds.includes(item.id);

                      return (
                        <Pressable
                          key={item.id}
                          onPress={() => toggleItemSelection(item)}
                          style={[
                            styles.itemCardPressable,
                            selected && styles.itemCardSelected,
                          ]}
                        >
                          <CroppedAsset
                            source={
                              unlocked
                                ? COLLECTION_CARD_UNLOCKED_1
                                : COLLECTION_CARD_LOCKED_1
                            }
                            crop={
                              unlocked
                                ? CROP.unlockedSmall
                                : CROP.lockedSmall
                            }
                            style={styles.itemCardAsset}
                          >
                            {unlocked ? (
                              <>
                                <Image
                                  source={item.image}
                                  resizeMode="contain"
                                  style={styles.itemCardImage}
                                />

                                <View style={styles.itemCountRow}>
                                  <Text style={styles.itemStar}>★</Text>
                                  <Text style={styles.itemCount}>x1</Text>
                                </View>
                              </>
                            ) : (
                              <Text style={styles.lockedQuestion}>?</Text>
                            )}
                          </CroppedAsset>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Pressable
                    onPress={placeSelectedItems}
                    style={({ pressed }) => [
                      styles.placeButton,
                      selectedItemIds.length === 0 &&
                        styles.placeButtonIdle,
                      pressed &&
                        selectedItemIds.length > 0 &&
                        styles.placeButtonPressed,
                    ]}
                  >
                    <Text style={styles.placeSparkle}>✦</Text>
                    <Text style={styles.placeButtonText}>
                      Place on Display
                    </Text>
                    <Text style={styles.placeSparkle}>✦</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              /* =============================================
                 BACKGROUNDS TAB
              ============================================= */
              <View style={[styles.panel, styles.backgroundsPanel]}>
                <View style={styles.panelInnerBorder} />
                <PanelCorners />

                <View style={styles.collectionCountRow}>
                  <View style={styles.countIconBox}>
                    <Text style={styles.countIconText}>▧</Text>
                  </View>

                  <Text style={styles.collectionCount}>
                    Collected Backgrounds{' '}
                    {unlockedBackgroundIds.size}
                    {' / '}
                    {ALL_BACKGROUND_ITEMS.length}
                  </Text>
                </View>

                <View style={styles.backgroundSectionTitleRow}>
                  <GridMiniIcon />
                  <Text style={styles.sectionTitle}>
                    All Backgrounds
                  </Text>
                </View>

                <View style={styles.backgroundGrid}>
                  {ALL_BACKGROUND_ITEMS.map((background) => {
                    const unlocked =
                      unlockedBackgroundIds.has(background.id);

                    const applied =
                      selectedRoomBackgroundId === background.id;

                    return (
                      <Pressable
                        key={background.id}
                        disabled={!unlocked}
                        onPress={() => {
                          if (unlocked) {
                            setRoomBackground(background.id);
                          }
                        }}
                        style={[
                          styles.backgroundCard,
                          applied && styles.backgroundCardSelected,
                        ]}
                      >
                        <CroppedAsset
                          source={
                            unlocked
                              ? COLLECTION_CARD_UNLOCKED_2
                              : COLLECTION_CARD_LOCKED_2
                          }
                          crop={
                            unlocked
                              ? CROP.unlockedTall
                              : CROP.lockedTall
                          }
                          style={styles.backgroundCardAsset}
                        >
                          {unlocked ? (
                            <Image
                              source={background.image}
                              resizeMode="cover"
                              style={styles.backgroundThumbnail}
                            />
                          ) : (
                            <Text style={styles.backgroundLockedQuestion}>
                              ?
                            </Text>
                          )}

                          {unlocked && applied && (
                            <View style={styles.backgroundAppliedBadge}>
                              <Text style={styles.backgroundAppliedText}>
                                Applied
                              </Text>
                            </View>
                          )}
                        </CroppedAsset>

                        <Text
                          numberOfLines={2}
                          style={styles.backgroundName}
                        >
                          {unlocked
                            ? background.name
                            : 'Locked'}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          {/* =================================================
              BOTTOM NAVIGATION
          ================================================= */}
          <View
            style={[
              styles.bottomArea,
              {
                paddingBottom: Math.max(insets.bottom, 8),
              },
            ]}
          >
            <BottomNavigation activeTab="collection" />
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.webBackdrop,
    alignItems: IS_WEB ? 'center' : 'stretch',
  },

  phoneFrame: {
    flex: 1,
    maxWidth: IS_WEB ? PHONE_MAX_WIDTH : undefined,
    overflow: 'hidden',
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  /* -----------------------------------------------------
     GENERIC CROPPED PNG
  ----------------------------------------------------- */

  croppedAssetRoot: {
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* -----------------------------------------------------
     HEADER
  ----------------------------------------------------- */

  headerRow: {
    width: '100%',
    paddingHorizontal: 14,
    // 가운데 헤더 프레임 높이(58)를 충분히 품도록 아래 여백 확보
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerSideLeft: {
    width: 58,
    alignItems: 'flex-start',
    zIndex: 3,
  },

  headerSideRight: {
    width: 112,
    alignItems: 'flex-end',
    zIndex: 3,
  },

  headerCenterWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  profileHeaderFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileHeaderIcon: {
    width: 21,
    height: 21,
    marginRight: 7,
  },

  profileHeaderTitle: {
    color: '#332319',
    fontSize: 17,
    lineHeight: 21,
    fontFamily: 'MapseeFredokaBold',
  },

  /* -----------------------------------------------------
     TABS
  ----------------------------------------------------- */

  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 34,
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },

  tabPressable: {
    flex: 1,
  },

  tabAsset: {
    width: '100%',
    height: 42,
  },

  tabLabelRow: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabText: {
    color: '#3D281A',
    fontSize: 14,
    fontFamily: 'MapseeFredokaBold',
  },

  tabSparkle: {
    color: '#FFF4D9',
    fontSize: 8,
    marginRight: 7,
    fontFamily: 'MapseePixel',
  },

  /* -----------------------------------------------------
     MAIN SCROLL
  ----------------------------------------------------- */

  mainScroll: {
    flex: 1,
  },

  mainScrollContent: {
    paddingHorizontal: 14,
    paddingTop: 2,
    paddingBottom: 12,
  },

  /* -----------------------------------------------------
     CREAM PANELS
  ----------------------------------------------------- */

  panel: {
    position: 'relative',
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#A56F38',
    backgroundColor: '#F8E3B9',
    // 장식선/모서리와 실제 콘텐츠가 겹치지 않도록
    // 패널 내부에 고정 safe area를 확보합니다.
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 16,
    overflow: 'hidden',
    shadowColor: '#28170C',
    shadowOpacity: 0.22,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  itemsPanel: {
    marginTop: 10,
  },

  backgroundsPanel: {
    minHeight: 520,
  },

  panelInnerBorder: {
    position: 'absolute',
    top: 6,
    right: 6,
    bottom: 6,
    left: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(174, 120, 61, 0.28)',
    zIndex: 0,
  },

  panelCorner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: '#C79753',
    zIndex: 1,
  },

  cornerTopLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },

  cornerTopRight: {
    top: 10,
    right: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },

  cornerBottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },

  cornerBottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },

  /* -----------------------------------------------------
     COUNT + SHELF
  ----------------------------------------------------- */

  collectionCountRow: {
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    // 좌우 모서리 장식이 차지하는 영역을 피하는 safe inset
    marginHorizontal: 20,
    marginBottom: 12,
  },

  countIconBox: {
    width: 19,
    height: 19,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#9B6736',
    borderRadius: 3,
    backgroundColor: '#F2D8A8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countIconText: {
    color: '#80512A',
    fontSize: 10,
    fontFamily: 'MapseePixel',
  },

  collectionCount: {
    color: '#3B281B',
    fontSize: 12.5,
    lineHeight: 16,
    fontFamily: 'MapseeFredokaBold',
  },

  shelfAsset: {
    width: '93%',
    alignSelf: 'center',
    marginTop: 2,
    zIndex: 4,
  },

  shelfItemSlot: {
    position: 'absolute',
    width: '18%',
    height: '34%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shelfItemImage: {
    width: '100%',
    height: '78%',
  },

  shelfCount: {
    marginTop: -2,
    color: '#FFF4D2',
    fontSize: 8.5,
    fontFamily: 'MapseeFredokaBold',
    textShadowColor: '#4B2814',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  /* -----------------------------------------------------
     ALL ITEMS HEADER
  ----------------------------------------------------- */

  itemsHeaderRow: {
    zIndex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // 상단 좌/우 코너 장식과 제목/정렬 버튼이 겹치지 않도록
    // 콘텐츠를 안쪽으로 넣습니다.
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  gridMiniIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },

  gridMiniSquare: {
    width: 7,
    height: 7,
    borderRadius: 1.5,
    backgroundColor: '#A36E35',
    borderWidth: 1,
    borderColor: '#7D4D26',
  },

  sectionTitle: {
    color: '#3A281B',
    fontSize: 14.5,
    fontFamily: 'MapseeFredokaBold',
  },

  sortPressable: {
    width: 102,
    marginRight: 2,
  },

  sortAsset: {
    width: '100%',
  },

  sortLabelRow: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  sortIcon: {
    color: '#88592C',
    fontSize: 9,
    marginRight: 4,
    fontFamily: 'MapseePixel',
  },

  sortText: {
    color: '#3D281B',
    fontSize: 9.5,
    fontFamily: 'MapseeFredokaBold',
  },

  sortChevron: {
    color: '#70451F',
    fontSize: 11,
    marginLeft: 4,
    marginTop: -2,
    fontFamily: 'MapseePixel',
  },

  /* -----------------------------------------------------
     ITEM GRID
  ----------------------------------------------------- */

  itemGrid: {
    zIndex: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },

  itemCardPressable: {
    width: '18.2%',
    marginBottom: 12,
    borderRadius: 7,
  },

  itemCardSelected: {
    borderWidth: 2,
    borderColor: '#D86472',
    transform: [{ scale: 0.96 }],
  },

  itemCardAsset: {
    width: '100%',
  },

  itemCardImage: {
    width: '60%',
    height: '60%',
  },

  itemCountRow: {
    position: 'absolute',
    right: '10%',
    bottom: '9%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemStar: {
    color: '#D49B2D',
    fontSize: 7.5,
    marginRight: 2,
  },

  itemCount: {
    color: '#4B3020',
    fontSize: 7.7,
    fontFamily: 'MapseeFredokaBold',
  },

  lockedQuestion: {
    color: '#E1BD91',
    fontSize: 27,
    lineHeight: 30,
    fontFamily: 'MapseeFredokaBold',
    textShadowColor: 'rgba(81, 45, 24, 0.22)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  /* -----------------------------------------------------
     PLACE BUTTON
  ----------------------------------------------------- */

  placeButton: {
    zIndex: 4,
    height: 56,
    marginTop: 4,
    marginHorizontal: 34,
    marginBottom: 4,
    borderRadius: 13,
    borderWidth: 2.3,
    borderColor: '#844A3A',
    backgroundColor: '#DE7778',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B160D',
    shadowOpacity: 0.30,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  placeButtonIdle: {
    opacity: 0.86,
  },

  placeButtonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.93,
  },

  placeButtonText: {
    color: '#FFF4E7',
    fontSize: 15,
    fontFamily: 'MapseeFredokaBold',
    marginHorizontal: 13,
  },

  placeSparkle: {
    color: '#F1BE74',
    fontSize: 9,
    fontFamily: 'MapseePixel',
  },

  /* -----------------------------------------------------
     BACKGROUNDS TAB
  ----------------------------------------------------- */

  backgroundSectionTitleRow: {
    zIndex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginHorizontal: 12,
    marginBottom: 14,
  },

  backgroundGrid: {
    zIndex: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  backgroundCard: {
    width: '47%',
    marginBottom: 16,
    alignItems: 'center',
    borderRadius: 10,
  },

  backgroundCardSelected: {
    borderWidth: 2,
    borderColor: '#D96F78',
    backgroundColor: 'rgba(255, 240, 233, 0.35)',
  },

  backgroundAppliedBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: '#D96F78',
  },

  backgroundAppliedText: {
    color: '#FFF8E8',
    fontSize: 7.5,
    fontFamily: 'MapseeFredokaBold',
  },

  backgroundCardAsset: {
    width: '100%',
  },

  backgroundThumbnail: {
    width: '72%',
    height: '76%',
    borderRadius: 5,
  },

  backgroundLockedQuestion: {
    color: '#D4B38A',
    fontSize: 34,
    fontFamily: 'MapseeFredokaBold',
  },

  backgroundName: {
    width: '94%',
    marginTop: 5,
    color: '#3D281B',
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'MapseeFredokaMedium',
    textAlign: 'center',
  },

  /* -----------------------------------------------------
     BOTTOM NAVIGATION
  ----------------------------------------------------- */

  bottomArea: {
    paddingHorizontal: 8,
    paddingTop: 6,
  },
});
