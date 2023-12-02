import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const readStream = createReadStream("./2023/js/day-2/input", "utf8");

const colorMax = {
  red: 12,
  green: 13,
  blue: 14,
};

const parseLine = (line) => {
  const [game, values] = line.split(": ");
  const [_, gameId] = game.split(" ");
  const games = values.split("; ");
  const parsedGames = games.map((el) => {
    const results = el.split(", ");
    const obj = {};
    results.forEach((el) => {
      const [count, color] = el.split(" ");
      obj[color] = Number(count);
    });
    return obj;
  });
  return { gameId: Number(gameId), games: parsedGames };
};

// Part 1
const filteredGames = ({ gameId, games }) => {
  let result = true;
  games.forEach((game) => {
    Object.entries(game).forEach(([color, count]) => {
      if (count > colorMax[color]) {
        result = false;
      }
    });
  });
  return result ? gameId : 0;
};

// Part 2
const powerGame = ({ games }) => {
  const countMaxColor = { red: 1, green: 1, blue: 1 };
  games.forEach((game) => {
    Object.entries(game).forEach(([color, count]) => {
      if (count > countMaxColor[color]) {
        countMaxColor[color] = count;
      }
    });
  });
  return Object.values(countMaxColor).reduce((acc, el) => acc * el, 1);
};

async function main() {
  const rl = createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });
  let counter = 0;
  let powerCounter = 0;
  for await (const line of rl) {
    const game = parseLine(line);
    const result = filteredGames(game);
    counter += result;
    const power = powerGame(game);
    powerCounter += power;
  }
  console.log("part1-->>", counter);
  console.log("part2-->>", powerCounter);
}
main();
