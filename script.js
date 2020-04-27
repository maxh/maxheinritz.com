// Returns a semirandom "shuffled" array containing the elements in the
// input array, ordered in a way that's stable for today.
//
// (Come back tomorrow for something new!)
const shuffleForToday = inputArray => {
  const array = [...inputArray];
  const length = array.length;
  const semiRandomFactors = getSemiRandomFactorsForToday(length);

  let currentIndex = length;

  while (0 < currentIndex) {
    const semiRandomFactor = semiRandomFactors.pop();
    const randomIndex = Math.floor(semiRandomFactor * currentIndex);
    currentIndex -= 1;

    const temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// Returns an array of the provided length with numeric elements
// in the range [0, 1). The array will be the same each time this
// function is invoked on the same day.
//
// eg [0.2, 0.8, 0.4, ...]
const getSemiRandomFactorsForToday = length => {
  const date = new Date(Date.now());
  const d = date.getDate();
  const m = date.getMonth() + 1; // JS months are zero-indexed.
  const y = date.getFullYear();
  const unit = Math.abs(hashCode(`${d}${m}${y}`)).toString();
  const unitsNeeded = Math.ceil(length / unit.length);
  const str = unit.repeat(unitsNeeded).substring(0, length);
  return str.split("").map(v => v / 10);
};

// https://stackoverflow.com/a/8831937
const hashCode = str => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer.
  }
  return hash;
};
