import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";

export interface IAppContextState {
  visible: boolean,
  count: ethers.utils.BigNumber,
  valid : boolean,
  tradeType: string,
  showConnect: boolean
}

export interface IAppContext {
  state: IAppContextState,
  setState: (IAppContextState) => void
}

export interface IValidationError {
  code: string
}

export interface IValidationTradeResult {
  inputValue: ethers.utils.BigNumber,
  outputValue: ethers.utils.BigNumber,
  minimumOutputValue?: ethers.utils.BigNumber,
  maximumInputValue?: ethers.utils.BigNumber,
  error?: IValidationError
}

export interface IValidateTrade {
 (numberOfOwnTokens : string) :  IValidationTradeResult
}

export interface ITransaction {
  hash: string,
  type: string,
  amount: number
}

export interface IPairReserves {
  reserveETH: BigNumber,
  reserveToken: BigNumber
}