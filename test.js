const test = require('tape')
const DiscoHash = require('./')

test('encode', tape => {
  tape.plan(4)
  
  const discoHash = new DiscoHash({index: 1}, {name: 'leofcoin-block'});  
  const hash2 = new DiscoHash('yyguaexst3lfjb533c5mtizwa5xkhhtbotztifap6rfbxwy3wkvxdufz2wzigij2rvfkz4syqbedhkm5rr5y2xlnlfacumx6cgrs7v4dddfq')
  const hash3 = new DiscoHash({index: 5}, {name: 'leofcoin-block'})
  const hash4 = new DiscoHash('yyguaexst3lfjb533c5mtizwa5xkhhtbotztifap6rfbxwy3wkvxdufz2wzigij2rvfkz4syqbedhkm5rr5y2xlnlfacumx6cgrs7v4dddfq', {name: 'leofcoin-block'})
  tape.equal(discoHash.toBs32().length, 108, 'has base32')
  tape.equal(hash3.toBs32(), hash4.toBs32(), 'bs32')
  tape.equal(hash2.size, hash3.size, 'size')
  tape.notEqual(discoHash.toBs32(), hash3.toBs32())
  console.log(discoHash.discoCodec);
  console.log(hash2.discoCodec);
  console.log(hash3.discoCodec);
  console.log(hash4.discoCodec);
})

