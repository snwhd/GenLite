/*
    Copyright (C) 2023 Xortrox
*/
/*
    This file is part of GenLite.

    GenLite is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    GenLite is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with Foobar. If not, see <https://www.gnu.org/licenses/>.
*/
import { GenLitePlugin } from '../core/interfaces/plugin.class';

export class GenliteSimplifiedChatUiPlugin extends GenLitePlugin {
  static pluginName = 'GenliteSimplifiedChatUiPlugin';

  isPluginEnabled: boolean = false;
  chatWidth: number = 700;

  chatBackground: HTMLElement;
  chatContent: HTMLElement;
  chatWrapper: HTMLElement;
  chatBox: HTMLElement;
  originalStyles = {};

  eventHandler: EventListener;
  eventsToOverride = [
    'mousedown', 'mousemove', 'mouseup',
  ];

  pluginSettings: Settings = {
    'Chat Width': {
      type: 'number',
      value: this.chatWidth,
      stateHandler: this.handleChatWidthChanged.bind(this)
    }
  }

  async init() {
    document.genlite.registerPlugin(this);

    this.eventHandler = this.redirectEventToCanvas.bind(this);
    this.chatBackground = document.getElementById('new_ux-chat-box');
    this.originalStyles['chatBackground'] = this.chatBackground.getAttribute('style');

    this.chatContent = document.getElementById('new_ux-chat-dialog-box-content');
    this.originalStyles['chatContent'] = this.chatContent.getAttribute('style');

    this.chatWrapper = document.getElementById('new_ux-chat-box__inner-wrapper');
    this.originalStyles['chatWrapper'] = this.chatWrapper.getAttribute('style');

    this.chatBox = document.getElementById('new_ux-chat-dialog-box');
    this.originalStyles['chatBox'] = this.chatBox.getAttribute('style');
  }

  async postInit() {
    document.genlite.ui.registerPlugin("Simplified Chat UI", null, this.handlePluginState.bind(this), this.pluginSettings);
  }

  handlePluginState(state: boolean): void {
    this.isPluginEnabled = state;
    if (state) {
      this.setChatStyles();
      this.hookPointerEvents();
    } else {
      this.revertChatStyles();
      this.unhookPointerEvents();
    }
  }

  handleChatWidthChanged(value: number) {
    this.chatWidth = value;
    if (this.isPluginEnabled) {
      this.setChatStyles();
    }
  }

  setChatStyles() {
    this.chatBackground.style.background = 'rgba(0, 0, 0, 0.7)';
    this.chatBackground.style.clipPath = 'none';
    this.chatBackground.style.width = `${this.chatWidth}px`;
    this.chatContent.style.width = `calc(${this.chatWidth}px - 36px)`;
    this.chatWrapper.style.left = '0px';
    this.chatWrapper.style.width = `calc(100% - 10px)`;
    this.chatBox.style.background = 'transparent';
  }

  revertChatStyles() {
    this.chatBackground.setAttribute('style', this.originalStyles['chatBackground']);
    this.chatContent.setAttribute('style', this.originalStyles['chatContent']);
    this.chatWrapper.setAttribute('style', this.originalStyles['chatWrapper']);
    this.chatBox.setAttribute('style', this.originalStyles['chatBox']);
  }

  hookPointerEvents() {
    for (const eventName of this.eventsToOverride) {
        this.chatBackground.addEventListener(eventName, this.eventHandler);
    }
  }

  unhookPointerEvents() {
    for (const eventName of this.eventsToOverride) {
        this.chatBackground.removeEventListener(eventName, this.eventHandler);
    }
  }

  redirectEventToCanvas(event: Event) {
      // TODO: this does not work yet because genfanad manually checks that the
      //       game canvas matches :hover before handling this event. We need
      //       a workaround for this (override the method, or implement scroll)
      document.dispatchEvent(new (event as any).constructor(event.type, event));
      event.preventDefault();
      event.stopPropagation();
  }

}
