const test = require('tape')
const DiscoHash = require('./')

test('encode', tape => {
  tape.plan(5)
  
  const discoHash = new DiscoHash({}, {name: 'leofcoin-block'});  
  const hash2 = new DiscoHash('kfaexhovj4mgslg5gko5p7dyb6uweu6mfcouiuevy73dx447zxscflmclmfylmer3n3nlhfyjgb6n2nny55fowvldmbe4uegu7hb2bwyr4', {name: 'leofcoin-block'})
  const hash3 = new DiscoHash({index: 0}, {name: 'leofcoin-block'})
  const hash4 = new DiscoHash('kfaexhovj4mgslg5gko5p7dyb6uweu6mfcouiuevy73dx447zxscflmclmfylmer3n3nlhfyjgb6n2nny55fowvldmbe4uegu7hb2bwyr4', {name: 'leofcoin-block'})
  
  tape.equal(hash3.toBs32(), hash2.toBs32(), 'bs32')
  tape.equal(hash3.toBs32(), hash4.toBs32(), 'bs32')
  tape.equal(discoHash.size, hash2.size, 'length')  
  tape.equal(discoHash.size, hash3.size, 'length')
  
  tape.notEqual(discoHash.toBs32(), hash3.toBs32())
  // tape.
})