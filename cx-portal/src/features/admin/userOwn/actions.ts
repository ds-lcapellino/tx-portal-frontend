/********************************************************************************
 * Copyright (c) 2021,2022 BMW Group AG
 * Copyright (c) 2021,2022 Contributors to the CatenaX (ng) GitHub Organisation.
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import { createAsyncThunk } from '@reduxjs/toolkit'
import { Api } from './api'
import { name } from './types'

const fetchOwn = createAsyncThunk(`${name}/fetchOwn`, async () => {
  try {
    return await Api.getInstance().getUserOwn()
  } catch (error: unknown) {
    console.error('api call error:', error)
    throw Error(`${name}/fetchOwn error`)
  }
})

const fetchAny = createAsyncThunk(
  `${name}/fetchAny`,
  async (companyUserId: string) => {
    try {
      return await Api.getInstance().getUserInfo(companyUserId)
    } catch (error: unknown) {
      console.error('api call error:', error)
      throw Error(`${name}/fetchAny error`)
    }
  }
)

const putResetPassword = createAsyncThunk(
  `${name}/resetPassword`,
  async (companyUserId: string) => {
    try {
      return await Api.getInstance().resetPassword(companyUserId)
    } catch (error: any) {
      throw Error(JSON.stringify(error.response.status))
    }
  }
)

const deleteUserBpn = createAsyncThunk(
  `${name}/deleteBpn`,
  async ({ companyUserId, bpn }: { companyUserId: string; bpn: string }) => {
    try {
      return await Api.getInstance().deleteBpn(companyUserId, bpn)
    } catch (error: any) {
      throw Error(JSON.stringify(error.response.status))
    }
  }
)

const putBusinessPartnerNumber = createAsyncThunk(
  `${name}/putBusinessPartnerNumber`,
  async ({
    companyUserId,
    inputBPN,
  }: {
    companyUserId: string
    inputBPN: string
  }) => {
    try {
      return await Api.getInstance().addBusinessPartnerNumber(
        companyUserId,
        inputBPN
      )
    } catch (error: any) {
      throw Error(JSON.stringify(error.response.status))
    }
  }
)

export {
  fetchOwn,
  fetchAny,
  putResetPassword,
  putBusinessPartnerNumber,
  deleteUserBpn,
}
