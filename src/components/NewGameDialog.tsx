import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import actionCreators from '../state/actionCreators';
import localization from '../model/resources/localization';
import Dialog from './common/Dialog';
import ProgressBar from './common/ProgressBar';
import State from '../state/State';
import Role from '../model/enums/Role';
import GameType from '../model/enums/GameType';
import Constants from '../model/enums/Constants';
import PackageType from '../model/enums/PackageType';
import SIStorageDialog from './SIStorageDialog';

import './NewGameDialog.css';

interface NewGameDialogProps {
	isConnected: boolean;
	isSingleGame: boolean;
	gameName: string;
	gamePassword: string;
	gamePackageType: PackageType;
	gamePackageName: string;
	gamePackageData: File | null;
	gameType: GameType;
	gameRole: Role;
	isShowmanHuman: boolean;
	playersCount: number;
	humanPlayersCount: number;
	inProgress: boolean;
	error: string | null;
	uploadPackageProgress: boolean;
	uploadPackagePercentage: number;

	onGameNameChanged: (newGameName: string) => void;
	onGamePasswordChanged: (newGamePassword: string) => void;
	onGamePackageTypeChanged: (type: PackageType) => void;
	onGamePackageDataChanged: (name: string, data: File | null) => void;
	onGamePackageLibraryChanged: (id: string, name: string) => void;
	onGameTypeChanged: (newGameType: number) => void;
	onGameRoleChanged: (newGameRole: Role) => void;
	showmanTypeChanged: (isHuman: boolean) => void;
	onPlayersCountChanged: (gamePlayersCount: number) => void;
	onHumanPlayersCountChanged: (gameHumanPlayersCount: number) => void;
	onCreate: (isSingleGame: boolean) => void;
	onShowSettings: () => void;
	onClose: () => void;
}

interface NewGameDialogState {
	isSIStorageOpen: boolean;
}

const mapStateToProps = (state: State) => ({
	isConnected: state.common.isConnected,
	gameName: state.game.name,
	gamePassword: state.game.password,
	gamePackageType: state.game.package.type,
	gamePackageName: state.game.package.name,
	gamePackageData: state.game.package.data,
	gameType: state.game.type,
	gameRole: state.game.role,
	isShowmanHuman: state.game.isShowmanHuman,
	playersCount: state.game.playersCount,
	humanPlayersCount: state.game.humanPlayersCount,
	inProgress: state.online.gameCreationProgress,
	error: state.online.gameCreationError,
	uploadPackageProgress: state.online.uploadPackageProgress,
	uploadPackagePercentage: state.online.uploadPackagePercentage
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
	onGameNameChanged: (newGameName: string) => {
		dispatch(actionCreators.gameNameChanged(newGameName));
	},
	onGamePasswordChanged: (newGamePassword: string) => {
		dispatch(actionCreators.gamePasswordChanged(newGamePassword));
	},
	onGamePackageTypeChanged: (type: PackageType) => {
		dispatch(actionCreators.gamePackageTypeChanged(type));
	},
	onGamePackageDataChanged: (name: string, data: File | null) => {
		dispatch(actionCreators.gamePackageDataChanged(name, data));
	},
	onGamePackageLibraryChanged: (id: string, name: string) => {
		dispatch(actionCreators.gamePackageLibraryChanged(id, name));
	},
	onGameTypeChanged: (newGameType: number) => {
		dispatch(actionCreators.gameTypeChanged(newGameType));
	},
	onGameRoleChanged: (newGameRole: Role) => {
		dispatch(actionCreators.gameRoleChanged(newGameRole));
	},
	showmanTypeChanged: (isHuman: boolean) => {
		dispatch(actionCreators.showmanTypeChanged(isHuman));
	},
	onPlayersCountChanged: (playersCount: number) => {
		dispatch(actionCreators.playersCountChanged(playersCount));
	},
	onHumanPlayersCountChanged: (humanPlayersCount: number) => {
		dispatch(actionCreators.humanPlayersCountChanged(humanPlayersCount));
	},
	onShowSettings: () => {
		dispatch(actionCreators.showSettings(true));
	},
	onCreate: (isSingleGame: boolean) => {
		dispatch(actionCreators.createNewGame(isSingleGame) as unknown as Action);
	}
});

export class NewGameDialog extends React.Component<NewGameDialogProps, NewGameDialogState> {
	private fileRef: React.RefObject<HTMLInputElement>;

	constructor(props: NewGameDialogProps) {
		super(props);

		this.fileRef = React.createRef<HTMLInputElement>();

		this.state = {
			isSIStorageOpen: false
		};
	}

