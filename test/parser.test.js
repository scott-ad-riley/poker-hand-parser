const Parser = require('../')
const fs = require('fs')
const testFileContents = fs.readFileSync(
  __dirname +
    "/fixtures/HH20171220 Feodosia - $0.01-$0.02 - USD No Limit Hold'em.txt",
  'utf8'
)

test('can count the number of hands in a file', () => {
  const parser = new Parser(testFileContents)
  expect(parser.handCount()).toBe(7)
})

test('can return the correct player of the game', () => {
  const parser = new Parser(testFileContents)
  expect(parser.ownPlayer()).toBe('rorrrr')
})

test('can fetch our hand for a specific game', () => {
  const parser = new Parser(testFileContents)
  expect(parser.ownHand(1)).toEqual([
    { number: 'J', suit: 'c' },
    { number: '7', suit: 's' }
  ])
})
