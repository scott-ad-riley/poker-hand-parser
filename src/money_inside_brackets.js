module.exports = function(field) {
  let money = field
    .replace('(', '')
    .replace(')', '')
    .split(' ')[0]
  if (money[0] === '$') {
    money = money.replace('$', '')
    if (!money.includes('.')) {
      money += '00'
    } else {
      money = money.replace('.', '')
    }
  }
  return Number(money)
}
