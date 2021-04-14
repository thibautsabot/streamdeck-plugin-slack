import { GlobalSettingsInterface, SceneSettingsInterface } from '../utils/interface'
import { KeyUpEvent, SDOnActionEvent, StreamDeckAction } from 'streamdeck-typescript'
import { fetchApi, isGlobalSettingsSet } from '../utils/index'

import { Slack } from '../slack-plugin'
import { Status } from '@smartthings/core-sdk'

export class SceneAction extends StreamDeckAction<Slack, SceneAction> {
  constructor(public plugin: Slack, private actionName: string) {
    super(plugin, actionName)
  }

  @SDOnActionEvent('keyUp')
  public async onKeyUp({ payload }: KeyUpEvent<SceneSettingsInterface>): Promise<void> {
    const globalSettings = this.plugin.settingsManager.getGlobalSettings<GlobalSettingsInterface>()

    if (isGlobalSettingsSet(globalSettings)) {
      const token = globalSettings.accessToken
      const sceneId = payload.settings.sceneId

      await fetchApi<Status>({
        endpoint: `/scenes/${sceneId}/execute`,
        accessToken: token,
        method: 'POST',
      })
    }
  }
}
