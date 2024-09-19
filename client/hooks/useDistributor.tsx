import { useGameContext } from "@/components/GameProvider";
import { numberPair, tileType, useDistributorType } from "@/types";
import { useEffect, useRef, useState } from "react";

export default function useDistributor(
  deckType: string = requestType.OPPONENT_DECK
): useDistributorType {
  const [from, setFrom] = useState<numberPair>();
  const [hand, setHand] = useState<tileType[]>([]);
  const boundRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<number>(0); // countRef keeps track of how many times distCallback has been called for UI purposes
  const callbackID = useRef<number | null>(0);
  const {
    selectFromBoneYard,
    registerDistCallback,
    unRegisterDistCallback,
    requestTile,
    permits,
  } = useGameContext();

  useEffect(() => {
    const distCallback = (position: numberPair) => {
      if (boundRef.current) {
        const bounds = boundRef.current.getBoundingClientRect();
        counterRef.current++;
        if (deckType === requestType.OPPONENT_DECK) {
          const newHand = { id: 0, tile: [0, 0] as numberPair };
          setHand((prevArr) => [...prevArr, newHand]);
          setFrom([
            bounds.left + 24 * counterRef.current - position[0],
            bounds.top - position[1],
          ]);
          return newHand;
        } else {
          const newHand = selectFromBoneYard();
          setHand((preArr) => [...preArr, newHand]);
          setFrom([bounds.right - position[0], bounds.top - position[1]]);
          return newHand;
        }
      }
    };
    callbackID.current = registerDistCallback(distCallback);
    console.log(distCallback);
    console.log(
      "register a callback",
      "deckType",
      deckType,
      callbackID.current
    );
    return () => unRegisterDistCallback(callbackID.current as number);
  }, []);

  const tileRequestApi = (amount?: number) => {
    console.log(
      "requesting tile ",
      deckType,
      callbackID.current,
      "permits",
      permits
    );
    // if (callbackID.current) {
    if (deckType === requestType.MAIN_DECK) {
      requestTile(false, callbackID.current, permits);
    } else {
      requestTile(true, callbackID.current, [], amount);
    }
    // }
  };
  return [hand, setHand, from, boundRef, tileRequestApi];
}

export const requestType = {
  INITIAL_DROP: "INITIAL_DROP",
  MAIN_DECK: "MAIN_DECK",
  OPPONENT_DECK: "OPPONENT_DECK",
};
