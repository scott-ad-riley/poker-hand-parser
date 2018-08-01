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
const shootoutExample = fs.readFileSync(
  __dirname + '/fixtures/forcedAI.txt',
  'utf8'
)
const EightGameExample = fs.readFileSync(
  __dirname + '/fixtures/8game.txt',
  'utf8'
)

const EasternTime = fs.readFileSync(
  __dirname + '/fixtures/ETtimezone.txt',
  'utf8'
)

const StudExample = fs.readFileSync(__dirname + '/fixtures/stud.txt', 'utf8')

let table
describe('standard chips game', () => {
  beforeEach(() => (table1 = new Table(tournyExample)))
  beforeEach(() => (table2 = new Table(cashExample)))
  beforeEach(() => (table3 = new Table(zoomExample)))
  beforeEach(() => (table4 = new Table(shootoutExample)))
  beforeEach(() => (table5 = new Table(EightGameExample)))
  beforeEach(() => (table6 = new Table(StudExample)))
  beforeEach(() => (table7 = new Table(EasternTime)))

  test('can determine the correct currency for the game', () => {
    expect(table1.currency()).toBe('chips')
    expect(table3.currency()).toBe('$')
    expect(table4.currency()).toBe('chips')
    expect(table5.currency()).toBe('$')
    expect(table6.currency()).toBe('$')
    expect(table7.currency()).toBe('$')
  })

  test('correctly determines if the game is a tournament game', () => {
    expect(table1.isTournament()).toBe(true)
    expect(table3.isTournament()).toBe(false)
    expect(table4.isTournament()).toBe(true)
    expect(table5.isTournament()).toBe(false)
    expect(table6.isTournament()).toBe(false)
    expect(table7.isTournament()).toBe(false)
  })

  test('correctly determines the heros stacksize after a hand', () => {
    expect(table1.heroStackSize(0)).toEqual({ start: 535 })
    expect(table3.heroStackSize(0)).toEqual({ start: 160 })
    expect(table5.heroStackSize(0)).toEqual({ start: 400 })
    expect(table6.heroStackSize(0)).toEqual({ start: 400 })
    expect(table7.heroStackSize(0)).toEqual({ start: 1600 })
  })

  test('can determine tournament id if table is tournament', () => {
    expect(table1.tournamentID(0)).toEqual(2154443950)
    expect(table2.tournamentID(0)).toEqual(null)
    expect(table3.tournamentID(0)).toEqual(null)
    expect(table5.tournamentID(0)).toEqual(null)
    expect(table7.tournamentID(0)).toEqual(null)
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
    expect(table4.handID(0)).toEqual(182619506208)
    expect(table5.handID(0)).toEqual(182620493567)
    expect(table6.handID(0)).toEqual(182639671213)
    expect(table7.handID(0)).toEqual(185644075818)
  })

  test('can fetch the pot size for cash or tourny hand', () => {
    expect(table1.potSize(0)).toEqual(1070)
    expect(table2.potSize(0)).toEqual(2)
    expect(table2.potSize(1)).toEqual(26)
    expect(table4.potSize(0)).toEqual(1768)
    expect(table5.potSize(0)).toEqual(50)
    expect(table6.potSize(0)).toEqual(84)
    expect(table7.potSize(0)).toEqual(40)
  })

  test('can determine date and time of tourny or cash hand', () => {
    expect(table1.dateAndTime(0)).toEqual('2017/12/15 11:22:27 ET')
    expect(table2.dateAndTime(0)).toEqual('2017/12/20 16:41:08 ET')
    expect(table2.dateAndTime(1)).toEqual('2017/12/20 16:41:20 ET')
    expect(table7.dateAndTime(0)).toEqual('2018/04/24 22:43:10 ET')
    expect(table7.dateAndTime(1)).toEqual('2018/07/30 22:02:09 ET')
  })

  test('can determine if seat is occupied who is in it', () => {
    expect(table1.seatOccupant(0, 1)).toEqual('rorrrr')
    expect(table1.seatOccupant(0, 2)).toEqual('TIGERPAPA')
    expect(table1.seatOccupant(0, 9)).toEqual(null)
    expect(table2.seatOccupant(0, 1)).toEqual(null)
    expect(table2.seatOccupant(1, 2)).toEqual('rorrrr')
    expect(table2.seatOccupant(2, 8)).toEqual('Rokep02')
    expect(table6.seatOccupant(0, 1)).toEqual('rorrrr')
    expect(table7.seatOccupant(0, 1)).toEqual('Pitexx')
  })

  test('can determine seat number of button', () => {
    expect(table1.buttonSeat(0)).toEqual(1)
    expect(table2.buttonSeat(0)).toEqual(3)
    expect(table2.buttonSeat(1)).toEqual(8)
    expect(table4.buttonSeat(0)).toEqual(1)
    expect(table5.buttonSeat(0)).toEqual(3)
    expect(table6.buttonSeat(0)).toEqual(0)
  })

  test('can determine seat number of small blind', () => {
    expect(table1.smallBlind(0).seatNumber).toEqual(1)
    expect(table2.smallBlind(0).seatNumber).toEqual(8)
    expect(table2.smallBlind(1).seatNumber).toEqual(2)
    expect(table4.smallBlind(0).seatNumber).toEqual(1)
    expect(table5.smallBlind(0).seatNumber).toEqual(4)
    expect(table6.bigBlind(0).seatNumber).toEqual(0)
    expect(table6.bigBlind(0).name).toEqual(null)
  })

  test('can determine seat number of big blind', () => {
    expect(table1.bigBlind(0).seatNumber).toEqual(2)
    expect(table2.bigBlind(0).seatNumber).toEqual(2)
    expect(table2.bigBlind(1).seatNumber).toEqual(3)
    expect(table4.bigBlind(0).seatNumber).toEqual(4)
    expect(table5.bigBlind(0).seatNumber).toEqual(5)
    expect(table6.bigBlind(0).seatNumber).toEqual(0)
  })

  test('can determine game type of hand', () => {
    expect(table1.gameType(0)).toEqual("Hold'em No Limit")
    expect(table4.gameType(0)).toEqual("Hold'em No Limit")
    expect(table5.gameType(0)).toEqual('Other')
    expect(table6.gameType(0)).toEqual('Other')
    expect(table7.gameType(0)).toEqual("Hold'em No Limit")
  })

  test('can determine table name of hand', () => {
    expect(table1.tableName(0)).toEqual('2154443950')
    expect(table2.tableName(0)).toEqual('Feodosia')
    expect(table4.tableName(0)).toEqual('2222072970')
    expect(table5.tableName(0)).toEqual('Zerlina')
    expect(table6.tableName(0)).toEqual('Amalia II')
  })

  test('can determine table description for a hand', () => {
    expect(table1.tableDescription(0)).toEqual("$3.50 USD Hold'em No Limit")
    expect(table2.tableDescription(0)).toEqual(
      "Hold'em No Limit ($0.01/$0.02 USD)"
    )
    expect(table3.tableDescription(0)).toEqual(
      "Zoom - Hold'em No Limit ($0.01/$0.02)"
    )
    expect(table4.tableDescription(0)).toEqual("$1.00 USD Hold'em No Limit")
    expect(table5.tableDescription(0)).toEqual('8-Game')
    expect(table6.tableDescription(0)).toEqual(
      '7 Card Stud Limit ($0.10/$0.20 USD)'
    )
  })

  test('can determine table size for a hand', () => {
    expect(table1.tableSize(0)).toEqual('Heads Up')
    expect(table2.tableSize(0)).toEqual('9-max')
    expect(table3.tableSize(0)).toEqual('6-max')
    expect(table4.tableSize(0)).toEqual('5-max')
    expect(table5.tableSize(0)).toEqual('6-max')
    expect(table6.tableSize(0)).toEqual('8-max')
  })
})
