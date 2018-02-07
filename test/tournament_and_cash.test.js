const Table = require('../')
const fs = require('fs')
const tournyExample = fs.readFileSync(
  __dirname + '/fixtures/tournament_chips.txt',
  'utf8'
)
const cashExample = fs.readFileSync(
  __dirname + '/fixtures/standard_dollars.txt',
  'utf8'
)
const zoomExample = fs.readFileSync(__dirname + '/fixtures/zoom.txt', 'utf8')

let table
describe('standard chips game', () => {
  beforeEach(() => (table1 = new Table(tournyExample)))
  beforeEach(() => (table2 = new Table(cashExample)))
  beforeEach(() => (table3 = new Table(zoomExample)))

  test('can determine the correct currency for the game', () => {
    expect(table1.currency()).toBe('chips')
    expect(table3.currency()).toBe('$')
  })

  test('correctly determines if the game is a tournament game', () => {
    expect(table1.isTournament()).toBe(true)
    expect(table3.isTournament()).toBe(false)
  })

  test('correctly determines the heros stacksize after a hand', () => {
    expect(table1.heroStackSize(0)).toEqual({ start: 535, end: 0 })
    expect(table3.heroStackSize(0)).toEqual({ start: 160, end: 171 })
  })

  test('can determine tournament id if table is tournament', () => {
    expect(table1.tournamentID(0)).toEqual(2154443950)
    expect(table2.tournamentID(0)).toEqual(null)
    expect(table3.tournamentID(0)).toEqual(null)
  })

  test('can determine tournament buyin if table is tournament', () => {
    expect(table1.tournamentBuyin(0)).toEqual('$3.32+$0.18')
    expect(table2.tournamentBuyin(0)).toEqual(null)
    expect(table2.tournamentBuyin(1)).toEqual(null)
  })

  test('can determine handID for tourny or cash', () => {
    expect(table1.handID(0)).toEqual(179581295772)
    expect(table2.handID(0)).toEqual(179821215821)
    expect(table2.handID(1)).toEqual(179821224679)
    expect(table3.handID(0)).toEqual(181903852428)
  })

  test('can fetch the pot size for cash or tourny hand', () => {
    expect(table1.potSize(0)).toEqual(1070)
    expect(table2.potSize(0)).toEqual(2)
    expect(table2.potSize(1)).toEqual(26)
  })

  test('can determine date and time of tourny or cash hand', () => {
    expect(table1.dateAndTime(0)).toEqual('2017/12/15 11:22:27 ET')
    expect(table2.dateAndTime(0)).toEqual('2017/12/20 16:41:08 ET')
    expect(table2.dateAndTime(1)).toEqual('2017/12/20 16:41:20 ET')
  })

  test('can determine if seat is occupied who is in it', () => {
    expect(table1.seatOccupant(0, 1)).toEqual('rorrrr')
    expect(table1.seatOccupant(0, 2)).toEqual('TIGERPAPA')
    expect(table1.seatOccupant(0, 9)).toEqual(null)
    expect(table2.seatOccupant(0, 1)).toEqual(null)
    expect(table2.seatOccupant(1, 2)).toEqual('rorrrr')
    expect(table2.seatOccupant(2, 8)).toEqual('Rokep02')
  })

  test('can determine seat number of button', () => {
    expect(table1.buttonSeat(0)).toEqual(1)
    expect(table2.buttonSeat(0)).toEqual(3)
    expect(table2.buttonSeat(1)).toEqual(8)
  })

  test('can determine seat number of small blind', () => {
    expect(table1.smallBlind(0).seatNumber).toEqual(1)
    expect(table2.smallBlind(0).seatNumber).toEqual(8)
    expect(table2.smallBlind(1).seatNumber).toEqual(2)
  })

  test('can determine seat number of big blind', () => {
    expect(table1.bigBlind(0).seatNumber).toEqual(2)
    expect(table2.bigBlind(0).seatNumber).toEqual(2)
    expect(table2.bigBlind(1).seatNumber).toEqual(3)
  })

  test('can determine game type of hand', () => {
    expect(table1.gameType(0)).toEqual("Hold'em No Limit")
  })

  test('can determine table name of hand', () => {
    expect(table1.tableName(0)).toEqual('2154443950')
    expect(table2.tableName(0)).toEqual('Feodosia')
  })

  test('can determine table description for a hand', () => {
    expect(table1.tableDescription(0)).toEqual("$3.50 USD Hold'em No Limit")
    expect(table2.tableDescription(0)).toEqual(
      "Hold'em No Limit ($0.01/$0.02 USD)"
    )
    expect(table3.tableDescription(0)).toEqual(
      "Zoom - Hold'em No Limit ($0.01/$0.02)"
    )
  })

  test('can determine table description for a hand', () => {
    expect(table1.tableSize(0)).toEqual('Heads Up')
    expect(table2.tableSize(0)).toEqual('9-max')
    expect(table3.tableSize(0)).toEqual('6-max')
  })
})
