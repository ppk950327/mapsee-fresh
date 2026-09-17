// @refresh reset

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { ReactNode } from 'react';

import { ANDONG_QUESTS } from '../data/andongQuests';
import { SEOUL_QUESTS } from '../data/seoulQuests';


/* =========================================================
   TYPES
========================================================= */

export type QuestRegion =
  | 'seoul'
  | 'andong';

export type RoomItemPlacement = {
  itemId: string;
  x: number;
  y: number;
  scale: number;
};

type PersistedCollectionState = {
  collectedQuestIds: string[];

  /*
    일반 아이템은 저장하지 않습니다.
    일반 아이템은 collectedQuestIds에서 1:1로 계산합니다.

    여기에는 하회 보너스처럼
    퀘스트 1개에 추가로 주는 보상만 저장합니다.
  */
  acquiredBonusItemIds: string[];

  acquiredBackgroundIds: string[];

  shelfItemIds: string[];

  roomItems: RoomItemPlacement[];

  selectedRoomBackgroundId: string | null;
};

type CollectionContextType = {
  collectedQuestIds: string[];

  collectQuest: (
    questId: string,
    region?: QuestRegion
  ) => void;

  isCollected: (
    questId: string,
    region?: QuestRegion
  ) => boolean;


  /*
    중요:
    이 배열은 독립적으로 쌓는 상태가 아닙니다.

    서울/안동 일반 아이템:
    collectedQuestIds에서 자동 계산

    보너스 아이템:
    acquiredBonusItemIds에서 추가
  */
  acquiredItemIds: string[];

  acquireItem: (
    itemId: string
  ) => void;

  hasItem: (
    itemId: string
  ) => boolean;


  acquiredBackgroundIds: string[];

  acquireBackground: (
    backgroundId: string
  ) => void;

  hasBackground: (
    backgroundId: string
  ) => boolean;


  shelfItemIds: string[];

  setShelfItems: (
    itemIds: string[]
  ) => void;


  roomItems: RoomItemPlacement[];

  placeRoomItem: (
    placement: RoomItemPlacement
  ) => void;

  removeRoomItem: (
    itemId: string
  ) => void;

  clearRoomItems: () => void;


  selectedRoomBackgroundId:
    string | null;

  setRoomBackground: (
    backgroundId: string | null
  ) => void;


  collectedSeoulCount: number;

  seoulTotalCount: number;

  collectedAndongCount: number;

  andongTotalCount: number;

  collectionProgress: number;


  isCollectionLoaded: boolean;

  resetCollection: () => void;
};


/* =========================================================
   CONTEXT
========================================================= */

const CollectionContext =
  createContext<
    CollectionContextType | undefined
  >(undefined);


/* =========================================================
   PROVIDER PROPS
========================================================= */

type CollectionProviderProps = {
  children: ReactNode;
};


/* =========================================================
   STORAGE

   v6:
   - 이전 잘못 저장된 acquiredItemIds를 완전히 버림
   - 일반 아이템은 퀘스트 완료 ID에서만 계산
========================================================= */

const COLLECTION_STORAGE_KEY =
  '@mapsee/collection-v6';

const LEGACY_STORAGE_KEYS = [
  '@mapsee/collection-v2',
  '@mapsee/collection-v3',
  '@mapsee/collection-v4',
  '@mapsee/collection-v5',
];


/* =========================================================
   VALID IDS
========================================================= */

const SEOUL_QUEST_IDS =
  new Set(
    SEOUL_QUESTS.map(
      (quest) => quest.id
    )
  );

const ANDONG_QUEST_IDS =
  new Set(
    ANDONG_QUESTS.map(
      (quest) => quest.id
    )
  );

const VALID_BONUS_ITEM_IDS =
  new Set(
    ANDONG_QUESTS
      .filter(
        (quest) =>
          Boolean(
            quest.bonusItemImage
          )
          &&
          Boolean(
            quest.bonusItemName
          )
      )
      .map(
        (quest) =>
          `andong-${quest.id}-bonus`
      )
  );

const VALID_BACKGROUND_IDS =
  new Set(
    ANDONG_QUESTS.map(
      (quest) =>
        `background-${quest.id}`
    )
  );


/* =========================================================
   TOTAL COUNTS
========================================================= */