	private onGameNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onGameNameChanged(e.target.value);
	};

	private onGamePasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onGamePasswordChanged(e.target.value);
	};

	private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.charCode === Constants.KEY_ENTER) {
			this.props.onCreate(this.props.isSingleGame);
		}
	};

	private onGamePackageTypeChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (parseInt(e.target.value, 10) === PackageType.SIStorage) {
			this.setState({
				isSIStorageOpen: true
			});
		} else {
			this.props.onGamePackageTypeChanged(parseInt(e.target.value, 10));
		}
	};

	private onGamePackageDataChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			this.props.onGamePackageDataChanged(e.target.value, e.target.files[0]);
		}
	};

	private onGameTypeChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.props.onGameTypeChanged(parseInt(e.target.value, 10));
	};

	private onGameRoleChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.props.onGameRoleChanged(parseInt(e.target.value, 10));
	};

	private onShowmanTypeChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.props.showmanTypeChanged(parseInt(e.target.value, 10) === 1);
	};

	private onPlayersCountChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onPlayersCountChanged(parseInt(e.target.value, 10));
	};

	private onHumanPlayersCountChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onHumanPlayersCountChanged(parseInt(e.target.value, 10));
	};

	private onSelectFile = () => {
		if (this.fileRef.current) {
			this.fileRef.current.click();
		}
	};

	private onSIPackageDialogClose = () => {
		this.setState({
			isSIStorageOpen: false
		});
	};

	private onSelectSIPackage = async (id: string, name: string) => {
		this.setState({
			isSIStorageOpen: false
		});
		this.props.onGamePackageTypeChanged(PackageType.SIStorage);
		this.props.onGamePackageLibraryChanged(id, name);
	};

	render(): JSX.Element {
		const humanPlayersMaxCount = this.props.playersCount - (this.props.gameRole === Role.Player ? 1 : 0);
		const botsCount = humanPlayersMaxCount - this.props.humanPlayersCount;
		const siPackageName = this.props.gamePackageType === PackageType.SIStorage ? this.props.gamePackageName : null;

		return (
			<>
				<Dialog id="newGameDialog" title={localization.newGame} onClose={this.props.onClose}>
					<div className="settings">
						<p>{localization.gameName}</p>
						<input
							type="text"
							value={this.props.gameName}
							onChange={this.onGameNameChanged}
							onKeyPress={this.onKeyPress}
						/>
						{this.props.isSingleGame ? null : (
							<>
								<p>{localization.password}</p>
								<input
									type="password"
									value={this.props.gamePassword}
									onChange={this.onGamePasswordChanged}
									onKeyPress={this.onKeyPress}
								/>
							</>
						)}
						<p>{localization.questionPackage}</p>
						<select
							className="packageTypeSelector"
							value={siPackageName || this.props.gamePackageType}
							onChange={this.onGamePackageTypeChanged}
						>
							<option value="0">{localization.randomThemes}</option>
							<option value="1">{localization.file}</option>
							<option value="2">{`${localization.libraryTitle}...`}</option>
							{siPackageName && <option value={siPackageName}>{siPackageName}</option>}
						</select>
						{this.props.gamePackageType === PackageType.File ? (
							<div className="packageFileBox">
								<input ref={this.fileRef} type="file" accept=".siq" onChange={this.onGamePackageDataChanged} />
								<input className="selector" type="button" value={localization.select} onClick={this.onSelectFile} />
								{this.props.gamePackageData ? <span>{this.props.gamePackageData.name}</span> : null}
							</div>
						) : null}
						<p>{localization.gameType}</p>
						<select value={this.props.gameType} onChange={this.onGameTypeChanged}>
							<option value="1">{localization.sport}</option>
							<option value="0">{localization.tv}</option>
						</select>
						<p>{localization.role}</p>
						<select value={this.props.gameRole} onChange={this.onGameRoleChanged}>
							<option value="0">{localization.viewer}</option>
							<option value="1">{localization.player}</option>
							<option value="2">{localization.showman}</option>
						</select>
						{this.props.gameRole === Role.Showman || this.props.isSingleGame ? null : (
							<>
								<p>{localization.showman}</p>
								<select
									className="showmanTypeSelector"
									value={this.props.isShowmanHuman ? 1 : 0}
									onChange={this.onShowmanTypeChanged}
								>
									<option value="1">{localization.human}</option>
									<option value="0">{localization.bot}</option>
								</select>
								{this.props.isShowmanHuman ? '👤' : '🖥️'}
							</>
						)}
						<p>{localization.players}</p>
						<div className="playersBlock">
							<span className="playersCountTitle">{`${localization.total} `}</span>
							<span className="playersCountValue">{this.props.playersCount}</span>
							<input
								type="range"
								className="playersCount"
								min={2}
								max={12}
								value={this.props.playersCount}
								onChange={this.onPlayersCountChanged}
							/>
						</div>
						{this.props.isSingleGame ? null : (
							<>
								<div className="playersBlock">
									<span className="playersCountTitle">{`${localization.humanPlayers} `}</span>
									<span className="playersCountValue">{this.props.humanPlayersCount}</span>
									<input
										type="range"
										className="playersCount"
										min={0}
										max={humanPlayersMaxCount}
										disabled={humanPlayersMaxCount === 0}
										value={this.props.humanPlayersCount}
										onChange={this.onHumanPlayersCountChanged}
									/>
								</div>
								<div className="playersBlock">
									<span className="playersCountTitle">{`${localization.computerPlayers} `}</span>
									<span className="playersCountValue">{botsCount}</span>
								</div>
								<div className="playersBlock">
									{this.props.gameRole === Role.Player ? '🧑' : null}
									{Array.from(Array(this.props.humanPlayersCount).keys()).map(() => '👤')}
									{Array.from(Array(botsCount).keys()).map(() => '🖥️')}
								</div>
							</>
						)}
					</div>
					<div className="gameCreationError">{this.props.error}</div>
					<div className="buttonsArea">
						<button
							type="button"
							className="showSettings"
							disabled={!this.props.isConnected || this.props.inProgress}
							onClick={() => this.props.onShowSettings()}
						>
							{`${localization.settings}…`}
						</button>
						<button
							type="button"
							className="startGame"
							disabled={!this.props.isConnected || this.props.inProgress}
							onClick={() => this.props.onCreate(this.props.isSingleGame)}
						>
							{localization.startGame}
						</button>
					</div>
					{this.props.inProgress ? <ProgressBar isIndeterminate /> : null}
					{this.props.uploadPackageProgress ? (
						<div className="uploadPackagePanel">
							<span>{localization.sendingPackage}</span>
							<ProgressBar isIndeterminate={false} value={this.props.uploadPackagePercentage} />
						</div>
					) : null}
				</Dialog>
				{this.state.isSIStorageOpen && (
					<SIStorageDialog onClose={this.onSIPackageDialogClose} onSelect={this.onSelectSIPackage} />
				)}
			</>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGameDialog);
