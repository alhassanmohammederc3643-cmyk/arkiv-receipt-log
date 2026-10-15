import {createPublicClient} from '@arkiv-network/sdk';import {tiramisu} from '@arkiv-network/sdk/chains';import {eq,gte} from '@arkiv-network/sdk/query';import {http} from 'viem';import {Receipt,receiptHash} from '../src/receipt.mjs';
const creator='0x02994F5588Cbb3FC21aC3dd54fa237246C509498';const p=createPublicClient({chain:tiramisu,transport:http()});
const page=await p.select({key:true,creator:true,payload:true,attributes:true,expiresAt:true,creationFlags:true}).where(eq('project','arkiv-x402-receipt-log-2026-v1'),eq('entity_type','receipt'),gte('amount_microunits',0)).createdBy(creator).limit(12).fetch();
console.log('Block',String(page.blockNumber),'records',page.entities.length,'next page',page.hasNextPage());
for(const e of page.entities){console.log(JSON.stringify({key:e.key,creator:e.creator,attributes:e.attributes,flags:e.creationFlags,receipt:Receipt.parse(e.toJson()),hash:receiptHash(e.toJson())},(_,v)=>typeof v==='bigint'?v.toString():v,2));}
