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
})
