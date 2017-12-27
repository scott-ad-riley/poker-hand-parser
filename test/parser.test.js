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
  expect(parser.heroName()).toBe('rorrrr')
})

test('can fetch our hand for the first hand', () => {
  const parser = new Parser(testFileContents)
  expect(parser.heroHand()).toEqual([
    { number: 'J', suit: 'c' },
    { number: '7', suit: 's' }
  ])
})

test('can fetch our hand for a specific hand', () => {
  const parser = new Parser(testFileContents)
  expect(parser.heroHand(3)).toEqual([
    { number: '2', suit: 's' },
    { number: '7', suit: 'd' }
  ])
})

test('can fetch our own pot size at the start and end for the first hand', () => {
  const parser = new Parser(testFileContents)
  expect(parser.heroPotSize()).toEqual({
    start: 200,
    end: 202
  })
})

test('can fetch our own pot size at the start and end for a specific hand', () => {
  const parser = new Parser(testFileContents)
  expect(parser.heroPotSize(2)).toEqual({
    start: 202,
    end: 204
  })
})

test('can fetch the hand pot size at the end', () => {
  const parser = new Parser(testFileContents)
  expect(parser.potSize(0)).toEqual(2)
})
