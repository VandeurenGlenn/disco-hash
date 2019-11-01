const test = require('tape')
const DiscoHash = require('./')

test('encode', tape => {
  tape.plan(4)
  
  const discoHash = new DiscoHash({index: 1}, {name: 'leofcoin-block'});  
  const hash2 = new DiscoHash('azabf4u62zkipo6yxle2gnqhn2rz4ylu6m2bid7ujin5wg5svny5boovwkbscounjkwpeweajaz2thmmpogv23kziavdf7qrumx5payyzm', {name: 'leofcoin-block'})
  const hash3 = new DiscoHash({index: 5}, {name: 'leofcoin-block'})
  const hash4 = new DiscoHash('azabf4u62zkipo6yxle2gnqhn2rz4ylu6m2bid7ujin5wg5svny5boovwkbscounjkwpeweajaz2thmmpogv23kziavdf7qrumx5payyzm', {name: 'leofcoin-block'})
  tape.equal(discoHash.toBs32().length, 106, 'has base32')
  tape.equal(hash3.toBs32(), hash4.toBs32(), 'bs32')
  tape.equal(hash2.size, hash3.size, 'size')
  tape.notEqual(discoHash.toBs32(), hash3.toBs32())
})