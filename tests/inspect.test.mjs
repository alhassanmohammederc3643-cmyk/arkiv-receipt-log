import {test} from 'node:test';import assert from 'node:assert/strict';import {syntheticReceipt,receiptHash} from '../src/receipt.mjs';import {inspectEntity} from '../src/inspect.mjs';
const creator='0x02994F5588Cbb3FC21aC3dd54fa237246C509498';
function entity(){const r=syntheticReceipt();return {creator,creationFlags:{readonly:true},toJson:()=>r,attributes:Object.fromEntries(Object.entries({receipt_hash:receiptHash(r),service:r.service,amount_microunits:r.amountMicrounits,network:r.network,status:r.status}).map(([k,v])=>[k,{value:v}]))};}
test('valid read-only creator record passes all checks',()=>{const r=inspectEntity(entity());assert.ok(r.valid);assert.ok(r.trusted);});
test('copied tags cannot impersonate creator',()=>{const e=entity();e.creator='0x0000000000000000000000000000000000000001';assert.equal(inspectEntity(e).trusted,false);});
test('mismatched query attributes are not verified',()=>{const e=entity();e.attributes.amount_microunits.value=1;assert.equal(inspectEntity(e).valid,false);});
test('writable receipt is not verified',()=>{const e=entity();e.creationFlags.readonly=false;assert.equal(inspectEntity(e).valid,false);});
test('malformed JSON handled without crashing index',()=>{const e=entity();e.toJson=()=>{throw Error('invalid JSON')};assert.equal(inspectEntity(e).valid,false);});
