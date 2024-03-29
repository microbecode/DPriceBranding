import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import styled from 'styled-components'

import { useWeb3Context } from 'web3-react'

// variables for the netlify names of each form field
const bot = 'beep-boop'
const name = 'name'
const line1 = 'line1'
const line2 = 'line2'
const city = 'city'
const state = 'state'
const zip = 'zip'
const country = 'country'
const email = 'email'
const address = 'address'
const timestamp = 'timestamp'
const numberBurned = 'number-burned'

// map from variables to display text for each field
const nameMap = {
  [name]: 'Name',
  [line1]: 'Street Address',
  [line2]: 'Unit',
  [city]: 'City',
  [state]: 'State',
  [zip]: 'ZIP',
  [country]: 'Country',
  [email]: 'Email',
  [address]: 'Ethereum Address',
  [timestamp]: 'Time',
  [numberBurned]: 'Shirts Redeemed'
}

// the order for fields that will be submitted
const nameOrder = [name, line1, line2, city, state, zip, country, email]

// default for each form field
const defaultState = {
  [bot]: '',
  [name]: '',
  [line1]: '',
  [line2]: '',
  [city]: '',
  [state]: '',
  [zip]: '',
  [country]: '',
  [email]: ''
}

interface RedeemFormProps {
  setHasConfirmedAddress, 
  setUserAddress, 
  numberBurned,
  shirtSize : string
}

export default function RedeemForm({ setHasConfirmedAddress, setUserAddress, numberBurned: actualNumberBurned, shirtSize } : RedeemFormProps) {
  const { library, account } = useWeb3Context()
  const [autoAddress, ] = useState([])
  const [, setInputY] = useState(0)
  const suggestEl = useRef<Element>()

  const [formState, setFormState] = useState(defaultState)

  function handleChange(event) {
    const { name, value } = event.target
    setFormState(state => ({ ...state, [name]: value }))
  }

  // keep acount in sync
  useEffect(() => {
    setUserAddress(autoAddress['formatted_address'])
    handleChange({ target: { name: [address], value: account } })
  }, [account, autoAddress, setUserAddress])

  useLayoutEffect(() => {
    if (suggestEl.current) {
      setInputY(suggestEl.current.getBoundingClientRect().bottom)
    }
  }, [suggestEl])

  const canSign =
    formState[name] &&
    formState[line1] &&
    formState[city] &&
    formState[state] &&
    formState[zip] &&
    formState[country] &&
    formState[email] &&
    !!shirtSize

  return (
    <FormFrame autocomplete="off">
      <input hidden type="text" name="beep-boop" value={formState[bot]} onChange={handleChange} />
      <input
        required
        type="text"
        name={name}
        value={formState[name]}
        onChange={handleChange}
        placeholder={nameMap[name]}
        autoComplete="name"
      />
      <Compressed>
        <input
          type="text"
          name={line1}
          value={formState[line1]}
          onChange={handleChange}
          placeholder={nameMap[line1]}
          autoComplete="off"
        />
        <input
          type="text"
          name={line2}
          value={formState[line2]}
          onChange={handleChange}
          placeholder={nameMap[line2]}
          autoComplete="off"
        />
      </Compressed> 
      <input
        required
        type="text"
        name={city}
        value={formState[city]}
        onChange={handleChange}
        placeholder={nameMap[city]}
        autoComplete="address-level2"
      />
      <Compressed>
        <input
          style={{ marginRight: '8px' }}
          required
          type="text"
          name={state}
          value={formState[state]}
          onChange={handleChange}
          placeholder={nameMap[state]}
          autoComplete="address-level1"
        />
        <input
          required
          type="text"
          name={zip}
          value={formState[zip]}
          onChange={handleChange}
          placeholder={nameMap[zip]}
          autoComplete="postal-code"
        />
      </Compressed>
      <input
        required
        type="text"
        name={country}
        value={formState[country]}
        onChange={handleChange}
        placeholder={nameMap[country]}
        autoComplete="country-name"
      />
      <input
        required
        type="email"
        name={email}
        value={formState[email]}
        onChange={handleChange}
        placeholder={nameMap[email]}
        autoComplete="email"
      />
      <ButtonFrame
        type="submit"
        disabled={!canSign}
        onClick={event => {
          const signer = library.getSigner()
          const timestampToSign = Math.round(Date.now() / 1000)

          const header = `PLEASE VERIFY YOUR ADDRESS.\nYour data will never be shared publicly.`
          const formDataMessage = nameOrder.map(o => `${nameMap[o]}: ${formState[o]}`).join('\n')
          const autoMessage = `${nameMap[address]}: ${account}\n${nameMap[timestamp]}: ${timestampToSign}\n${nameMap[numberBurned]}: ${actualNumberBurned}\nsize:${shirtSize}`

          signer.signMessage(`${header}\n\n${formDataMessage}\n${autoMessage}`).then(returnedSignature => {
            const storeToDb = async () => {

              const faunadb = require('faunadb')

              const q = faunadb.query
              const client = new faunadb.Client({
                secret: process.env.REACT_APP_FAUNADB_SERVER_SECRET
              })
            
              try {
                await client.query(
                  q.Create(q.Collection('addresses'), {
                    data: {
                      numberOfTokens: Number(numberBurned),
                      timestamp: Number(timestamp),
                      addressPhysical: {
                        name : formState[name],
                        line1 : formState[line1],
                        line2 : formState[line2],
                        city : formState[city],
                        state : formState[state],
                        zip : formState[zip],
                        country : formState[country],
                        email: formState[email]
                      },
                      returnedSignature,
                      shirtSize: shirtSize,
                      accountAddress: account
                    }
                  })
                )
                return true;
              } catch (error) {
                console.error(error)
                return false;
              }
            }
            storeToDb().then((succeeded) => {
              if (succeeded) {
                setHasConfirmedAddress(true)
              }
              else {
                console.warn("failed to save db entry")
              }
            });
          })

          event.preventDefault()
        }}
      >
        {canSign ? 'Next' : 'Complete the form to continue'}
      </ButtonFrame>
      <br />
    </FormFrame>
  )
}

const FormFrame = styled.form`
  width: 100%;
  color: #fff;
  font-weight: 600;
  margin: 16px;
  /* margin-bottom: 0px; */
  font-size: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  input {
    border: none;
    background-image: none;
    background-color: transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    color: #000;
    background-color: #f1f2f6;
    padding: 8px;
    margin: 4px 0 4px 0;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
  }
  input:required {
    box-shadow: inset 0 0 0 1px rgba(254, 109, 222, 0.5);
  }
  input:valid {
    border: nne;
    box-shadow: none;
  }
`

const Compressed = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

const ButtonFrame = styled.button`
  padding: 0;
  text-align: center;
  border-radius: 8px;
  box-sizing: border-box;
  height: 48px;
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  border: none;
  cursor: pointer;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  box-shadow: 0px 4px 20px rgba(239, 162, 250, 0.7);
  background: ${props => (props.disabled ? '#f1f2f6' : 'black')};
  box-shadow: ${props => (props.disabled ? 'none' : '0px 4px 20px rgba(239, 162, 250, 0.7)')};
  color: ${props => (props.disabled ? '#aeaeae' : props.theme.textColor)};
  transform: scale(1);
  transition: transform 0.3s ease;
  text-align: center;
  margin-top: 4px;

  :hover {
    transform: scale(0.99);
  }
`
