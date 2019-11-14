'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createKeccakHash = _interopDefault(require('keccak'));
var varint = _interopDefault(require('varint'));
var bs32 = _interopDefault(require('bs32'));
var bs58 = _interopDefault(require('bs58'));
var isHex = _interopDefault(require('is-hex'));
var DiscoCodec = _interopDefault(require('disco-codec'));

class DiscoHash {
  constructor(buffer, options = {}) {
    if (options.name) this.name = options.name;
    else this.name = 'disco-hash';
    if (options.codecs) this.codecs = options.codecs;
    if (buffer) {
      
      if (Buffer.isBuffer(buffer)) {
        this.discoCodec = new DiscoCodec(buffer, this.codecs);
        const name = this.discoCodec.name;
        
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
        else this.fromBs58(buffer);
      } else if (typeof buffer === 'object') this.fromJSON(buffer);
    }
    
  }
  
  get prefix() {
    return Buffer.concat([this.discoCodec.codecBuffer, this.length])
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
  
  toBs58() {
    return bs58.encode(this.hash)
  }
  
  fromBs58(bs) {
    return this.decode(bs58.decode(bs))
  }
  
  toString(encoding = 'utf8') {
    return this.hash.toString(encoding)
  }
  
  encode(buffer, name) {
    if (!this.name && name) this.name = name;
    if (!buffer) buffer = this.buffer;
    this.discoCodec = new DiscoCodec(this.name, this.codecs);
    this.discoCodec.fromName(this.name);
    let hashAlg = this.discoCodec.hashAlg;
    if (hashAlg.includes('dbl')) {
      hashAlg = hashAlg.replace('dbl-', '');
      buffer = createKeccakHash(hashAlg.replace('-', '')).update(buffer).digest();          
    }    
    this.digest = createKeccakHash(hashAlg.replace('-', '')).update(buffer).digest();   
    this.size = this.digest.length;
    
    this.codec = this.discoCodec.encode();
    this.codec = this.discoCodec.codecBuffer;
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
  
  decode(buffer) {
    this.hash = buffer;
    const codec = varint.decode(buffer);
    
    this.discoCodec = new DiscoCodec(codec, this.codecs);
    // TODO: validate codec
    buffer = buffer.slice(varint.decode.bytes);        
    this.size = varint.decode(buffer);
    this.digest = buffer.slice(varint.decode.bytes);        
    if (this.digest.length !== this.size) {
      throw new Error(`hash length inconsistent: 0x${this.hash.toString('hex')}`)
    }
    
    // const discoCodec = new DiscoCodec(codec, this.codecs)
    
    this.name = this.discoCodec.name;
    
    
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
