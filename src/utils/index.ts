import { GlobalSettingsInterface } from './interface'
import nock from 'nock'

export function isGlobalSettingsSet(
  settings: GlobalSettingsInterface | unknown
): settings is GlobalSettingsInterface {
  return (settings as GlobalSettingsInterface).accessToken !== undefined
}

export const nockHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization',
}

export const nockOptionRequests = (): void => {
  nock('https://slack.com/api')
  .intercept(/./, 'OPTIONS')
  .reply(200, undefined, nockHeaders)
  .persist()
}