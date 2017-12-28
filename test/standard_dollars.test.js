const Parser = require('../')
const fs = require('fs')
const fileContents = fs.readFileSync(
  __dirname + '/fixtures/standard_dollars.txt',
  'utf8'
)

let parser
describe('standard dollars game', () => {
  beforeEach(() => (parser = new Parser(fileContents)))

  test('can count the number of hands in a file', () => {
    expect(parser.handCount()).toBe(7)
  })

  test('can determine the correct currency for the game', () => {
    expect(parser.currency()).toBe('$')
  })

  test('correctly determines if the game is a tournament game', () => {
    expect(parser.isTournament()).toBe(false)
  })

  test('can return the correct player of the game', () => {
    expect(parser.heroName()).toBe('rorrrr')
  })

  test('can fetch the hero hand for the first hand', () => {
    expect(parser.heroHand()).toEqual([
      { number: 'J', suit: 'c' },
      { number: '7', suit: 's' }
    ])
  })

  test('can fetch the hero hand for a specific hand', () => {
    expect(parser.heroHand(3)).toEqual([
      { number: '2', suit: 's' },
      { number: '7', suit: 'd' }
    ])
  })

  test('can fetch our own stack size before and after the first hand', () => {
    expect(parser.heroStackSize()).toEqual({
      start: 200,
      end: 202
    })
  })

  test('can fetch our own stack size before and after a specific hand', () => {
    expect(parser.heroStackSize(2)).toEqual({
      start: 202,
      end: 204
    })
  })

  test('can fetch our own stack size for a hand where we do not win the pot', () => {
    expect(parser.heroStackSize(5)).toEqual({
      start: 202,
      end: 196
    })
  })

  test('can determine the small blind for the first hand', () => {
    expect(parser.smallBlind()).toEqual({
      name: 'Rokep02',
      value: 1,
      isHero: false
    })
  })

  test('can determine the big blind for the first hand', () => {
    expect(parser.bigBlind()).toEqual({
      name: 'rorrrr',
      value: 2,
      isHero: true
    })
  })

  test('can determine the small blind for a specific hand', () => {
    expect(parser.smallBlind(3)).toEqual({
      name: 'rorrrr',
      value: 1,
      isHero: true
    })
  })

  test('can determine the big blind for a specific hand', () => {
    expect(parser.bigBlind(3)).toEqual({
      name: 'Egar7495',
      value: 2,
      isHero: false
    })
  })

  test('can fetch the heros investment for the first hand', () => {
    expect(parser.heroInvestment()).toEqual(2)
  })

  test('can fetch the heros investment for a complex hand', () => {
    expect(parser.heroInvestment(1)).toEqual(12)
  })

  test('can fetch the hand pot size at the end of a hand', () => {
    expect(parser.potSize(0)).toEqual(2)
  })
})
