import { DNDAction } from './actions/dnd'
import { StreamDeckPluginHandler } from 'streamdeck-typescript'

export class Slack extends StreamDeckPluginHandler {
  constructor() {
    super()
    new DNDAction(this, 'com.thibautsabot.streamdeck.dnd')
  }
}

new Slack()
