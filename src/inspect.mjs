import {Receipt,receiptHash} from './receipt.mjs';
const CREATOR='0x02994F5588Cbb3FC21aC3dd54fa237246C509498';
export function inspectEntity(entity){
 let raw;
 try{raw=entity.toJson();}catch{return {valid:false,trusted:false,error:'Malformed JSON payload'};}
 const result=Receipt.safeParse(raw);
 if(!result.success)return {valid:false,trusted:false,error:'Invalid receipt schema'};
 const attrs=entity.attributes;
 const get=(key)=>attrs?.[key]?.value ?? attrs?.[key]?.toString?.() ?? attrs?.[key];
 // Creator is a protocol field, never a payload claim.
 const trusted=entity.creator?.toLowerCase()===CREATOR.toLowerCase();
 const digest=receiptHash(result.data);
 const storedDigest=get('receipt_hash');
 const valid=storedDigest===digest && get('service')===result.data.service
  && Number(get('amount_microunits'))===result.data.amountMicrounits
  && get('network')==='testnet' && get('status')==='simulated'
  && entity.creationFlags?.readonly===true;
 return {valid,trusted,receipt:result.data,digest,storedDigest,error:valid?'':'Payload, attributes or read-only flag mismatch'};
}
