import { SDOnPiEvent, StreamDeckPropertyInspectorHandler } from 'streamdeck-typescript'
import { isGlobalSettingsSet } from './utils/index'
import { GlobalSettingsInterface } from './utils/interface'

class SlackPI extends StreamDeckPropertyInspectorHandler {
  private validateButton: HTMLButtonElement

  constructor() {
    super()
  }

  @SDOnPiEvent('documentLoaded')
  onDocumentLoaded(): void {
    this.validateButton = document.getElementById('validate_button') as HTMLButtonElement
    this.validateButton?.addEventListener('click', this.onValidateButtonPressed.bind(this))
  }

  private async onValidateButtonPressed() {
    const accessToken = (<HTMLInputElement>document.getElementById('accesstoken'))?.value
    this.settingsManager.setGlobalSettings<GlobalSettingsInterface>({ accessToken })
  }

  // Prefill PI elements from cache
  @SDOnPiEvent('globalSettingsAvailable')
  propertyInspectorDidAppear(): void {
    this.requestSettings()
    const globalSettings = this.settingsManager.getGlobalSettings<GlobalSettingsInterface>()

    if (isGlobalSettingsSet(globalSettings)) {
      const accessToken = globalSettings.accessToken
      if (accessToken) {
        ;(<HTMLInputElement>document.getElementById('accesstoken')).value = accessToken
      }
    }
  }
}

new SlackPI()
