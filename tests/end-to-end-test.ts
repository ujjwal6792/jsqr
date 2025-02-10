import * as fs from "fs-extra";
import * as path from "path";
import jsQR from "../src";
import { loadPng } from "../tests/helpers";
import * as helpers from "./helpers";

describe("end to end", async () => {
  const tests = fs
    .readdirSync(path.join("tests", "end-to-end"))
    .filter((n) => !n.includes("."));
  for (const t of tests) {
    it(t, async () => {
      const inputImage = await helpers.loadPng(
        path.join("tests", "end-to-end", t, "input.png"),
      );
      const expectedOutput = JSON.parse(
        await fs.readFile(
          path.join("tests", "end-to-end", t, "output.json"),
          "utf8",
        ),
      );
      const out = jsQR(inputImage.data, inputImage.width, inputImage.height);

      printQRCode(out.matrix);
      // expect(
      //   jsQR(inputImage.data, inputImage.width, inputImage.height),
      // ).toEqual(expectedOutput);
    });
  }
});

function printQRCode(matrix) {
  const width = matrix.width;
  const height = matrix.height;
  const data = matrix.data;
  let show = "";
  const showArr: any = [];
  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      row += data[index] ? "1" : "0"; // Use '██' for 1 and '  ' for 0
    }
    show = show + "\n" + row;
    showArr.push(row);
    const string = "1111100111000010111010010000100100000000000101011";
    if (y < 1) {
      console.log(
        `${y + 1} seqr hash match: `,
        string == showArr[y].slice(8, -8),
      );
    }
    if (y === height - 1) {
      console.log(show);
    }
  }
}
