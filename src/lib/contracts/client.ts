import {
  rpc,
  Contract,
  TransactionBuilder,
  Networks,
  nativeToScVal,
  scValToNative,
  Address,
  type xdr,
} from 'stellar-sdk'

export { Address }

export interface ContractCallOptions {
  contractId: string
  method: string
  args: xdr.ScVal[]
  source?: string
}

export interface ContractClientConfig {
  rpcUrl: string
  networkPassphrase: string
  network: 'testnet' | 'mainnet' | 'futurenet'
}

export const DEFAULT_CONFIG: ContractClientConfig = {
  rpcUrl: import.meta.env.VITE_RPC_URL ?? 'https://soroban-testnet.stellar.org',
  networkPassphrase: import.meta.env.VITE_NETWORK_PASSPHRASE ?? Networks.TESTNET,
  network: 'testnet',
}

export function getServer(config = DEFAULT_CONFIG) {
  return new rpc.Server(config.rpcUrl)
}

export async function simulateContract(
  method: string,
  args: xdr.ScVal[],
  contractId: string,
  source: string,
  config = DEFAULT_CONFIG
) {
  const server = getServer(config)
  const account = await server.getAccount(source)
  const contract = new Contract(contractId)

  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(300)
    .build()

  return server.simulateTransaction(tx)
}

export async function buildAndSendContractCall(
  method: string,
  args: xdr.ScVal[],
  contractId: string,
  source: string,
  signTransactionFn: (txXdr: string) => Promise<{ signedTxXdr: string }>,
  config = DEFAULT_CONFIG
) {
  const server = getServer(config)
  const account = await server.getAccount(source)
  const contract = new Contract(contractId)

  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(300)
    .build()

  const preparedTx = await server.prepareTransaction(tx)
  const xdr = preparedTx.toXDR()

  const { signedTxXdr } = await signTransactionFn(xdr)
  const signedTx = TransactionBuilder.fromXDR(signedTxXdr, config.networkPassphrase)

  const sendResult = await server.sendTransaction(signedTx)

  if (sendResult.status === 'PENDING') {
    return pollForCompletion(server, sendResult.hash!)
  }

  return sendResult
}

async function pollForCompletion(
  server: rpc.Server,
  hash: string,
  maxAttempts = 10
) {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await server.getTransaction(hash)
    if (result.status === 'SUCCESS') return result
    if (result.status === 'FAILED') throw new Error(`Transaction ${hash} failed`)
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error(`Transaction ${hash} timed out`)
}

export function toScVal(value: unknown): xdr.ScVal {
  if (typeof value === 'string') return nativeToScVal(value, { type: 'string' })
  if (typeof value === 'number') return nativeToScVal(value, { type: 'i128' })
  if (typeof value === 'boolean') return nativeToScVal(value, { type: 'bool' })
  if (value instanceof Address) return value.toScVal()
  return nativeToScVal(value)
}

export function fromScVal(val: xdr.ScVal): unknown {
  return scValToNative(val)
}
