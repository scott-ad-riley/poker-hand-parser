const Street = require('../src/street')
const fs = require('fs')
const fileOneContents =
  'Dealt to rorrrr [2h Kd] \n\
Egar7495: raises $0.04 to $0.06 \n\
Ehrenmann31: folds \n\
rorrrr: calls $0.04'

let street
describe('File One', () => {
  beforeEach(() => (street = new Street(fileOneContents)))

  test('parses out the players who folded in a hand', () => {
    expect(street.folds()).toEqual(['Ehrenmann31'])
  })

  test('parses out invested for specific player (rorrrr)', () => {
    expect(street.invested('rorrrr')).toEqual(4)
  })

  test('parses out invested for specific player (Egar7495)', () => {
    expect(street.invested('Egar7495')).toEqual(2)
  })
})

const fileTwoContents = 'rorrrr: bets $0.06\nRokep02: calls $0.06'

describe('File Two', () => {
  beforeEach(() => (street = new Street(fileTwoContents)))

  test('parses out the players who folded in a hand', () => {
    expect(street.folds()).toEqual([])
  })

  test('parses out invested for specific player (rorrrr)', () => {
    expect(street.invested('rorrrr')).toEqual(6)
  })

  test('parses out invested for specific player (Rokep02)', () => {
    expect(street.invested('Rokep02')).toEqual(6)
  })
})

const fileThreeContents =
  'Dealt to rorrrr [7s 9s]\n\
Rokep02: raises $0.04 to $0.06\n\
rorrrr: calls $0.05\n\
victor128422: folds'

describe('File Three', () => {
  beforeEach(() => (street = new Street(fileThreeContents)))

  test('parses out the players who folded in a hand', () => {
    expect(street.folds()).toEqual(['victor128422'])
  })

  test('parses out invested for specific player (rorrrr)', () => {
    expect(street.invested('rorrrr')).toEqual(5)
  })

  test('parses out invested for specific player (Rokep02)', () => {
    expect(street.invested('Rokep02')).toEqual(2)
  })
})
