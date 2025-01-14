import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import Dialog from '../common/Dialog';
import State from '../../state/State';
import actionCreators from '../../state/actionCreators';
import localization from '../../model/resources/localization';
import SettingsState from '../../state/settings/SettingsState';
import settingsActionCreators from '../../state/settings/settingsActionCreators';
import Sex from '../../model/enums/Sex';
import TimeSettingsView from './TimeSettingsView';
import ProgressBar from '../common/ProgressBar';

import './SettingsDialog.css';

interface SettingsDialogProps {
	settings: SettingsState;
	onSoundVolumeChange: (volume: number) => void;
	avatar: string | null;
	avatarLoadError: string | null;
	avatarLoadProgress: boolean;
	onShowPersonsAtBottomOnWideScreenChanged: (showPersonsAtBottomOnWideScreen: boolean) => void;
	onSexChanged: (newSex: Sex) => void;
	onAvatarSelected: (avatar: File) => void;
	onOralChanged: (oral: boolean) => void;
	onFalseStartsChanged: (falseStarts: boolean) => void;
	onHintShowmanChanged: (hintShowman: boolean) => void;
	onReadingSpeedChanged: (readingSpeed: number) => void;
	onManagedChanged: (managed: boolean) => void;
	onIgnoreWrongChanged: (ignoreWrong: boolean) => void;
	onPartialTextChanged: (hintShowman: boolean) => void;
	onLanguageChanged: (language: string | null) => void;
	onReset: () => void;
	onClose: () => void;
}

const mapStateToProps = (state: State) => ({
	settings: state.settings,
	avatar: state.user.avatar,
	avatarLoadError: state.common.avatarLoadError,
	avatarLoadProgress: state.common.avatarLoadProgress
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
	onSoundVolumeChange: (volume: number) => {
		dispatch(settingsActionCreators.onSoundVolumeChanged(volume));
	},
	onShowPersonsAtBottomOnWideScreenChanged: (showPersonsAtBottomOnWideScreen: boolean) => {
		dispatch(settingsActionCreators.showPersonsAtBottomOnWideScreenChanged(showPersonsAtBottomOnWideScreen));
	},
	onSexChanged: (newSex: Sex) => {
		dispatch(settingsActionCreators.onSexChanged(newSex));
	},
	onAvatarSelected: (avatar: File) => {
		dispatch(actionCreators.onAvatarSelected(avatar) as any);
	},
	onOralChanged: (oral: boolean) => {
		dispatch(settingsActionCreators.onOralChanged(oral));
	},
	onFalseStartsChanged: (falseStarts: boolean) => {
		dispatch(settingsActionCreators.onFalseStartsChanged(falseStarts));
	},
	onHintShowmanChanged: (hintShowman: boolean) => {
		dispatch(settingsActionCreators.onHintShowmanChanged(hintShowman));
	},
	onReadingSpeedChanged: (readingSpeed: number) => {
		dispatch(settingsActionCreators.onReadingSpeedChanged(readingSpeed));
	},
	onManagedChanged: (managed: boolean) => {
		dispatch(settingsActionCreators.onManagedChanged(managed));
	},
	onIgnoreWrongChanged: (ignoreWrong: boolean) => {
		dispatch(settingsActionCreators.onIgnoreWrongChanged(ignoreWrong));
	},
	onPartialTextChanged: (partialText: boolean) => {
		dispatch(settingsActionCreators.onPartialTextChanged(partialText));
	},
	onLanguageChanged: (language: string | null) => {
		dispatch(settingsActionCreators.languageChanged(language));
	},
	onReset: () => {
		dispatch(settingsActionCreators.resetSettings());
	},
	onClose: () => {
		dispatch(actionCreators.showSettings(false));
	},
});

export class SettingsDialog extends React.Component<SettingsDialogProps> {
	private layout: React.RefObject<HTMLDivElement>;

	constructor(props: SettingsDialogProps) {
		super(props);

		this.layout = React.createRef<HTMLDivElement>();
	}

	componentDidMount(): void {
		window.addEventListener('mousedown', this.hide);
	}

	componentWillUnmount(): void {
		window.removeEventListener('mousedown', this.hide);
	}

	hide = (e: Event): void => {
		if (!this.layout.current || (e.target instanceof Node && this.layout.current.contains(e.target as Node))) {
			return;
		}

		this.props.onClose();
	};

