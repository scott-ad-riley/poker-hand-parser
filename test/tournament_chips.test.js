const Parser = require('../')
const fs = require('fs')
const fileContents = fs.readFileSync(
  __dirname + '/fixtures/tournament_chips.txt',
  'utf8'
)

let parser
describe('standard chips game', () => {
  beforeEach(() => (parser = new Parser(fileContents)))

  test('can determine the correct currency for the game', () => {
    expect(parser.currency()).toBe('chips')
  })

  test('correctly determines if the game is a tournament game', () => {
    expect(parser.isTournament()).toBe(true)
  })

  test('correctly determines the pot after a hand', () => {
    expect(parser.heroStackSize(0)).toEqual({ start: 535, end: 0 })
  })
})
