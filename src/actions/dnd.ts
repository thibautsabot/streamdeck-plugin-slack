import { SDOnActionEvent, StreamDeckAction } from 'streamdeck-typescript'

import { GlobalSettingsInterface } from '../utils/interface'
import { Slack } from '../slack-plugin'
import { WebClient } from '@thibautsabot/web-api'
import { isGlobalSettingsSet } from '../utils/index'

export class DNDAction extends StreamDeckAction<Slack, DNDAction> {
  constructor(public plugin: Slack, private actionName: string) {
    super(plugin, actionName)
  }

  @SDOnActionEvent('keyUp')
  public async onKeyUp(): Promise<void> {
    const globalSettings = this.plugin.settingsManager.getGlobalSettings<GlobalSettingsInterface>()

    if (isGlobalSettingsSet(globalSettings)) {
      const client = new WebClient(globalSettings.accessToken)

      const dndResult = await client.dnd.info()

      if (!dndResult.dnd_enabled) {
        await client.dnd.setSnooze({
          num_minutes: 45
        })
        await client.users.profile.set({
          // @ts-ignore for some reason they think profile is a string
          profile: {
            "status_text": "Pas disponible actuellement",
            "status_emoji": ":no_bell:",
          }
        })
      } else {
        await client.dnd.endSnooze()
        await client.users.profile.set({
          // @ts-ignore for some reason they think profile is a string
          profile: {
            "status_text": "",
            "status_emoji": ":armageddon:",
          }
        })
      }
    }
  }
}
