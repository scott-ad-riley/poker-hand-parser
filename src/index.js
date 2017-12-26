const cardsFromSet = require('./cards_from_set')

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

  startingCardAndName(handNumber = 0) {
    const lineData = this.parsedHands[handNumber]
      .find(line => line.startsWith('Dealt to '))
      .split('Dealt to ')[1]
    const name = lineData.substr(0, lineData.lastIndexOf('[') - 1)
    const hand = cardsFromSet(
      lineData.substr(lineData.lastIndexOf('['), lineData.length)
    )
    return { name, hand }
  }
}

module.exports = Parser
