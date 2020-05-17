﻿import Sex from '../model/enums/Sex';
import MainView from '../model/enums/MainView';
import GamesFilter from '../model/enums/GamesFilter';
import OnlineMode from '../model/enums/OnlineMode';
import ChatMessage from '../model/ChatMessage';
import ChatMode from '../model/enums/ChatMode';
import GameType from '../model/enums/GameType';
import Role from '../model/enums/Role';
import RunState, { initialState as runInitialState } from './run/RunState';
import GameInfo from '../model/server/GameInfo';
import localization from '../model/resources/localization';

export default interface State {
	user: {
		login: string;
		sex: Sex;
	};
	login: {
		inProgress: boolean;
		errorMessage: string | null;
	};
	ui: {
		mainView: MainView;
		previousMainView: MainView;
		onlineView: OnlineMode;
		windowWidth: number;
	};
	online: {
		inProgress: boolean;
		gamesFilter: GamesFilter;
		games: Record<number, GameInfo>;
		selectedGameId: number;
		users: string[];
		currentMessage: string;
		messages: ChatMessage[];
		password: string;
		chatMode: ChatMode;
		newGameShown: boolean;
		gameCreationProgress: boolean;
		gameCreationError: string | null;
	};
	game: {
		name: string;
		type: GameType;
		role: Role;
		playersCount: number;
		id: number;
		isHost: boolean;
		isAutomatic: boolean;
	};
	run: RunState;
	common: {
		computerAccounts: string[] | null;
	};
}

export const initialState: State = {
	user: {
		login: '',
		sex: Sex.Male
	},
	login: {
		inProgress: false,
		errorMessage: null
	},
	ui: {
		mainView: MainView.Loading,
		previousMainView: MainView.Loading,
		onlineView: OnlineMode.Games,
		windowWidth: window.innerWidth
	},
	online: {
		inProgress: false,
		gamesFilter: GamesFilter.NoFilter,
		games: {},
		selectedGameId: -1,
		users: [],
		currentMessage: '',
		messages: [{
			sender: localization.appUser,
			text: localization.greeting
		}],
		password: '',
		chatMode: ChatMode.Chat,
		newGameShown: false,
		gameCreationProgress: false,
		gameCreationError: null
	},
	game: {
		name: '',
		type: GameType.Simple,
		role: Role.Player,
		playersCount: 3,
		id: -1,
		isHost: false,
		isAutomatic: false
	},
	run: runInitialState,
	common: {
		computerAccounts: null
	}
};