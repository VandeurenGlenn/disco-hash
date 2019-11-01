'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createKeccakHash = _interopDefault(require('keccak'));
var varint = _interopDefault(require('varint'));
var bs32 = _interopDefault(require('bs32'));
var isHex = _interopDefault(require('is-hex'));

var codecs = {  
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
};

class DiscoHash {
  constructor(buffer, options = {}) {
    if (options.name) this.name = options.name;
    else this.name = 'disco-hash';
    if (options.codecs) this.codecs = options.codecs;
    else this.codecs = codecs;
    if (buffer) {
      if (Buffer.isBuffer(buffer)) {
        const codec = varint.decode(buffer);
        const name = this.getCodecName(codec);
        if (name) {
          this.name = name;
          this.decode(buffer);
        } else {
          this.encode(buffer);
        }
        
        
      }
      if (typeof buffer === 'string') {
        if (isHex(buffer)) this.fromHex(buffer);
        if (bs32.test(buffer)) this.fromBs32(buffer);
      } else if (typeof buffer === 'object') this.fromJSON(buffer);
    }
    
  }
  
  getCodecName(codec) {
    codec = String(codec);
    return Object.keys(this.codecs).reduce((p, c) => {
      if (this.getCodec(c) === codec) return c;
      else return p;
    }, undefined)
  }
  
  getCodec(name) {
    if (!name) name = 'disco-hash';
    return this.codecs[name].codec
  }
  
  getHashAlg(name) {
    return this.codecs[name].hashAlg
  }
  
  get prefix() {
    return Buffer.concat([this.codec, this.length])
  }
  
  get length() {
    return Buffer.from(varint.encode(this.size))
  }
  
  get buffer() {
    return this.hash
  }
  
  toHex() {
    return this.toString('hex')
  }
  
  fromHex(hex) {
    return this.decode(Buffer.from(hex, 'hex'))
  }
  
  fromJSON(json) {
    return this.encode(Buffer.from(JSON.stringify(json)))
  }
  
  toBs32() {
    return bs32.encode(this.hash)
  }
  
  fromBs32(bs) {
    return this.decode(bs32.decode(bs))
  }
  
  toString(encoding = 'utf8') {
    return this.hash.toString(encoding)
  }
  
  encode(buffer, name) {
    if (!this.name && name) this.name = name;
    if (!this.name) this.name = 'disco-hash';
    let codec = this.getCodec(this.name);
    let hashAlg = this.getHashAlg(this.name);
    if (hashAlg.includes('dbl')) {
      hashAlg = hashAlg.replace('dbl-', '');
      buffer = createKeccakHash(hashAlg.replace('-', '')).update(buffer).digest();          
    }    
    this.digest = createKeccakHash(hashAlg.replace('-', '')).update(buffer).digest();   
    this.size = this.digest.length;
    
    this.codec = Buffer.from(varint.encode(parseInt(Buffer.from(`0${codec}`, 'hex').toString('hex'), 16)), 'hex');
    this.hash = Buffer.concat([
      this.prefix,
      this.digest
    ]);
    
    return this.hash
  }
  
  validate(buffer) {
    if (Buffer.isBuffer(buffer)) {
      const codec = varint.decode(buffer);              
      if (this.codecs[codec]) {
        this.decode(buffer);
      } else {
        this.encode(buffer);
      }      
    }
    if (typeof buffer === 'string') {
      if (isHex(buffer)) this.fromHex(buffer);
      if (bs32.test(buffer)) this.fromBs32(buffer);
    }
    if (typeof buffer === 'object') this.fromJSON(buffer);
  }
  
  _numberToHex(number) {
    let hex = number.toString(16);
    if (hex.length % 2 === 1) hex = '0' + hex;
    
    return hex
  }
  
  decode(buffer) {
    this.hash = buffer;
    const codec = varint.decode(buffer);
    this.codec = Buffer.from(this._numberToHex(codec), 'hex');
    // TODO: validate codec
    buffer = buffer.slice(varint.decode.bytes);        
    this.size = varint.decode(buffer);
    this.digest = buffer.slice(varint.decode.bytes);        
    if (this.digest.length !== this.size) {
      throw new Error(`hash length inconsistent: 0x${this.hash.toString('hex')}`)
    }
    
    this.name = this.getCodecName(codec);
    
    this.size = this.digest.length;
    
    return {
      codec: this.codec,
      name: this.name,
      size: this.size,
      length: this.length,
      digest: this.digest
    }
  }
}

module.exports = DiscoHash;
