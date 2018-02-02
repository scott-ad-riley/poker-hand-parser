module.exports = function(untalliedDescription) {
  let currency = untalliedDescription.charAt(0)

  let buyinWithRake = untalliedDescription.split(' ')[0]

  let talliedBuyin = eval(buyinWithRake.split(currency).join('')).toFixed(2)

  var buyinLessArray = untalliedDescription.split(' ')
  buyinLessArray.shift()
  var buyinLessString = buyinLessArray.join(' ')

  console.log(buyinLessString)

  return currency + talliedBuyin + ' ' + buyinLessString
}
