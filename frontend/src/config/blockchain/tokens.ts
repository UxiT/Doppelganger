interface IToken {
  name: string,
  symbol: string,
  address: string,
}

export const sibrTestToken: IToken = {
  name: 'Sibr Test Token',
  symbol: 'SIBR',
  address: '0x0790c2d13FdC6F453627C39a46F819720D8D856E'
}

export const sepoliaEth: IToken = {
  name: 'Ethereum',
  symbol: 'ETH',
  address: '0xd38E5c25935291fFD51C9d66C3B7384494bb099A'
}
