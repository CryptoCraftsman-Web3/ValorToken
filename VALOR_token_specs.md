## Requirements of VALOR Token

Property | Value 
--- | --- 
premined | 100%
mintable | no after TGE
burnable | yes, unsold tokens will be burned by Smart Valor team
max supply anytime| 100 million
totalSupply | the relation `totalSupply <= max supply`  always holds
name as required in ERC20 standard | VALOR Token
symbol	as required in ERC20 standard | VALOR
the number of digits for fractional units | 18	
	
  
## Sequence of actions during/after TGE

1. At TGE the tokens will be split into three funds whose addresses are passed to constructor: 
 * Future Development Fund (FDF), 26%
 * Company multisig cold wallet (CMCW) 55%
 * Employees pool (EP) 19%
 
 2. After TGE, the CMCW will 
 * transfer to the Company multisig operational wallet (CMOW) all the tokens sold in pre-sale plus tokens for ICO, 45%
 * keep a liquidity reserve of 5%
 * keep network growth funds, 5%
 
 
 3. After ICO ends, tokens in CMOW will be available for withdrawals.
 * at withdrawal: tokens are sent outbound from the CMOW to the recipient address
 * at deposit: tokens flow from a EOA of user into a generated address per user deposit and finally ends into the CMOW.
   

