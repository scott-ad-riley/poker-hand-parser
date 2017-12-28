const cardsFromSet = require('./cards_from_set')
const extractMoney = require('./money_inside_brackets')
const Street = require('./street')

const HAND_SPLIT_PATTERN = '\n\n\n\n'

const HOLE_LABEL = '*** HOLE CARDS ***'
const FLOP_LABEL = '*** FLOP ***'
const TURN_LABEL = '*** TURN ***'
const RIVER_LABEL = '*** RIVER ***'

class Parser {
  constructor(fileContents) {
    this.fileContents = fileContents
    const rawDataLines = this.fileContents.split(HAND_SPLIT_PATTERN)
    this.parsedHands = rawDataLines
      .slice(0, rawDataLines.length - 1)
      .map(hand => hand.split('\n').map(line => line.trim()))
  }

  // public methods

  handCount() {
    return this.parsedHands.length
  }

  currency() {
    return this._currency || this.storeCurrency()
  }

  isTournament() {
    return this.parsedHands[0][0].includes('Tournament')
  }

  heroName() {
    return this._name || this.storeName()
  }

  heroHand(handNumber = 0) {
    return this.startingCards(handNumber)
  }

  potSize(handNumber = 0) {
    const potData = this.parsedHands[handNumber].find(row =>
      row.startsWith('Total pot ')
    )
    const field = potData.split('Total pot ')[1].split(' |')[0]
    return extractMoney(field)
  }

  heroStackSize(handNumber = 0) {
    const [startingSeatRow, endSeatRow] = this.heroSeatRow(handNumber)
    const start = this.potFromRow(startingSeatRow)
    if (this.isTournament() && this.heroOutAt(handNumber)) {
      return {
        start,
        end: 0
      }
    }
    let loss = 0,
      winnings = 0
    if (this.heroLostHand(handNumber)) {
      loss = this.heroInvestment(handNumber)
    } else {
      winnings = this.potFromRow(endSeatRow)
    }

    return {
      start,
      end: start - loss + winnings
    }
  }

  heroInvestment(handNumber = 0) {
    let bigBlindAmount = 0
    let smallBlindAmount = 0
    const bigBlind = this.bigBlind(handNumber)
    const smallBlind = this.smallBlind(handNumber)
    if (bigBlind.isHero) bigBlindAmount = bigBlind.value
    if (smallBlind.isHero) smallBlindAmount = smallBlind.value

    const hole = new Street(this.streetContent(HOLE_LABEL, handNumber))
    const flop = new Street(this.streetContent(FLOP_LABEL, handNumber))
    const turn = new Street(this.streetContent(TURN_LABEL, handNumber))
    const river = new Street(this.streetContent(RIVER_LABEL, handNumber))

    return (
      bigBlindAmount +
      smallBlindAmount +
      hole.invested(this.heroName()) +
      flop.invested(this.heroName()) +
      turn.invested(this.heroName()) +
      river.invested(this.heroName())
    )
  }

  bigBlind(handNumber = 0) {
    return this.blindRow(' posts big blind ', handNumber)
  }

  smallBlind(handNumber = 0) {
    return this.blindRow(' posts small blind ', handNumber)
  }

  // private/internal methods

  blindRow(pattern, handNumber) {
    const smallBlindRow = this.parsedHands[handNumber].find(row =>
      row.includes(pattern)
    )
    const name = smallBlindRow.split(`:${pattern}`)[0]
    return {
      name,
      value: extractMoney(smallBlindRow.split(pattern)[1]),
      isHero: name === this.heroName()
    }
  }

  streetContent(streetLabel, handNumber) {
    const start = this.parsedHands[handNumber].findIndex(row =>
      row.startsWith(streetLabel)
    )
    const end = this.parsedHands[handNumber]
      .slice(start + 1)
      .findIndex(row => row.startsWith('***'))
    return this.parsedHands[handNumber]
      .slice(start + 1, start + 1 + end)
      .join('\n')
  }

  potFromRow(row) {
    const matches = row.match(/(\([^\)]+\))/g)
    const rawField = matches[matches.length - 1]
    return extractMoney(rawField)
  }

  startingCards(handNumber) {
    const lineData = this.heroHandDealt(handNumber)
    const hand = cardsFromSet(
      lineData.substr(lineData.lastIndexOf('['), lineData.length)
    )
    return hand
  }

  storeName(lineData) {
    if (this._name) return this._name
    if (lineData === undefined) lineData = this.heroHandDealt(0)
    this._name = lineData.substr(0, lineData.lastIndexOf('[') - 1)
    return this._name
  }

  storeCurrency() {
    if (this._currency) return this._currency
    const rowData = this.parsedHands[0].find(row => row.startsWith('Seat '))
    if (rowData.includes('($')) {
      this._currency = '$'
    } else {
      this._currency = 'chips'
    }
    return this._currency
  }

  heroHandDealt(handNumber) {
    return this.parsedHands[handNumber]
      .find(line => line.startsWith('Dealt to '))
      .split('Dealt to ')[1]
  }

  heroLostHand(handNumber) {
    /*
      else find all rows beginning with seat and hero's name
        determine if they include "collected" or "and won" (create another test for the latter)
    */
    const finalSeatRow = this.parsedHands[handNumber].filter(
      row => row.includes('Seat ') && row.includes(this.heroName())
    )[1]
    return !finalSeatRow.includes('collected') // && !finalSeatRow.includes('and won')
  }

  heroOutAt(handNumber) {
    return this.parsedHands[handNumber].some(row =>
      row.startsWith(`${this.heroName()} finished the tournament in`)
    )
  }

  heroSeatRow(handNumber) {
    return this.parsedHands[handNumber].filter(
      row => row.startsWith('Seat ') && row.includes(this.heroName())
    )
  }
}

module.exports = Parser
