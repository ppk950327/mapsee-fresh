import {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from 'react';

export type CharacterGender =
  | 'female'
  | 'male';

type CharacterContextType = {
  characterGender: CharacterGender;

  setCharacterGender: (
    gender: CharacterGender
  ) => void;

  toggleCharacterGender: () => void;
};

const CharacterContext =
  createContext<
    CharacterContextType | undefined
  >(undefined);

type CharacterProviderProps = {
  children: ReactNode;
};

export function CharacterProvider({
  children,
}: CharacterProviderProps) {
  /*
    기본 캐릭터는 여자 캐릭터
  */
  const [
    characterGender,
    setCharacterGender,
  ] =
    useState<CharacterGender>(
      'female'
    );

  /*
    필요하면 한 번에
    여자 ↔ 남자 전환할 때 사용 가능
  */
  const toggleCharacterGender =
    () => {
      setCharacterGender(
        (current) =>
          current === 'female'
            ? 'male'
            : 'female'
      );
    };

  const value =
    useMemo<
      CharacterContextType
    >(
      () => ({
        characterGender,
        setCharacterGender,
        toggleCharacterGender,
      }),
      [characterGender]
    );

  return (
    <CharacterContext.Provider
      value={value}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context =
    useContext(
      CharacterContext
    );

  if (!context) {
    throw new Error(
      'useCharacter must be used inside CharacterProvider.'
    );
  }

  return context;
}