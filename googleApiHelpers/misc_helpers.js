async function n2a(n) {
    let letters = "";
    while (n > 0) {
      n -= 1;
      letters = String.fromCharCode(n % 26 + 65) + letters;
      n = Math.floor(n / 26);
    }
    return letters.toUpperCase();
  }

  async function a2n(a) {
    let n = 0;
    for (let i = 0; i < a.length; i++) {
      n = n * 26 + (a.toUpperCase().charCodeAt(i) - 64);
    }
    return n;
  }
  
  async function buildSheetRange(rangeValues, startCell = "A1") {
    const letterStart = startCell.match(/[a-zA-Z]+/)[0];
    const rowStart = parseInt(startCell.match(/\d+/)[0]);
  
    const rowsN = rangeValues.length;
    const columnsN = rangeValues[0].length;
  
    const letterEnd = await n2a(await a2n(letterStart) + columnsN - 1);
    const sheetRange = `${startCell}:${letterEnd}${rowsN + rowStart - 1}`.toUpperCase();
    return sheetRange;
  }
  
  

n2a(56).then((value)=> {console.log(value)});
a2n("bd").then((value)=> {console.log(value)});

vals = [['A', 'B'],
              ['C', 'D'],
              ['E', 'F']
              ]


buildSheetRange(vals, "b10").then((value)=> {console.log(value)});

module.exports = {n2a, a2n,buildSheetRange}