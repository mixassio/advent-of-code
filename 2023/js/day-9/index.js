import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const readStream = createReadStream("./2023/js/day-9/input", "utf8");

const part1 = (input, current = 0, result = []) => {
  const currentArr = [];
  result[current] = [...input];
  for (let i = 0; i < input.length - 1; i++) {
    currentArr.push(input[i + 1] - input[i]);
  }
  result[current + 1] = currentArr;
  if (currentArr.filter((x) => x !== 0).length !== 0) {
    part1(currentArr, current + 1, result);
  }
  return result;
};

async function main() {
  const rl = createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });
  let resPart11 = 0;
  let resPart12 = 0;

  for await (const line of rl) {
    console.log(line);
    const input = line.split(" ").map(Number);
    console.log("---------");
    // console.log(part1(input).reverse());
    const result = part1(input).reverse();

    const res1 = result.reduce((acc, el) => {
      const last = el.pop();
      return acc + last;
    }, 0);
    resPart11 += res1;

    const res2 = result.reduce((acc, el) => {
      const first = el.shift();
      return first - acc;
    }, 0);
    resPart12 += res2;
  }
  console.log("part1", resPart11);
  console.log("part2", resPart12);
}

main();
