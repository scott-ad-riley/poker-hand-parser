const extractMoney = require('./money_inside_brackets')

class Street {
  constructor(rawContents) {
    this.rows = rawContents.split('\n')
  }

  folds() {
    const foldRows = this.rows.filter(row => row.includes('folds'))
    return foldRows.map(row => row.substr(0, row.indexOf(':')))
  }

  invested(playerName) {
    // collect calls
    const playerRows = this.rows.filter(row => row.startsWith(`${playerName}:`))
    const callRows = playerRows.filter(row => row.includes(' calls '))
    const callSum = callRows.reduce((acc, row) => {
      return acc + extractMoney(row.split(`${playerName}: calls `)[1])
    }, 0)

    // collect raises
    const raiseRows = playerRows.filter(row => row.includes(' raises '))
    const raiseSum = raiseRows.reduce((acc, row) => {
      const [initial, final] = row
        .split(`${playerName}: raises `)[1]
        .split(' to ')
      return acc + (extractMoney(final) - extractMoney(initial))
    }, 0)

    // collect bets
    const betRow = playerRows.find(row => row.includes(' bets '))
    const betSum =
      betRow !== undefined
        ? extractMoney(betRow.split(`${playerName}: bets `)[1])
        : 0
    return betSum + callSum + raiseSum
  }
}

module.exports = Street
