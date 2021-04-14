import 'isomorphic-fetch'

import { nockHeaders, nockOptionRequests } from '../../utils'

import { DNDAction } from '../dnd'
import { FakeStreamdeckApi } from '../../utils/fakeApi'
import { Slack } from '../../slack-plugin'
import nock from 'nock'

describe('Test dnd action', () => {
  const dndAction = new DNDAction(
    new FakeStreamdeckApi() as Slack,
    'com.thibautsabot.streamdeck.device'
  )

  describe('onKeyUp', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      dndAction.plugin.settingsManager.getGlobalSettings = () => ({ accessToken: 'fakeToken' })
    })

    beforeAll(nockOptionRequests)

    afterEach(nock.cleanAll)

    it('should not do anything is there is no settings', async () => {
      dndAction.plugin.settingsManager.getGlobalSettings = () => ({ accessToken: undefined })

      const dndInfoCall = nock('https://slack.com/api')
        .defaultReplyHeaders(nockHeaders)
        .post('/dnd.info')
        .reply(200, {})

      await dndAction.onKeyUp()

      expect(dndInfoCall.isDone()).toBe(false)
    })

    it('should get the dnd info', async () => {
      const dndReponse = {
        ok: true,
        dnd_enabled: true,
        next_dnd_start_ts: 1450416600,
        next_dnd_end_ts: 1450452600,
        snooze_enabled: true,
        snooze_endtime: 1450416600,
        snooze_remaining: 1196,
      }

      const dndInfoCall = nock('https://slack.com/api')
        .defaultReplyHeaders(nockHeaders)
        .post('/dnd.info')
        .reply(200, dndReponse)

      await dndAction.onKeyUp()

      expect(dndInfoCall.isDone()).toBe(true)
    })
  })
})
