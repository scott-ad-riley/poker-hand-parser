const Table = require('../')
const fs = require('fs')
const fileContents = fs.readFileSync(
  __dirname + '/fixtures/standard_dollars.txt',
  'utf8'
)

let table
describe('standard dollars game', () => {
  beforeEach(() => (table = new Table(fileContents)))

  test('can count the number of hands in a file', () => {
    expect(table.handCount()).toBe(7)
  })

  test('can determine the correct currency for the game', () => {
    expect(table.currency()).toBe('$')
  })

  test('correctly determines if the game is a tournament game', () => {
    expect(table.isTournament()).toBe(false)
  })

  test('can return the correct player of the game', () => {
    expect(table.heroName()).toBe('rorrrr')
  })

  test('can fetch the hero hand for the first hand', () => {
    expect(table.heroHand()).toEqual([
      { number: 'J', suit: 'c' },
      { number: '7', suit: 's' }
    ])
  })

  test('can fetch the hero hand for a specific hand', () => {
    expect(table.heroHand(3)).toEqual([
      { number: '2', suit: 's' },
      { number: '7', suit: 'd' }
    ])
  })

  test('can fetch our own stack size before and after the first hand', () => {
    expect(table.heroStackSize()).toEqual({
      start: 200,
      end: 201
    })
  })

  test('can fetch our own stack size before and after a specific hand', () => {
    expect(table.heroStackSize(2)).toEqual({
      start: 202,
      end: 203
    })
  })

  test('can fetch our own stack size for a hand where we do not win the pot', () => {
    expect(table.heroStackSize(5)).toEqual({
      start: 202,
      end: 196
    })
  })

  test('can fetch our own stack size for a hand where the pot is split', () => {
    expect(table.heroStackSize(1)).toEqual({
      start: 201,
      end: 202
    })
  })

  test('can determine the small blind for the first hand', () => {
    expect(table.smallBlind()).toEqual({
      name: 'Rokep02',
      value: 1,
      isHero: false
    })
  })

  test('can determine the big blind for the first hand', () => {
    expect(table.bigBlind()).toEqual({
      name: 'rorrrr',
      value: 2,
      isHero: true
    })
  })

  test('can determine the small blind for a specific hand', () => {
    expect(table.smallBlind(3)).toEqual({
      name: 'rorrrr',
      value: 1,
      isHero: true
    })
  })

  test('can determine the big blind for a specific hand', () => {
    expect(table.bigBlind(3)).toEqual({
      name: 'Egar7495',
      value: 2,
      isHero: false
    })
  })

  test('can fetch the heros investment for the first hand', () => {
    expect(table.heroInvestment()).toEqual(2)
  })

  test('can fetch the heros investment for a complex hand', () => {
    expect(table.heroInvestment(1)).toEqual(12)
  })

  test('can fetch the hand pot size at the end of a hand', () => {
    expect(table.potSize(0)).toEqual(2)
  })
})
