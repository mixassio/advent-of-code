import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const readStream = createReadStream("./2023/js/day-4/input_short", "utf8");
// const readStream = createReadStream("./2023/js/day-4/input", "utf8");

const part1 = (win, my) => {
  const res = my.filter((x) => win.includes(x));
  return res.length;
};

async function main() {
  const rl = createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  let result1 = 0;
  const resultcurrent = [];
  let part2 = 0;
  for await (const line of rl) {
    console.log(line);
    console.log("resultcurrent", resultcurrent);
    const [box1, box2] = line.replace(/  +/g, " ").split(" | ");
    const [_, win] = box1.split(": ");
    const winnerNumbers = win.split(" ").map(Number);
    const mayNumbers = box2.split(" ").map(Number);
    const countWin = part1(winnerNumbers, mayNumbers);
    if (countWin > 0) {
      const sum1 = 2 ** (countWin - 1);
      result1 += sum1;
    }
    part2++;
    const a = resultcurrent.filter((x) => x.length > 0).length;
    for (let i = 0; i < a; i++) {
      resultcurrent.forEach((x) => {
        if (x.pop()) {
          part2 += 1;
        }
      });
    }
    console.log("countWin", countWin);
    resultcurrent.push(Array(countWin).fill(1));
    console.log("part2-->", part2);
  }
  console.log("result1", result1); // 20107
  console.log("part2", part2);
}

main();
