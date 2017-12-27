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

  // public methods

  handCount() {
    return this.parsedHands.length
  }

  heroName() {
    return this.name || this.storeName()
  }

  heroHand(handNumber = 0) {
    return this.startingCards(handNumber)
  }

  potSize(handNumber = 0) {
    const potData = this.parsedHands[handNumber].find(row =>
      row.startsWith('Total pot ')
    )
    const field = potData.split('Total pot ')[1].split(' |')[0]
    return moneyInsideBrackets(field)
  }

  heroPotSize(handNumber = 0) {
    const seatsData = this.parsedHands[handNumber].filter(
      row => row.startsWith('Seat ') && row.includes(this.heroName())
    )
    const start = this.potFromRow(seatsData[0])
    const endGain = this.potFromRow(seatsData[1])
    return {
      start,
      end: start + endGain
    }
  }

  // private/internal methods

  potFromRow(row) {
    const matches = row.match(/(\([^\)]+\))/g)
    const rawField = matches[matches.length - 1]
    return moneyInsideBrackets(rawField)
  }

  startingCards(handNumber = 0) {
    const lineData = this.heroHandDealt(handNumber)
    const hand = cardsFromSet(
      lineData.substr(lineData.lastIndexOf('['), lineData.length)
    )
    return hand
  }

  storeName(lineData) {
    if (this.name) return this.name
    if (lineData === undefined) lineData = this.heroHandDealt(0)
    this.name = lineData.substr(0, lineData.lastIndexOf('[') - 1)
    return this.name
  }

  heroHandDealt(handNumber) {
    return this.parsedHands[handNumber]
      .find(line => line.startsWith('Dealt to '))
      .split('Dealt to ')[1]
  }
}

module.exports = Parser
