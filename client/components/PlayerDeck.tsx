import React, { useEffect } from "react";
import Image from "next/image";
import DeckTile from "./DeckTile";
import {
  useTransition,
  animated,
  useSpring,
  config,
  useChain,
  useSpringRef,
} from "@react-spring/web";
import { useGameContext } from "./GameProvider";
import useDistributor, { requestType } from "@/hooks/useDistributor";
import { numberPair, tileType } from "@/types";
import { TileAlignSpec } from "@/utils/game-utils";

interface PlayerDeckProps {
  anchors: TileAlignSpec[];
}

const PlayerDeck: React.FC<PlayerDeckProps> = ({ anchors }) => {
  const { canPlay, draggedTile, isTurn } = useGameContext();
  const [hand, setHand, from, boundRef, tileRequestApi] = useDistributor(
    requestType.MAIN_DECK
  );
  const canPlayStyles = canPlay ? "" : "opacity-80 pointer-events-none ";

  const springRef = useSpringRef();
  const springProp = useSpring({
    ref: springRef,
    width: hand.length * 64 - 4,
    config: config.stiff,
  });

  const transRef = useSpringRef();
  const transitions = useTransition(hand, {
    ref: transRef,
    from: {
      transform: from
        ? `translate(${-from[0]}px, ${-from[1]}px) scale(0.5)`
        : "",
    },
    enter: {
      width: "100%",
      transform: `translate(0px, 0px) scale(1)`,
    },
    leave: { width: "0%" },
    config: config.stiff,
  });

  useChain([springRef, transRef], [0, 0]);

  const onDropComplete = ({ id }: { id: number }) => {
    setHand((prevArr: tileType[]) => prevArr.filter((tile) => tile.id !== id));
  };

  useEffect(() => {
    console.log(
      "show boneyard",
      isTurn,
      !checkPlayerDeckMatches(hand, anchors)
    );
    if (
      isTurn &&
      !checkPlayerDeckMatches(hand, anchors) &&
      anchors.length > 1
    ) {
      tileRequestApi();
    }
  }, [isTurn]);

  function checkPlayerDeckMatches(
    playerDeck: tileType[],
    anchors: TileAlignSpec[]
  ): boolean {
    for (const deckTile of playerDeck) {
      for (const anchor of anchors) {
        if (anchor.canAccept.some((i) => deckTile.tile.includes(i))) {
          console.log("match tile", deckTile.id, anchor.id);
          return true;
        }
      }
    }
    return false;
  }

  return (
    <div
      id="current-player"
      className="absolute -bottom-2 bg-[#617187] w-[calc(100%_+_6px)] rounded-t-9 -left-0.5 flex p-2 justify-between items-center "
      style={{
        zIndex: draggedTile ? 0 : 20,
      }}
    >
      <div className="w-[60px] h-[60px]">
        <Image
          src="/default-avatar.png"
          width={60}
          height={60}
          alt="avatar"
          className="rounded-lg"
        />
      </div>

      <animated.div
        ref={boundRef}
        style={{ ...springProp }}
        className={`absolute flex left-[50%] translate-x-[-50%] items-center self-end gap-1 h-[120px] ${canPlayStyles}`}
      >
        {transitions((style, tile) => (
          <animated.div key={tile?.id} style={style}>
            <DeckTile {...{ tile, onDropComplete }} />
          </animated.div>
        ))}
      </animated.div>

      <div className="text-center">
        <p>0</p>
        <p className="text-xs text-[#afb7c1]">points</p>
      </div>
    </div>
  );
};

export default PlayerDeck;
