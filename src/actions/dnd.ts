import { SDOnActionEvent, StreamDeckAction } from 'streamdeck-typescript'

import { GlobalSettingsInterface } from '../utils/interface'
import { Slack } from '../slack-plugin'
import { WebClient } from '@slack/web-api'
import { isGlobalSettingsSet } from '../utils/index'

export class DNDAction extends StreamDeckAction<Slack, DNDAction> {
  constructor(public plugin: Slack, private actionName: string) {
    super(plugin, actionName)
  }

  @SDOnActionEvent('keyUp')
  public async onKeyUp(): Promise<void> {
    const globalSettings = this.plugin.settingsManager.getGlobalSettings<GlobalSettingsInterface>()

    if (isGlobalSettingsSet(globalSettings)) {
      const client = new WebClient(globalSettings.accessToken);

      const dndResult = await client.dnd.info()
      console.log(dndResult)
    }
  }
}
