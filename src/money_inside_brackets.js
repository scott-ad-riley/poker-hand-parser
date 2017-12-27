module.exports = function(field) {
  const money = field
    .replace('(', '')
    .replace(')', '')
    .split(' ')[0]
  if (money[0] === '$') return Number(money.slice(1)) * 100
  return Number(money)
}
