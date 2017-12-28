const Table = require('../')
const fs = require('fs')
const fileContents = fs.readFileSync(
  __dirname + '/fixtures/tournament_chips.txt',
  'utf8'
)

let table
describe('standard chips game', () => {
  beforeEach(() => (table = new Table(fileContents)))

  test('can determine the correct currency for the game', () => {
    expect(table.currency()).toBe('chips')
  })

  test('correctly determines if the game is a tournament game', () => {
    expect(table.isTournament()).toBe(true)
  })

  test('correctly determines the pot after a hand', () => {
    expect(table.heroStackSize(0)).toEqual({ start: 535, end: 0 })
  })
})
