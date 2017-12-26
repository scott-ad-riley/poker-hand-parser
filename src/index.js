const cardsFromSet = require('./cards_from_set')
const moneyInsideBrackets = require('./money_inside_brackets')

const HAND_SPLIT_PATTERN = '\n\n\n\n'

class Parser {
  constructor(fileContents) {
    this.fileContents = fileContents
    const rawDataLines = this.fileContents.split(HAND_SPLIT_PATTERN)
    this.parsedHands = rawDataLines
      .slice(0, rawDataLines.length - 1)
      .map(hand => hand.split('\n'))
  }

  handCount() {
    return this.parsedHands.length
  }

  ownPlayer() {
    const { name } = this.startingCardAndName()
    return name
  }

  ownHand(handNumber = 0) {
    const { hand } = this.startingCardAndName()
    return hand
  }

  potSize(handNumber = 0) {
    this.storeName()
    const potData = this.parsedHands[handNumber].find(row =>
      row.startsWith('Total pot ')
    )
    const field = potData.split('Total pot ')[1].split(' |')[0]
    return moneyInsideBrackets(field)
  }

  ownPotSize(handNumber = 0) {
    this.storeName()
    const seatsData = this.parsedHands[handNumber].filter(
      row => row.startsWith('Seat ') && row.includes(this.name)
    )
    const start = this.potFromRow(seatsData[0])
    const endGain = this.potFromRow(seatsData[1])
    return {
      start,
      end: start + endGain
    }
  }

  potFromRow(row) {
    const matches = row.match(/(\([^\)]+\))/g)
    const rawField = matches[matches.length - 1]
    return moneyInsideBrackets(rawField)
  }

  startingCardAndName(handNumber = 0) {
    const lineData = this.ownHandDealt(0)
    const name = lineData.substr(0, lineData.lastIndexOf('[') - 1)
    const hand = cardsFromSet(
      lineData.substr(lineData.lastIndexOf('['), lineData.length)
    )
    if (!this.name) this.name = name
    return { name, hand }
  }

  // easy way to cache the current player's name
  storeName(lineData = this.ownHandDealt(0)) {
    if (this.name) return this.name
    this.name = lineData.substr(0, lineData.lastIndexOf('[') - 1)
    return this.name
  }

  ownHandDealt(handNumber) {
    return this.parsedHands[handNumber]
      .find(line => line.startsWith('Dealt to '))
      .split('Dealt to ')[1]
  }
}

module.exports = Parser
