const test = require('tape')
const DiscoHash = require('./')

test('encode', tape => {
  tape.plan(4)
  
  const discoHash = new DiscoHash({index: 1}, {name: 'leofcoin-itx'});  
  const hash2 = new DiscoHash('5hmacqb6ao252jmbhkhu5isr4yua3jnkhgb5ejjbiomrlzglwarlb777wq7aw5nfz5m4pubx5uffaxp2cqc4ckrh4xirss4nkujvcjbnmomtm')
  const hash3 = new DiscoHash({index: 5}, {name: 'leofcoin-block'})
  const hash4 = new DiscoHash('4lmacqas6kpnmvehxpmlvsndgydw5i46mf2pgnaub72eug63dozkw4oqxhk3fazbhkguvlhslcaeqm5jtwghxdk5nvmuakrs7yi2gl6xqmmmw')
  tape.equal(discoHash.toBs32().length, 109, 'has base32')
  tape.equal(hash3.toBs32(), hash4.toBs32(), 'bs32')
  tape.equal(hash2.size, hash3.size, 'size')
  tape.notEqual(discoHash.toBs32(), hash3.toBs32())
  console.log(discoHash.discoCodec);
  console.log(hash2.discoCodec);
  console.log(hash3.discoCodec);
  console.log(hash4.discoCodec);
  console.log(discoHash.toBs32());
})

