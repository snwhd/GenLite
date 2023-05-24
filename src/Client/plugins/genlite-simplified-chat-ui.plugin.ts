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

  originalStyles = {};

  chatWidth: number = 700;

  chatBackground: HTMLElement;
  chatButtons: HTMLElement;
  chatAllButton: HTMLElement;
  chatGameButton: HTMLElement;
  chatQuestButton: HTMLElement;
  chatPublicButton: HTMLElement;
  chatPrivateButton: HTMLElement;
  chatClanButton: HTMLElement;
  chatFriendsButton: HTMLElement;
  chatIgnoredButton: HTMLElement;
  chatToggleButton: HTMLElement;
  chatFriendsDiv: HTMLElement;
  chatInputBox: HTMLElement;
  chatIgnoredDiv: HTMLElement;
  chatContent: HTMLElement;
  chatWrapper: HTMLElement;
  chatBox: HTMLElement;

  pointerEventOverrides: Array<HTMLElement> = [];

  emptyStyle = '';
  styleAutoEvents = `pointer-events: auto;`;

  hasLoadedElements = false;
  hasLoadedOriginalStyles = false;

  pluginSettings: Settings = {
    'Chat Width': {
      type: 'number',
      value: this.chatWidth,
      stateHandler: this.handleChatWidthChanged.bind(this)
    }
  }

  async init() {
    document.genlite.registerPlugin(this);
  }

  async postInit() {
    document.genlite.ui.registerPlugin("Simplified Chat UI", null, this.handlePluginState.bind(this), this.pluginSettings);
  }

  handlePluginState(state: boolean): void {
    this.isPluginEnabled = state;

    if (state) {
      this.start();
    } else {
      this.stop();
    }
  }

  handleChatWidthChanged(value: number) {
    this.chatWidth = value;

    if (this.isPluginEnabled) {
      this.enableUI();
    }
  }

  public stop() {
    this.loadElements();
    this.assignOriginalStyles();
    this.disableUI();
  }

  public start() {
    this.loadElements();
    this.assignOriginalStyles();
    this.enableUI();
  }

  enableUI() {
    for (const entry of this.pointerEventOverrides) {
      entry.setAttribute('style', this.styleAutoEvents);
    }

    this.chatBackground.setAttribute('style', `background: rgba(0,0,0,0.7); clip-path: none; width: ${this.chatWidth}px; pointer-events: none;`);
    this.chatContent.setAttribute('style', `width: calc(${this.chatWidth}px - 36px);`);
    this.chatWrapper.setAttribute('style', 'left: 0px; width: calc(100% - 10px);');
    this.chatBox.setAttribute('style', 'background: transparent');
  }

  disableUI() {
    for (const entry of this.pointerEventOverrides) {
      entry.setAttribute('style', this.emptyStyle);
    }

    this.chatBackground.setAttribute('style', this.originalStyles['chatBackground']);
    this.chatContent.setAttribute('style', this.originalStyles['chatContent']);
    this.chatWrapper.setAttribute('style', this.originalStyles['chatWrapper']);

    this.chatBox.setAttribute('style', this.originalStyles['chatBox']);
  }

  loadElements() {
    if (this.hasLoadedElements) {
      return;
    }

    this.chatBackground = document.getElementById('new_ux-chat-box');
    this.chatButtons = document.getElementById('new_ux-chat__upper-buttons-row');
    this.chatAllButton = document.getElementById('new_ux-chat-all-button');
    this.chatGameButton = document.getElementById('new_ux-chat-game-button');
    this.chatQuestButton = document.getElementById('new_ux-chat-quest-button');
    this.chatPublicButton = document.getElementById('new_ux-chat-public-button');
    this.chatPrivateButton = document.getElementById('new_ux-chat-private-button');
    this.chatClanButton = document.getElementById('new_ux-chat-clan-button');
    this.chatFriendsButton = document.getElementById('new_ux-chat_friends-list-window__add-friend-button');
    this.chatIgnoredButton = document.getElementById('new_ux-chat_ignored-window__ignore-user-button');
    this.chatToggleButton = document.getElementById('new_ux-chat-toggle-button');
    this.chatFriendsDiv = document.getElementById('new_ux-chat_friends-list-window');
    this.chatInputBox = document.getElementById('new_ux-chat-tab__chat-prompt');
    this.chatIgnoredDiv = document.getElementById('new_ux-chat_ignored-window');
    this.chatContent = document.getElementById('new_ux-chat-dialog-box-content');
    this.chatWrapper = document.getElementById('new_ux-chat-box__inner-wrapper');
    this.chatBox = document.getElementById('new_ux-chat-dialog-box');

    this.pointerEventOverrides = [
      this.chatBackground,
      this.chatButtons,
      this.chatAllButton,
      this.chatGameButton,
      this.chatQuestButton,
      this.chatPublicButton,
      this.chatPrivateButton,
      this.chatClanButton,
      this.chatFriendsButton,
      this.chatIgnoredButton,
      this.chatToggleButton,
      this.chatFriendsDiv,
      this.chatInputBox,
      this.chatIgnoredDiv,
      this.chatContent,
      this.chatWrapper,
      this.chatBox,
    ];

    this.hasLoadedElements = true;
  }

  assignOriginalStyles() {
    if (this.hasLoadedOriginalStyles) {
      return;
    }

    this.originalStyles['chatBackground'] = this.chatBackground.getAttribute('style');
    this.originalStyles['chatContent'] = this.chatContent.getAttribute('style');
    this.originalStyles['chatWrapper'] = this.chatWrapper.getAttribute('style');
    this.originalStyles['chatBox'] = this.chatBox.getAttribute('style');

    this.hasLoadedOriginalStyles = true;
  }
}