	private onSexChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onSexChanged(e.target.id === 'male' && e.target.checked ? Sex.Male : Sex.Female);
	};

	private onReadingSpeedChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		if (value > 0 && value <= 100) {
			this.props.onReadingSpeedChanged(value);
		}
	};

	private onAvatarChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			this.props.onAvatarSelected(e.target.files[0]);
		}
	};

	private onLanguageChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const language = e.target.value.length == 0 ? null : e.target.value;
		this.props.onLanguageChanged(language);
	};

	render(): JSX.Element {
		return (
			<Dialog id="settingsDialog" ref={this.layout} title={localization.settings} onClose={this.props.onClose}>
				<div className="settingsDialogBody">
					<p className="header">{localization.language}</p>
					<select
						className='settings_language'
						value={this.props.settings.appSettings.culture || ''}
						onChange={this.onLanguageChanged}
					>
						<option value="">{localization.languageDefault}</option>
						<option value="ru">{localization.languageRu}</option>
						<option value="en">{localization.languageEn}</option>
					</select>
					
					<p className="header">{localization.sound}</p>
					<div className="settingItem">
						<input
							id="soundVolume"
							type="range"
							min={0}
							max={1}
							step={0.1}
							value={this.props.settings.soundVolume}
							onChange={(e) => this.props.onSoundVolumeChange(Number(e.target.value))}
						/>
					</div>

					<div className="settingItem">
						<input
							id="showPersonsAtBottomOnWideScreen"
							type="checkbox"
							checked={this.props.settings.showPersonsAtBottomOnWideScreen}
							onChange={() => this.props.onShowPersonsAtBottomOnWideScreenChanged(!this.props.settings.showPersonsAtBottomOnWideScreen)}
						/>
						<label htmlFor="showPersonsAtBottomOnWideScreen">{localization.showPersonsAtBottomOnWideScreen}</label>
					</div>

					<p className='header'>{localization.avatar}</p>
					<div className="avatarBox">
						{this.props.avatar ? <img className='avatarView' src={this.props.avatar} /> : <div className='emptyAvatar' />}
						<input
							type="file"
							accept=".jpg,.jpeg,.png"
							disabled={this.props.avatarLoadProgress}
							onChange={this.onAvatarChanged}
						/>
						<div className='avatarLoadHelper'>
							{this.props.avatarLoadProgress
								? (<div className='avatarLoadingHost'>
										<div className='avatarLoadingMessage'>{localization.loading}</div>
										<ProgressBar isIndeterminate={true} />
									</div>)
								: <span className='avatarLoadError'>{this.props.avatarLoadError || ' '}</span>}
						</div>
					</div>

					<p className="header">{localization.sex}</p>
					<div className="sexLogin">
						<input
							type="radio"
							id="male"
							name="sex"
							checked={this.props.settings.sex === Sex.Male}
							onChange={this.onSexChanged}
						/>
						<label htmlFor="male">{localization.male}</label>
						<input
							type="radio"
							id="female"
							name="sex"
							checked={this.props.settings.sex === Sex.Female}
							onChange={this.onSexChanged}
						/>
						<label htmlFor="female">{localization.female}</label>
					</div>

					<h2>{localization.game}</h2>
					<div className="settingItem">
						<input
							id="oral"
							type="checkbox"
							checked={this.props.settings.appSettings.oral}
							onChange={() => this.props.onOralChanged(!this.props.settings.appSettings.oral)}
						/>
						<label htmlFor="oral">{localization.oralGame}</label>
						<span className="hint">{localization.oralGameHint}</span>
					</div>
					<div className="settingItem">
						<input
							id="falseStarts"
							type="checkbox"
							checked={this.props.settings.appSettings.falseStart}
							onChange={() => this.props.onFalseStartsChanged(!this.props.settings.appSettings.falseStart)}
						/>
						<label htmlFor="falseStarts">{localization.falseStarts}</label>
						<span className="hint">{localization.falseStartsHint}</span>
					</div>
					<div className="settingItem">
						<input
							id="partialText"
							type="checkbox"
							disabled={this.props.settings.appSettings.falseStart}
							checked={this.props.settings.appSettings.partialText}
							onChange={() => this.props.onPartialTextChanged(!this.props.settings.appSettings.partialText)}
						/>
						<label htmlFor="partialText">{localization.partialText}</label>
						<span className="hint">{localization.partialTextHint}</span>
					</div>
					<div className="settingItem">
						<input
							id="hintShowman"
							type="checkbox"
							checked={this.props.settings.appSettings.hintShowman}
							onChange={() => this.props.onHintShowmanChanged(!this.props.settings.appSettings.hintShowman)}
						/>
						<label htmlFor="hintShowman">{localization.hintShowman}</label>
					</div>
					<div className="settingItem">
						<div>
							<input
								className="rangeEditor"
								type="range"
								value={this.props.settings.appSettings.readingSpeed}
								min={1}
								max={100}
								onChange={this.onReadingSpeedChanged}
							/>
							<input
								className="valueEditor"
								type="number"
								value={this.props.settings.appSettings.readingSpeed}
								min={1}
								max={100}
								onChange={this.onReadingSpeedChanged}
							/>
						</div>
					</div>
					<div className="settingItem">
						<input
							id="managed"
							type="checkbox"
							checked={this.props.settings.appSettings.managed}
							onChange={() => this.props.onManagedChanged(!this.props.settings.appSettings.managed)}
						/>
						<label htmlFor="managed">{localization.managed}</label>
						<span className="hint">{localization.managedHint}</span>
					</div>
					<div className="settingItem">
						<input
							id="ignoreWrong"
							type="checkbox"
							checked={this.props.settings.appSettings.ignoreWrong}
							onChange={() => this.props.onIgnoreWrongChanged(!this.props.settings.appSettings.ignoreWrong)}
						/>
						<label htmlFor="ignoreWrong">{localization.ignoreWrong}</label>
					</div>

					<TimeSettingsView />
					<button className="reset" title={localization.resetToDefaultsHint} onClick={this.props.onReset}>
						{localization.resetToDefaults}
					</button>
				</div>
			</Dialog>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);