const SEOUL_TOTAL_COUNT: number =
  SEOUL_QUESTS.length;

const ANDONG_TOTAL_COUNT: number =
  ANDONG_QUESTS.length;


/* =========================================================
   HELPERS
========================================================= */

const makeQuestKey = (
  questId: string,
  region: QuestRegion
) => {
  return `${region}:${questId}`;
};


const uniqueStrings = (
  values: string[]
) => {
  return Array.from(
    new Set(values)
  );
};


const clamp01 = (
  value: number
) => {
  return Math.max(
    0,
    Math.min(
      value,
      1
    )
  );
};


const sanitizeRoomPlacement = (
  placement: RoomItemPlacement
): RoomItemPlacement => {
  return {
    itemId:
      placement.itemId,

    x:
      clamp01(
        placement.x
      ),

    y:
      clamp01(
        placement.y
      ),

    scale:
      Math.max(
        0.4,
        Math.min(
          placement.scale,
          2
        )
      ),
  };
};


const isValidQuestKey = (
  value: string
) => {

  if (
    value.startsWith(
      'seoul:'
    )
  ) {

    return SEOUL_QUEST_IDS.has(
      value.slice(
        'seoul:'.length
      )
    );

  }


  if (
    value.startsWith(
      'andong:'
    )
  ) {

    return ANDONG_QUEST_IDS.has(
      value.slice(
        'andong:'.length
      )
    );

  }


  return false;
};


/* =========================================================
   PROVIDER
========================================================= */

