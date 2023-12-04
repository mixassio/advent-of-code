import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

// const readStream = createReadStream("./2023/js/day-3/input_short", "utf8");
const readStream = createReadStream("./2023/js/day-3/input", "utf8");
// const readStream = createReadStream("./2023/js/day-3/input_example", "utf8");

class ParseLine {
  constructor(prevPosibleNumbers, prevChars) {
    this.prevPosibleNumbers = prevPosibleNumbers;
    this.prevChars = prevChars;

    this.state = "value";
    this.count = 0;

    this.currentPosibleNumbers = {};
    this.currentChars = [];

    this.currentNumber = "";
    this.currentNumberIdx = [];
  }

  feed(char, idx) {
    switch (this.state) {
      case "value":
        if (!isNaN(Number(char))) {
          // число
          this.state = "number";
          this.currentNumber += char;
          this.currentNumberIdx.push(idx - 1); // добавляем для поиска в интервале
          this.currentNumberIdx.push(idx);
          break;
        }
        if (char === ".") {
          break;
        }
        // отстались управляющие символы
        this.currentChars.push(idx);
        // проверить кандидатов с предыдущей строки
        Object.entries(this.prevPosibleNumbers).forEach(([key, value]) => {
          if (key.split(",").map(Number).includes(idx)) {
            // console.log("--success3-->>>>", key);
            this.count += Number(value);
            delete this.prevPosibleNumbers[key];
          }
        });
        break;
      case "number":
        // console.log(this.currentNumber, idx, char, this.currentPosibleNumbers);
        if (!isNaN(Number(char))) {
          // число
          this.currentNumber += char;
          this.currentNumberIdx.push(idx);
          break;
        }
        if (char === ".") {
          // точка
          this.state = "value";
          this.currentNumberIdx.push(idx);
          // проверяем был ли символ перед числом
          if (
            this.currentNumberIdx.filter((x) => this.currentChars.includes(x))
              .length > 0
          ) {
            // console.log("--success1-->>>>", this.currentNumber);
            this.count += Number(this.currentNumber);
            this.currentNumber = "";
            this.currentNumberIdx = [];
            break;
          }
          // проверяем символы рядом в предыдущей строке
          if (
            this.currentNumberIdx.filter((x) => this.prevChars.includes(x))
              .length > 0
          ) {
            // console.log("--success2-->>>>", this.currentNumber);
            this.count += Number(this.currentNumber);
            this.currentNumber = "";
            this.currentNumberIdx = [];
            break;
          }
          // суем в кандидаты, для проверке в следующей строке
          // дичь, но это нужно если два одинаковых числа на текущей строке не уходят, а на следующей уходят
          this.currentPosibleNumbers[this.currentNumberIdx] =
            this.currentNumber;
          this.currentNumber = "";
          this.currentNumberIdx = [];
          break;
        }

        if (isNaN(Number(char))) {
          // управляющий символ
          this.currentChars.push(idx);
          // проверить кандидатов с предыдущей строки
          Object.entries(this.prevPosibleNumbers).forEach(([key, value]) => {
            if (key.split(",").map(Number).includes(idx)) {
              //   console.log("--success39-->>>>", key);
              this.count += Number(value);
              delete this.prevPosibleNumbers[key];
            }
          });
          //   console.log("success4-->", this.currentNumber);
          this.count += Number(this.currentNumber);
          this.currentNumber = "";
          this.currentNumberIdx = [];
          this.state = "value";
          break;
        }
        throw new Error(`unknown char ${char}`);
      default:
        throw new Error(`unknown state ${this.state}`);
    }
  }

  parse(line) {
    Array.from(`.${line}.`).forEach((char, idx) => this.feed(char, idx));
    return {
      count: this.count,
      newPosibleNumbers: { ...this.currentPosibleNumbers },
      newPrevChars: [...this.currentChars],
    };
  }
}

async function main() {
  const rl = createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });
  let counter = 0;
  let posibleNumbers = {};
  let prevChars = [];
  for await (const line of rl) {
    const parser = new ParseLine(posibleNumbers, prevChars);
    const { count, newPosibleNumbers, newPrevChars } = parser.parse(line);
    counter += count;
    posibleNumbers = { ...newPosibleNumbers };
    prevChars = [...newPrevChars];
  }
  console.log("part1-->>", counter);
}
main();
