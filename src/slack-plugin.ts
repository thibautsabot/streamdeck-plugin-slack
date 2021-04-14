import { DeviceAction } from './actions/device'
import { SceneAction } from './actions/scene'
import { StreamDeckPluginHandler } from 'streamdeck-typescript'

export class Slack extends StreamDeckPluginHandler {
  constructor() {
    super()
    new SceneAction(this, 'com.thibautsabot.streamdeck.scene')
    new DeviceAction(this, 'com.thibautsabot.streamdeck.device')
  }
}

new Slack()