export function CollectionProvider({
  children,
}: CollectionProviderProps) {

  const [
    collectedQuestIds,
    setCollectedQuestIds,
  ] =
    useState<string[]>([]);


  const [
    acquiredBonusItemIds,
    setAcquiredBonusItemIds,
  ] =
    useState<string[]>([]);


  const [
    acquiredBackgroundIds,
    setAcquiredBackgroundIds,
  ] =
    useState<string[]>([]);


  const [
    shelfItemIds,
    setShelfItemIds,
  ] =
    useState<string[]>([]);


  const [
    roomItems,
    setRoomItems,
  ] =
    useState<RoomItemPlacement[]>(
      []
    );


  const [
    selectedRoomBackgroundId,
    setSelectedRoomBackgroundId,
  ] =
    useState<string | null>(
      null
    );


  const [
    isCollectionLoaded,
    setIsCollectionLoaded,
  ] =
    useState(false);


  /* =======================================================
     ACQUIRED ITEM IDS

     핵심 수정:
     일반 아이템은 완료한 퀘스트와 1:1로만 생성됩니다.

     예:
     seoul:seongbuk-chaekgeori
       ↓
     seoul-seongbuk-chaekgeori

     따라서 퀴즈 하나를 완료해서
     일반 아이템 5개가 생기는 일이 구조상 불가능합니다.
  ======================================================= */

  const acquiredItemIds =
    useMemo(
      () => {

        const mainItemIds =
          collectedQuestIds
            .map(
              (questKey) => {

                if (
                  questKey.startsWith(
                    'seoul:'
                  )
                ) {

                  const questId =
                    questKey.slice(
                      'seoul:'.length
                    );

                  if (
                    SEOUL_QUEST_IDS.has(
                      questId
                    )
                  ) {

                    return `seoul-${questId}`;

                  }

                }


                if (
                  questKey.startsWith(
                    'andong:'
                  )
                ) {

                  const questId =
                    questKey.slice(
                      'andong:'.length
                    );

                  if (
                    ANDONG_QUEST_IDS.has(
                      questId
                    )
                  ) {

                    return `andong-${questId}`;

                  }

                }


                return null;

              }
            )
            .filter(
              (
                itemId
              ): itemId is string =>
                itemId !== null
            );


        return uniqueStrings([
          ...mainItemIds,
          ...acquiredBonusItemIds,
        ]);

      },
      [
        acquiredBonusItemIds,
        collectedQuestIds,
      ]
    );


  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(
    () => {

      const loadCollection =
        async () => {

          try {

            /*
              이전 버전 테스트 데이터는 더 이상 읽지 않습니다.
            */
            await Promise.all(
              LEGACY_STORAGE_KEYS.map(
                (key) =>
                  AsyncStorage.removeItem(
                    key
                  )
              )
            );


            const saved =
              await AsyncStorage.getItem(
                COLLECTION_STORAGE_KEY
              );


            if (saved) {

              const parsed =
                JSON.parse(
                  saved
                ) as Partial<PersistedCollectionState>;


              const loadedQuestIds =
                Array.isArray(
                  parsed.collectedQuestIds
                )
                  ? parsed
                      .collectedQuestIds
                      .filter(
                        (
                          value
                        ): value is string =>
                          typeof value ===
                            'string'
                          &&
                          isValidQuestKey(
                            value
                          )
                      )
                  : [];


              const loadedBonusItemIds =
                Array.isArray(
                  parsed.acquiredBonusItemIds
                )
                  ? parsed
                      .acquiredBonusItemIds
                      .filter(
                        (
                          value
                        ): value is string =>
                          typeof value ===
                            'string'
                          &&
                          VALID_BONUS_ITEM_IDS.has(
                            value
                          )
                      )
                  : [];


              const loadedBackgroundIds =
                Array.isArray(
                  parsed.acquiredBackgroundIds
                )
                  ? parsed
                      .acquiredBackgroundIds
                      .filter(
                        (
                          value
                        ): value is string =>
                          typeof value ===
                            'string'
                          &&
                          VALID_BACKGROUND_IDS.has(
                            value
                          )
                      )
                  : [];


              const loadedShelfIds =
                Array.isArray(
                  parsed.shelfItemIds
                )
                  ? parsed
                      .shelfItemIds
                      .filter(
                        (
                          value
                        ): value is string =>
                          typeof value ===
                            'string'
                      )
                      .slice(
                        0,
                        6
                      )
                  : [];


              const loadedRoomItems =
                Array.isArray(
                  parsed.roomItems
                )
                  ? parsed
                      .roomItems
                      .filter(
                        (
                          value
                        ): value is RoomItemPlacement => {

                          if (
                            !value
                            ||
                            typeof value !==
                              'object'
                          ) {
                            return false;
                          }


                          const candidate =
                            value as RoomItemPlacement;


                          return (
                            typeof candidate.itemId ===
                              'string'
                            &&
                            typeof candidate.x ===
                              'number'
                            &&
                            typeof candidate.y ===
                              'number'
                            &&
                            typeof candidate.scale ===
                              'number'
                          );

                        }
                      )
                      .map(
                        sanitizeRoomPlacement
                      )
                  : [];


              const loadedRoomBackground =
                typeof parsed.selectedRoomBackgroundId ===
                  'string'
                  &&
                  VALID_BACKGROUND_IDS.has(
                    parsed.selectedRoomBackgroundId
                  )
                  ? parsed.selectedRoomBackgroundId
                  : null;


              setCollectedQuestIds(
                uniqueStrings(
                  loadedQuestIds
                )
              );

              setAcquiredBonusItemIds(
                uniqueStrings(
                  loadedBonusItemIds
                )
              );

              setAcquiredBackgroundIds(
                uniqueStrings(
                  loadedBackgroundIds
                )
              );

              setShelfItemIds(
                uniqueStrings(
                  loadedShelfIds
                )
              );

              setRoomItems(
                loadedRoomItems
              );

              setSelectedRoomBackgroundId(
                loadedRoomBackground
              );

            }

          } catch (
            error
          ) {

            console.log(
              'Collection load error:',
              error
            );

          } finally {

            setIsCollectionLoaded(
              true
            );

          }

        };


      void loadCollection();

    },
    []
  );


  /* =======================================================
     SAVE
  ======================================================= */

  useEffect(
    () => {

      if (
        !isCollectionLoaded
      ) {
        return;
      }


      const saveCollection =
        async () => {

          const state:
            PersistedCollectionState = {

              collectedQuestIds,

              acquiredBonusItemIds,

              acquiredBackgroundIds,

              shelfItemIds,

              roomItems,

              selectedRoomBackgroundId,

            };


          try {

            await AsyncStorage.setItem(
              COLLECTION_STORAGE_KEY,
              JSON.stringify(
                state
              )
            );

          } catch (
            error
          ) {

            console.log(
              'Collection save error:',
              error
            );

          }

        };


      void saveCollection();

    },
    [
      acquiredBackgroundIds,
      acquiredBonusItemIds,
      collectedQuestIds,
      isCollectionLoaded,
      roomItems,
      selectedRoomBackgroundId,
      shelfItemIds,
    ]
  );


  /* =======================================================
     QUEST
  ======================================================= */

  const collectQuest =
    useCallback(
      (
        questId: string,
        region:
          QuestRegion =
          'seoul'
      ) => {

        const valid =
          region ===
            'seoul'
            ? SEOUL_QUEST_IDS.has(
                questId
              )
            : ANDONG_QUEST_IDS.has(
                questId
              );


        if (
          !valid
        ) {
          return;
        }


        const key =
          makeQuestKey(
            questId,
            region
          );


        setCollectedQuestIds(
          (current) => {

            if (
              current.includes(
                key
              )
            ) {
              return current;
            }


            return [
              ...current,
              key,
            ];

          }
        );

      },
      []
    );


  const isCollected =
    useCallback(
      (
        questId: string,
        region:
          QuestRegion =
          'seoul'
      ): boolean => {

        return collectedQuestIds.includes(
          makeQuestKey(
            questId,
            region
          )
        );

      },
      [
        collectedQuestIds,
      ]
    );


  /* =======================================================
     BONUS ITEM ONLY

     acquireItem은 이제 일반 유물을 추가하지 못합니다.
     오직 실제 보너스 아이템만 허용합니다.
  ======================================================= */

  const acquireItem =
    useCallback(
      (
        itemId: string
      ) => {

        if (
          !VALID_BONUS_ITEM_IDS.has(
            itemId
          )
        ) {
          return;
        }


        setAcquiredBonusItemIds(
          (current) => {

            if (
              current.includes(
                itemId
              )
            ) {
              return current;
            }


            return [
              ...current,
              itemId,
            ];

          }
        );

      },
      []
    );


  const hasItem =
    useCallback(
      (
        itemId: string
      ): boolean => {

        return acquiredItemIds.includes(
          itemId
        );

      },
      [
        acquiredItemIds,
      ]
    );


  /* =======================================================
     BACKGROUND
  ======================================================= */

  const acquireBackground =
    useCallback(
      (
        backgroundId: string
      ) => {

        if (
          !VALID_BACKGROUND_IDS.has(
            backgroundId
          )
        ) {
          return;
        }


        setAcquiredBackgroundIds(
          (current) => {

            if (
              current.includes(
                backgroundId
              )
            ) {
              return current;
            }


            return [
              ...current,
              backgroundId,
            ];

          }
        );

      },
      []
    );


  const hasBackground =
    useCallback(
      (
        backgroundId: string
      ): boolean => {

        return acquiredBackgroundIds.includes(
          backgroundId
        );

      },
      [
        acquiredBackgroundIds,
      ]
    );


  /* =======================================================
     SHELF
  ======================================================= */

  const setShelfItems =
    useCallback(
      (
        itemIds: string[]
      ) => {

        const next =
          uniqueStrings(
            itemIds
          )
            .filter(
              (itemId) =>
                acquiredItemIds.includes(
                  itemId
                )
            )
            .slice(
              0,
              6
            );


        setShelfItemIds(
          next
        );

      },
      [
        acquiredItemIds,
      ]
    );


  /* =======================================================
     ROOM ITEMS
  ======================================================= */

  const placeRoomItem =
    useCallback(
      (
        placement:
          RoomItemPlacement
      ) => {

        if (
          !acquiredItemIds.includes(
            placement.itemId
          )
        ) {
          return;
        }


        const safePlacement =
          sanitizeRoomPlacement(
            placement
          );


        setRoomItems(
          (current) => {

            const existingIndex =
              current.findIndex(
                (item) =>
                  item.itemId ===
                  safePlacement.itemId
              );


            if (
              existingIndex >=
              0
            ) {

              return current.map(
                (
                  item,
                  index
                ) =>
                  index ===
                    existingIndex
                    ? safePlacement
                    : item
              );

            }


            return [
              ...current,
              safePlacement,
            ];

          }
        );

      },
      [
        acquiredItemIds,
      ]
    );


  const removeRoomItem =
    useCallback(
      (
        itemId: string
      ) => {

        setRoomItems(
          (current) =>
            current.filter(
              (item) =>
                item.itemId !==
                itemId
            )
        );

      },
      []
    );


  const clearRoomItems =
    useCallback(
      () => {

        setRoomItems(
          []
        );

      },
      []
    );


  /* =======================================================
     ROOM BACKGROUND
  ======================================================= */

  const setRoomBackground =
    useCallback(
      (
        backgroundId:
          string | null
      ) => {

        if (
          backgroundId ===
          null
        ) {

          setSelectedRoomBackgroundId(
            null
          );

          return;
        }


        if (
          !acquiredBackgroundIds.includes(
            backgroundId
          )
        ) {
          return;
        }


        setSelectedRoomBackgroundId(
          backgroundId
        );

      },
      [
        acquiredBackgroundIds,
      ]
    );


  /* =======================================================
     COUNTS
  ======================================================= */

  const collectedSeoulCount =
    useMemo(
      () =>
        collectedQuestIds.filter(
          (id) =>
            id.startsWith(
              'seoul:'
            )
        ).length,
      [
        collectedQuestIds,
      ]
    );


  const collectedAndongCount =
    useMemo(
      () =>
        collectedQuestIds.filter(
          (id) =>
            id.startsWith(
              'andong:'
            )
        ).length,
      [
        collectedQuestIds,
      ]
    );


  const seoulTotalCount: number =
    SEOUL_TOTAL_COUNT;


  const andongTotalCount: number =
    ANDONG_TOTAL_COUNT;


  const collectionProgress =
    useMemo(
      () => {

        if (
          seoulTotalCount <=
          0
        ) {
          return 0;
        }


        return Math.round(
          (
            collectedSeoulCount /
            seoulTotalCount
          ) *
            100
        );

      },
      [
        collectedSeoulCount,
        seoulTotalCount,
      ]
    );


  /* =======================================================
     RESET
  ======================================================= */

  const resetCollection =
    useCallback(
      () => {

        setCollectedQuestIds(
          []
        );

        setAcquiredBonusItemIds(
          []
        );

        setAcquiredBackgroundIds(
          []
        );

        setShelfItemIds(
          []
        );

        setRoomItems(
          []
        );

        setSelectedRoomBackgroundId(
          null
        );


        void Promise.all([
          AsyncStorage.removeItem(
            COLLECTION_STORAGE_KEY
          ),

          ...LEGACY_STORAGE_KEYS.map(
            (key) =>
              AsyncStorage.removeItem(
                key
              )
          ),
        ]);

      },
      []
    );


  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo<
      CollectionContextType
    >(
      () => ({

        collectedQuestIds,

        collectQuest,

        isCollected,


        acquiredItemIds,

        acquireItem,

        hasItem,


        acquiredBackgroundIds,

        acquireBackground,

        hasBackground,


        shelfItemIds,

        setShelfItems,


        roomItems,

        placeRoomItem,

        removeRoomItem,

        clearRoomItems,


        selectedRoomBackgroundId,

        setRoomBackground,


        collectedSeoulCount,

        seoulTotalCount,

        collectedAndongCount,

        andongTotalCount,

        collectionProgress,


        isCollectionLoaded,


        resetCollection,

      }),
      [
        acquiredBackgroundIds,
        acquiredItemIds,
        andongTotalCount,
        clearRoomItems,
        collectQuest,
        collectedAndongCount,
        collectedQuestIds,
        collectedSeoulCount,
        collectionProgress,
        hasBackground,
        hasItem,
        isCollected,
        isCollectionLoaded,
        placeRoomItem,
        removeRoomItem,
        resetCollection,
        roomItems,
        selectedRoomBackgroundId,
        seoulTotalCount,
        setRoomBackground,
        setShelfItems,
        shelfItemIds,
      ]
    );


  return (
    <CollectionContext.Provider
      value={
        value
      }
    >
      {
        children
      }
    </CollectionContext.Provider>
  );
}


/* =========================================================
   HOOK
========================================================= */

export function useCollection() {

  const context =
    useContext(
      CollectionContext
    );


  if (
    !context
  ) {

    throw new Error(
      'useCollection must be used inside CollectionProvider.'
    );

  }


  return context;
}
