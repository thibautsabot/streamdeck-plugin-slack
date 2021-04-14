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

    it('should enable dnd', async () => {
      const dndReponse = {
        ok: true,
        dnd_enabled: false,
      }

      nock('https://slack.com/api')
        .defaultReplyHeaders(nockHeaders)
        .post('/dnd.info')
        .reply(200, dndReponse)
      const setSnoozeCall = nock('https://slack.com/api')
        .defaultReplyHeaders(nockHeaders)
        .post('/dnd.setSnooze')
        .reply(200, dndReponse)
      const setProfileCall = nock('https://slack.com/api')
        .defaultReplyHeaders(nockHeaders)
        .post('/users.profile.set')
        .reply(200, dndReponse)

      await dndAction.onKeyUp()

      expect(setSnoozeCall.isDone()).toBe(true)
      expect(setProfileCall.isDone()).toBe(true)
    })

    it('should disable dnd', async () => {
      const dndReponse = {
        ok: true,
        dnd_enabled: true,
      }

      nock('https://slack.com/api')
        .defaultReplyHeaders(nockHeaders)
        .post('/dnd.info')
        .reply(200, dndReponse)
      const endSnoozeCall = nock('https://slack.com/api')
        .defaultReplyHeaders(nockHeaders)
        .post('/dnd.endSnooze')
        .reply(200, dndReponse)
      const setProfileCall = nock('https://slack.com/api')
        .defaultReplyHeaders(nockHeaders)
        .post('/users.profile.set')
        .reply(200, dndReponse)

      await dndAction.onKeyUp()

      expect(endSnoozeCall.isDone()).toBe(true)
      expect(setProfileCall.isDone()).toBe(true)
    })
  })
})
