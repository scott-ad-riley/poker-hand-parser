module.exports = function(str) {
  const raw = str.replace(/\[|\]/g, '')
  const cardsData = raw.split(' ')
  const cards = cardsData.map(cardData => cardData.split(''))
  return cards.map(([number, suit]) => {
    return { number, suit }
  })
}
