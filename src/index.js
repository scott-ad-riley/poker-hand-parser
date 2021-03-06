const cardsFromSet = require('./cards_from_set')
const extractMoney = require('./money_inside_brackets')
const tallyBuyin = require('./tally_buyin')
const Street = require('./street')

const HAND_SPLIT_PATTERN = '\n\n\n\n'

const HOLE_LABEL = '*** HOLE CARDS ***'
const FLOP_LABEL = '*** FLOP ***'
const TURN_LABEL = '*** TURN ***'
const RIVER_LABEL = '*** RIVER ***'

class Table {
  constructor(fileContents) {
    this.fileContents = fileContents.replace(/\r/g, '')
    const rawDataLines = this.fileContents.split(HAND_SPLIT_PATTERN)
    this.parsedHands = rawDataLines.map(hand =>
      hand.split('\n').map(line => line.trim())
    )
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

  isZoom() {
    return this.parsedHands[0][0].includes('Zoom')
  }

  heroName() {
    return this._name || this.storeName()
  }

  heroHand(handNumber = 0) {
    return this.startingCards(handNumber)
  }

  tableName(handNumber = 0) {
    if (this.isTournament()) {
      return this.parsedHands[handNumber][1].split("'")[1].split(' ')[0]
    } else {
      return this.parsedHands[handNumber][1].split("'")[1]
    }
  }

  potSize(handNumber = 0) {
    const potData = this.parsedHands[handNumber].find(row =>
      row.startsWith('Total pot ')
    )
    const field = potData.split('Total pot ')[1].split(' |')[0]
    return extractMoney(field)
  }

  heroStackSize(handNumber = 0) {
    const [startingSeatRow, endSeatRow] = this.heroSeatRows(handNumber)
    const start = this.potFromRow(startingSeatRow)
    return {
      start
    }
  }

  handID(handNumber = 0) {
    return Number(this.parsedHands[handNumber][0].split('#')[1].split(':')[0])
  }

  tournamentID(handNumber = 0) {
    if (this.isTournament()) {
      return Number(this.parsedHands[0][0].split('#')[2].split(',')[0])
    } else {
      return null
    }
  }

  dateAndTime(handNumber = 0) {
    if (this.parsedHands[handNumber][0].includes('[')) {
      const handDetails = this.parsedHands[handNumber][0]
      var dateStartIndex = this.nthIndex(handDetails, '[', 1)
      var dateEndIndex = this.nthIndex(handDetails, ']', 1)
      return handDetails.substring(dateStartIndex + 1, dateEndIndex)
    } else {
      const handDetails = this.parsedHands[handNumber][0]
      return handDetails.split('- ')[handDetails.split('- ').length - 1]
    }
  }

  seatOccupant(handNumber = 0, seatNumber) {
    if (
      this.parsedHands[handNumber].find(line =>
        line.startsWith('Seat ' + seatNumber)
      ) != null
    ) {
      return this.parsedHands[handNumber]
        .find(line => line.startsWith('Seat ' + seatNumber + ':'))
        .split(' (')[0]
        .split(': ')[1]
    } else {
      return null
    }
  }

  buttonSeat(handNumber = 0) {
    const buttonLine = this.parsedHands[handNumber].find(line =>
      line.endsWith('is the button')
    )
    if (buttonLine != null) {
      return Number(buttonLine.split('#')[1].charAt(0))
    } else {
      return 0
    }
  }

  tournamentBuyin(handNumber = 0) {
    if (this.isTournament()) {
      return this.parsedHands[0][0].split(',')[1].split(' ')[1]
    } else {
      return null
    }
  }

  gameType(handNumber = 0) {
    if (this.parsedHands[handNumber][0].includes("Hold'em No Limit")) {
      return "Hold'em No Limit"
    } else {
      return 'Other'
    }
  }

  heroInvestment(handNumber = 0) {
    let bigBlindAmount = 0
    let smallBlindAmount = 0
    const bigBlind = this.bigBlind(handNumber)
    const smallBlind = this.smallBlind(handNumber)
    if (bigBlind.isHero) bigBlindAmount = bigBlind.value
    if (smallBlind.isHero) smallBlindAmount = smallBlind.value

    const { hole, flop, turn, river } = this.buildStreets(handNumber)

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
    return this.blindRow(' (big blind) ', handNumber)
  }

  smallBlind(handNumber = 0) {
    return this.blindRow(' (small blind) ', handNumber)
  }

  // private/internal methods

  nthIndex(string, character, occurence) {
    var L = string.length,
      i = -1
    while (occurence-- && i++ < L) {
      i = string.indexOf(character, i)
      if (i < 0) break
    }
    return i
  }

  seatNumberByName(handNumber = 0, name) {
    return Number(
      this.parsedHands[handNumber]
        .find(line => line.includes(name) && line.includes('Seat '))
        .split(' ')[1]
        .charAt(0)
    )
  }

  blindRow(pattern, handNumber) {
    const smallBlindRow = this.parsedHands[handNumber].find(row =>
      row.includes(pattern)
    )

    if (smallBlindRow != null) {
      const name = smallBlindRow
        .split(`${pattern}`)[0]
        .split(':')[1]
        .trim()
      const seatNumber = this.seatNumberByName(handNumber, name)
      return {
        name,
        isHero: name === this.heroName(),
        seatNumber: seatNumber
      }
    } else {
      return {
        name: null,
        isHero: null,
        seatNumber: 0
      }
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
    //// Razz bug
    if (this.parsedHands[handNumber][0].includes('Razz Limit')) {
      var array = this.parsedHands[handNumber]
      array.shift()
      return array
        .filter(line => line.includes('['))
        .sort(function(a, b) {
          return b.split('[').pop().length - a.split('[').pop().length
        })[0]
        .split('Dealt to ')[1]
    }
    //// 7cardStud Bug
    if (this.parsedHands[handNumber][0].includes('7 Card Stud Limit')) {
      var array = this.parsedHands[handNumber]
      array.shift()
      if (array.includes('*** 4th STREET ***')) {
        return array
          .slice(0, array.indexOf('*** 4th STREET ***'))
          .filter(line => line.includes('['))
          .sort(function(a, b) {
            return b.split('[').pop().length - a.split('[').pop().length
          })[0]
          .split('Dealt to ')[1]
      } else {
        return array
          .slice(0, array.indexOf('*** SUMMARY ***'))
          .filter(line => line.includes('['))
          .sort(function(a, b) {
            return b.split('[').pop().length - a.split('[').pop().length
          })[0]
          .split('Dealt to ')[1]
      }
    } else {
      return this.parsedHands[handNumber]
        .find(line => line.startsWith('Dealt to '))
        .split('Dealt to ')[1]
    }
  }

  heroLostHand(handNumber) {
    const row = this.finalSeatRow(handNumber)
    return !row.includes(' collected ') && !row.includes(' and won ')
  }

  heroSplitHand(handNumber) {
    const row = this.finalSeatRow(handNumber)
    return !row.includes(' collected ') && row.includes(' and won ')
  }

  finalSeatRow(handNumber) {
    return this.parsedHands[handNumber].filter(
      row => row.includes('Seat ') && row.includes(this.heroName())
    )[1]
  }

  heroOutAt(handNumber) {
    return this.parsedHands[handNumber].some(row =>
      row.startsWith(`${this.heroName()} finished the tournament in`)
    )
  }

  heroSeatRows(handNumber) {
    return this.parsedHands[handNumber].filter(
      row => row.startsWith('Seat ') && row.includes(this.heroName())
    )
  }

  buildStreets(handNumber) {
    const hole = new Street(this.streetContent(HOLE_LABEL, handNumber))
    const flop = new Street(this.streetContent(FLOP_LABEL, handNumber))
    const turn = new Street(this.streetContent(TURN_LABEL, handNumber))
    const river = new Street(this.streetContent(RIVER_LABEL, handNumber))
    return { hole, flop, turn, river }
  }

  sumUncalledBetsReturned(handNumber) {
    const { hole, flop, turn, river } = this.buildStreets(handNumber)
    return (
      hole.uncalledBetReturned(this.heroName()) +
      flop.uncalledBetReturned(this.heroName()) +
      turn.uncalledBetReturned(this.heroName()) +
      river.uncalledBetReturned(this.heroName())
    )
  }

  tableDescription(handNumber) {
    if (this.isTournament()) {
      if (this.parsedHands[0][0].split(',')[1].includes('Freeroll')) {
        return 'Freeroll'
      } else {
        const tournyDesc = tallyBuyin(
          this.parsedHands[0][0]
            .split(',')[1]
            .split('-')[0]
            .trim()
        )

        if (this.parsedHands[0][0].split(',')[1].includes('8-Game')) {
          const EightDesc = '8-Game'
          if (this.isZoom()) {
            return 'Zoom - ' + tournyDesc + '-Game'
          } else {
            {
              return tournyDesc + '-Game'
            }
          }
        }

        if (this.isZoom()) {
          if (
            this.parsedHands[0][0]
              .split(',')[1]
              .split('-')[0]
              .trim()
              .includes('HORSE')
          ) {
            return 'Zoom - ' + tournyDesc.split('(')[0].trim()
          } else {
            return 'Zoom - ' + tournyDesc
          }
        } else {
          if (
            this.parsedHands[0][0]
              .split(',')[1]
              .split('-')[0]
              .trim()
              .includes('HORSE')
          ) {
            return tournyDesc.split('(')[0].trim()
          } else {
            return tournyDesc
          }
        }
      }
    } else {
      const cashDesc = this.parsedHands[0][0]
        .split(':')[1]
        .split('-')[0]
        .trim()

      if (cashDesc == '8') {
        const EightDesc = '8-Game'
        if (this.isZoom()) {
          return 'Zoom - ' + EightDesc
        } else {
          return EightDesc
        }
      }

      if (this.isZoom()) {
        return 'Zoom - ' + cashDesc
      } else {
        return cashDesc
      }
    }
  }

  tableSize(handNumber = 0) {
    const tableSizeString = this.parsedHands[handNumber][1].split('-max')[0]

    if (tableSizeString.substr(tableSizeString.length - 1) == 2) {
      return 'Heads Up'
    } else if (tableSizeString.substr(tableSizeString.length - 1) == 3) {
      return '3-max'
    } else if (tableSizeString.substr(tableSizeString.length - 1) == 4) {
      return '4-max'
    } else if (tableSizeString.substr(tableSizeString.length - 1) == 5) {
      return '5-max'
    } else if (tableSizeString.substr(tableSizeString.length - 1) == 6) {
      return '6-max'
    } else if (tableSizeString.substr(tableSizeString.length - 1) == 7) {
      return '7-max'
    } else if (tableSizeString.substr(tableSizeString.length - 1) == 8) {
      return '8-max'
    } else if (tableSizeString.substr(tableSizeString.length - 1) == 9) {
      return '9-max'
    }
  }
}

module.exports = Table
