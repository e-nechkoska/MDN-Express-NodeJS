const compareStrings = function(a, b) {
  let textA = a.toUpperCase();
  let textB = b.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
};

module.exports = compareStrings;
