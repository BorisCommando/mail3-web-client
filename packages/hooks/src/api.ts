import axios, { Axios, AxiosResponse } from 'axios'
import { useMemo } from 'react'
import { useAccount } from './connectors'
import { SERVER_URL } from './env'

export class API {
  private address: string

  private axios: Axios

  constructor(account = '') {
    this.address = account
    this.axios = axios.create({
      baseURL: SERVER_URL,
    })
  }

  public async getNonce(): Promise<AxiosResponse<{ nonce: number }>> {
    return this.axios.get(`/address_nonces/${this.address}`)
  }

  public async signUp(message: string, signature: string) {
    return this.axios.post('/registrations', {
      address: this.address,
      message,
      signature,
    })
  }
}

export const useSignUpAPI = () => {
  const account = useAccount()
  return useMemo(() => new API(account), [account])
}