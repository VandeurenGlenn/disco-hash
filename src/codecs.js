export default {  
  // just a hash
  'disco-hash': {
    codec: '30',
    hashAlg: 'dbl-keccak-512'//,
    // testnet: 'olivia'
  },
  // normal block
  'leofcoin-block': {
    codec: '6c',
    hashAlg: 'dbl-keccak-512'//,
    // testnet: 'olivia'
  },
  // itx
  'leofcoin-itx': {
    codec: '6c69',
    hashAlg: 'keccak-512'//,
    // testnet: 'olivia'
  },
  // peer reputation
  'leofcoin-pr': {
    codec: '6c70',
    hashAlg: 'keccak-256'//,
    // testnet: 'olivia'
   }
}