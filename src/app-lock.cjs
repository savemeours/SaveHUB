'use strict';
const {randomBytes,scrypt:derive,timingSafeEqual}=require('node:crypto');const {promisify}=require('node:util');const scrypt=promisify(derive);
class AppLock{
 constructor({data={},save=()=>{},changed=()=>{},now=Date.now}){this.data=data;this.save=save;this.changed=changed;this.now=now;this.locked=!!data.hash;this.checking=false;}
 status(){return {configured:!!this.data.hash,locked:this.locked,retrySeconds:Math.max(0,Math.ceil(((this.data.retryAt||0)-this.now())/1000))};}
 validate(pin){if(typeof pin!=='string'||!/^\d{4,12}$/.test(pin))throw new Error('Gunakan PIN angka 4–12 digit');}
 async verify(pin){this.validate(pin);if(this.status().retrySeconds)throw new Error('Coba lagi dalam '+this.status().retrySeconds+' detik');if(!this.data.hash)return false;const actual=await scrypt(pin,Buffer.from(this.data.salt,'hex'),32);const expected=Buffer.from(this.data.hash,'hex');const valid=actual.length===expected.length&&timingSafeEqual(actual,expected);
  if(!valid){this.data.failures=(this.data.failures||0)+1;if(this.data.failures>=5)this.data.retryAt=this.now()+Math.min(300,30*(this.data.failures-4))*1000;this.save(this.data);return false;}this.data.failures=0;this.data.retryAt=0;this.save(this.data);return true;}
 async act(action,pin,newPin){if(this.checking)throw new Error('Pemeriksaan PIN sedang berjalan');this.checking=true;try{
  if(action==='setup'){if(this.data.hash)throw new Error('PIN sudah terpasang');this.validate(pin);await this.store(pin);this.locked=false;}
  else if(action==='unlock'){if(!(await this.verify(pin)))throw new Error('PIN tidak cocok');this.locked=false;}
  else if(action==='change'||action==='disable'){if(!(await this.verify(pin)))throw new Error('PIN saat ini tidak cocok');if(action==='change'){this.validate(newPin);await this.store(newPin);}else{this.data={};this.save(this.data);this.locked=false;}}
  else if(action==='lock'){if(!this.data.hash)throw new Error('Atur PIN terlebih dahulu');this.locked=true;}else throw new Error('Aksi tidak dikenal');this.changed(this.status());return this.status();
 }finally{this.checking=false;}}
 async store(pin){const salt=randomBytes(16);const hash=await scrypt(pin,salt,32);this.data={salt:salt.toString('hex'),hash:hash.toString('hex'),failures:0,retryAt:0};this.save(this.data);}
}
module.exports=AppLock;
