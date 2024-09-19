import React, { useEffect, useRef, useState } from "react";
import DominoesTile from "./DominoesTile";
import { animated, config, useTransition } from "@react-spring/web";
import { useGameContext } from "./GameProvider";
import { numberPair } from "@/types";
import { useSocket } from "./SocketProvider";

function BoneYard() {
  const {
    boneYardDistSpec,
    playerId,
    firstPlayer,
    isTurn,
    deck,
    setCanPlay,
    setBoneYardDistSpec,
    setFirstPlayer,
    setPermits,
  } = useGameContext();
  const { socket } = useSocket();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const complete = useRef(0);

  const boneYardTranstion = useTransition(boneYardDistSpec.active, {
    from: { opacity: 0, transform: "translateY(40px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(40px)" },
    config: config.gentle,
  });

  const [tiles, setTiles] = useState(
    Array.from({ length: 28 }, () => "unpicked")
  );

  useEffect(() => {
    if (boneYardDistSpec.distribute && deck) {
      setCanPlay(false);
      for (let i = 0; i < boneYardDistSpec.callbacks.length; i++) {
        const callback = boneYardDistSpec.callbacks[i];

        setTimeout(() => {
          let count = 0;
          const retrace = () => {
            count++;
            if (count <= boneYardDistSpec.drawAmount) {
              const randomTileRect = selectRandomTile();
              if (randomTileRect) callback(randomTileRect);
              else console.log("Couldn't pick a tile");
              setTimeout(retrace, 1000);
            } else {
              complete.current++;
              if (complete.current === boneYardDistSpec.callbacks.length) {
                setBoneYardDistSpec({
                  active: false,
                  distribute: false,
                  instant: false,
                  drawAmount: 0,
                  required: [],
                  callbacks: [],
                });
                if (firstPlayer === -2) {
                  console.log("First player", isTurn);
                  setFirstPlayer(isTurn ? playerId : playerId === 0 ? 1 : 0);
                }
                setCanPlay(true);
                setPermits([19, 10]);
              }
            }
          };
          retrace();
        }, 1000 + i * (1000 / boneYardDistSpec.callbacks.length));
      }
    } else if (boneYardDistSpec.instant && deck) {
      const randomTileRect = selectRandomTile();
      console.log(boneYardDistSpec.callbacks);
      // if (randomTileRect) boneYardDistSpec.callbacks[0](randomTileRect);
      // else console.log("Couldn't pick a tile");
      setBoneYardDistSpec({
        active: false,
        distribute: false,
        instant: false,
        drawAmount: 0,
        required: [],
        callbacks: [],
      });
    }
  }, [boneYardDistSpec]);

  const handleSelectTile = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const pickedTile = boneYardDistSpec.callbacks[0]([rect.x, rect.y]);
    console.log(pickedTile, boneYardDistSpec.callbacks);
    if (
      pickedTile?.tile.some((item) => boneYardDistSpec.required?.includes(item))
    ) {
      setBoneYardDistSpec({
        active: false,
        distribute: false,
        instant: false,
        drawAmount: 0,
        required: [],
        callbacks: [],
      });
    }
    setTiles((tile) => tile.map((item, i) => (i === index ? "picked" : item)));
    socket?.emit("pickFromBoneyard");
  };

  const selectRandomTile = () => {
    const parent = gridRef.current;
    if (parent) {
      const children = parent.children;
      const availiableIndices = tiles.reduce((indices, element, index) => {
        if (element === "unpicked") {
          indices.push(index);
        }
        return indices;
      }, [] as number[]);

      const randomIndex =
        availiableIndices[Math.floor(Math.random() * availiableIndices.length)];
      const randomChild = children[randomIndex];

      setTiles((prevArr) => {
        const newArr = [...prevArr];
        newArr[randomIndex] = "picked";
        return newArr;
      });

      if (randomChild) {
        const rect = randomChild.getBoundingClientRect();
        return [rect.x, rect.y] as numberPair;
      }
    }
  };

  return boneYardTranstion((style, _) => {
    return boneYardDistSpec.active ? (
      <animated.div
        className="absolute bottom-12 w-full h-64 bg-[#49596f] flex justify-center  "
        style={style}
      >
        <div
          ref={(el) => {
            gridRef.current = el;
          }}
          className="grid grid-cols-14 gap-1 auto-rows-min p-7"
        >
          {tiles.map((tile, index) => (
            <animated.div
              key={index}
              onClick={(e) =>
                !boneYardDistSpec.instant && handleSelectTile(e, index)
              }
              className={`h-16 w-8 ${
                tile === "picked" ? " opacity-60 pointer-events-none" : ""
              }`}
            >
              <DominoesTile tile={{ id: 0, tile: [0, 0] }} size="small" />
            </animated.div>
          ))}
        </div>
      </animated.div>
    ) : (
      <div />
    );
  });
}

export default BoneYard;
