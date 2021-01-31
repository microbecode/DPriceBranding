import { ethers } from "ethers";

export interface IAppContextState {
    visible: boolean,
    count: number,
    valid : boolean,
    tradeType: string,
    showConnect: boolean
  }
  
  export interface IAppContext {
    state: IAppContextState,
    setState: (AppI) => void
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