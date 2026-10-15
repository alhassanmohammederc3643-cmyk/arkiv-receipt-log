import { createPublicClient } from '@arkiv-network/sdk';
import { tiramisu } from '@arkiv-network/sdk/chains';
import { eq, gte } from '@arkiv-network/sdk/query';
import { http } from 'viem';
import { PROJECT, CREATOR, RPC } from './config';
export { inspectEntity } from './inspect.mjs';
export const client = createPublicClient({ chain:tiramisu, transport:http(RPC,{timeout:15000,retryCount:1}) });
export function queryReceipts(trusted=true, service='', minAmount=0){
 const q=client.select({key:true,creator:true,owner:true,payload:true,attributes:true,expiresAt:true,creationFlags:true})
  .where(eq('project',PROJECT),eq('entity_type','receipt'),gte('amount_microunits',minAmount)).limit(12);
 if(service)q.where(eq('service',service));
 if(trusted)q.createdBy(CREATOR);
 return q.fetch();
}
