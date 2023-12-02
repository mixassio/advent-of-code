import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const readStream = createReadStream("./2023/js/day-1/input", "utf8");

const parseLine = (line) => {
  const digitals = Array.from(line).filter((el) => !isNaN(Number(el)));
  const first = digitals[0];
  const last = digitals[digitals.length - 1];
  console.log("part1-->>", line, "=>", digitals, Number(`${first}${last}`));
  return Number(`${first}${last}`);
};

const parseLine2 = (line) => {
  const mapper = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };
  const result = [];
  let current = line;
  while (current.length > 0) {
    if (!isNaN(Number(current[0]))) {
      result.push(current[0]);
      current = current.slice(1);
    } else {
      let success = "";
      Object.entries(mapper).forEach(([key, value]) => {
        if (current.startsWith(key)) {
          result.push(value);
          success = key;
        }
      });
      if (success) {
        current = current.slice(success.length);
      } else {
        current = current.slice(1);
      }
    }
  }
  // нужно для случаев pksixseven9vthrzfouroneightlvr - последняя должна быть 8, а не 1
  const resultReverse = [];
  let currentReverse = [...line].reverse().join("");
  while (currentReverse.length > 0) {
    if (!isNaN(Number(currentReverse[0]))) {
      resultReverse.push(currentReverse[0]);
      currentReverse = currentReverse.slice(1);
    } else {
      let success = "";
      Object.entries(mapper).forEach(([key, value]) => {
        if (currentReverse.startsWith([...key].reverse().join(""))) {
          resultReverse.push(value);
          success = key;
        }
      });
      if (success) {
        currentReverse = currentReverse.slice(success.length);
      } else {
        currentReverse = currentReverse.slice(1);
      }
    }
  }

  const first = result[0];
  const last = resultReverse[0];
  console.log(
    "part2-->>",
    line,
    "=>",
    result,
    resultReverse,
    Number(`${first}${last}`)
  );
  return Number(`${first}${last}`);
};

async function main() {
  const rl = createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });
  let result1 = 0;
  let result2 = 0;
  for await (const line of rl) {
    result1 += parseLine(line); // part #1
    result2 += parseLine2(line); // part #2
  }
  console.log("part #1:", result1); // part #1
  console.log("part #2:", result2); // part #2
}

main();
