//TODO:
// Use the odds to make sure we can be fully hedged"
// Make the bets"
// Repeat
// logic to manage the wallets balance, make sure its sufficient etc etc
// maybe play with units of the total balance like pro sports betters do.
require("dotenv").config();
import { provider, minimumInterval, games } from "./utils/constants";
import { BigNumber } from "ethers";
import { gameData, KeepAliveParams, logEvent, Site } from "./types";
import { getBetsData } from "./utils/utils";
let gamesCache: Array<gameData> = [];

const updateCache = (game: gameData) => {
  if (gamesCache.length < 2) {
    gamesCache.push(game);
  } else {
    gamesCache.shift();
    gamesCache.push(game);
  }

  console.log("Cache updated:");
  console.log(JSON.stringify(gamesCache));
};
//TODO: calculate how your bet will move the ratios
//TODO: save them into a json

const setTimeouts = async (game1: gameData, game2: gameData) => {
  setTimeout(async () => {
    const [total, bear, bull] = await getBetsData(game1);
    const game1BearRatio = total / bear;
    const game1BullRatio = total / bull;
    console.log(`Game1: Bear=${game1BearRatio}, Bull=${game1BullRatio}`);

    const [total2, bear2, bull2] = await getBetsData(game2);
    const game2BearRatio = total2 / bear2;
    const game2BullRatio = total2 / bull2;
    console.log(
      `Game2 (bet time): Bear=${game2BearRatio}, Bull=${game2BullRatio}`
    );
  }, 295000 - (Date.now() - game1.timeStarted));

  setTimeout(async () => {
    const [total, bear, bull] = await getBetsData(game2);
    const game2BearRatio = total / bear;
    const game2BullRatio = total / bull;
    console.log(
      `Game2 (final): Bear=${game2BearRatio}, Bull=${game2BullRatio}`
    );
  }, 295000 - (Date.now() - game2.timeStarted));
};

const playTheGame = async (game1: gameData, game2: gameData) => {
  if (!game1 || !game2) {
    console.error("Need to pass in two games...");
  } else {
    console.log("timers set");
    setTimeouts(game1, game2);
  }
};

const handleRoundStartEvent = (log: logEvent, site: Site) => {
  const [_, epochHex] = log.topics;
  const newGame: gameData = {
    site,
    activeEpoch: BigNumber.from(epochHex).toNumber(),
    timeStarted: Date.now(),
  };
  updateCache(newGame);
  //If both games have been captured at least once
  if (gamesCache.length == 2) {
    const [game1, game2] = gamesCache;
    const timeDifference = Math.abs(game1.timeStarted - game2.timeStarted);
    if (timeDifference <= minimumInterval) {
      gamesCache = [];
      playTheGame(game1, game2);
    }
  }
};

const keepAlive = ({
  provider,
  onDisconnect,
  expectedPongBack = 15000,
  checkInterval = 7500,
}: KeepAliveParams) => {
  let pingTimeout: NodeJS.Timeout | null = null;
  let keepAliveInterval: NodeJS.Timeout | null = null;

  provider._websocket.on("open", () => {
    keepAliveInterval = setInterval(() => {
      provider._websocket.ping();

      // Use `WebSocket#terminate()`, which immediately destroys the connection,
      // instead of `WebSocket#close()`, which waits for the close timer.
      // Delay should be equal to the interval at which your server
      // sends out pings plus a conservative assumption of the latency.
      pingTimeout = setTimeout(() => {
        provider._websocket.terminate();
      }, expectedPongBack);
    }, checkInterval);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider._websocket.on("close", (err: any) => {
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    if (pingTimeout) clearTimeout(pingTimeout);
    onDisconnect(err);
  });

  // Subscribe to events for each game site.
  games.map((game) => {
    provider.on(game.filter, (log: logEvent) => {
      handleRoundStartEvent(log, game.site);
    });
  });

  provider._websocket.on("pong", () => {
    if (pingTimeout) clearInterval(pingTimeout);
  });
};

const main = () => {
  console.log("Starting the binary options arbitrage bot");
  console.log(
    `Minimum Interval is set to ${Math.ceil(minimumInterval / 1000)} seconds.`
  );
  keepAlive({
    provider,
    onDisconnect: (err) => {
      main();
      console.error(
        "The ws connection was closed",
        JSON.stringify(err, null, 2)
      );
    },
  });
};

main();
