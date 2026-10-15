import {test} from 'node:test';import assert from 'node:assert/strict';import {Receipt,syntheticReceipt,receiptHash,canonicalReceipt} from '../src/receipt.mjs';
test('synthetic receipt validates',()=>assert.equal(Receipt.parse(syntheticReceipt()).network,'testnet'));
test('changed amount changes hash',()=>{const r=syntheticReceipt();assert.notEqual(receiptHash(r),receiptHash({...r,amountMicrounits:1}));});
test('object order does not affect hash',()=>{const r=syntheticReceipt();const reordered=Object.fromEntries(Object.entries(r).reverse());assert.equal(canonicalReceipt(r),canonicalReceipt(reordered));});
test('rejects mainnet and real settlement claims',()=>{const r=syntheticReceipt();assert.throws(()=>Receipt.parse({...r,network:'mainnet'}));assert.throws(()=>Receipt.parse({...r,status:'settled'}));});
test('rejects personal fields and invalid numeric values',()=>{const r=syntheticReceipt();assert.throws(()=>Receipt.parse({...r,email:'test@example.com'}));assert.throws(()=>Receipt.parse({...r,amountMicrounits:-1}));});
