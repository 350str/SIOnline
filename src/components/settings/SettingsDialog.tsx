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

import './SettingsDialog.css';

interface SettingsDialogProps {
	settings: SettingsState;
	onMute: (isSoundEnabled: boolean) => void;
	onSexChanged: (newSex: Sex) => void;
	onClose: () => void;
}

const mapStateToProps = (state: State) => ({
	settings: state.settings
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
	onMute: (isSoundEnabled: boolean) => {
		dispatch(settingsActionCreators.isSoundEnabledChanged(isSoundEnabled));
	},
	onSexChanged: (newSex: Sex) => {
		dispatch(settingsActionCreators.onSexChanged(newSex));
	},
	onClose: () => {
		dispatch(actionCreators.showSettings(false));
	}
});

export class SettingsDialog extends React.Component<SettingsDialogProps> {
	private layout: React.RefObject<HTMLDivElement>;

	constructor(props: SettingsDialogProps) {
		super(props);

		this.layout = React.createRef<HTMLDivElement>();
	}

	hide = (e: Event) => {
		if (!this.layout.current || e.target instanceof Node && this.layout.current.contains(e.target as Node)) {
			return;
		}

		this.props.onClose();
	}

	componentWillUnmount() {
		window.removeEventListener('mousedown', this.hide);
		console.log('b');
	}

	componentDidMount() {
		window.addEventListener('mousedown', this.hide);
		console.log('a');
	}

	private onSexChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onSexChanged(e.target.id === 'male' && e.target.checked ? Sex.Male : Sex.Female);
	}

	render() {
		return (
			<Dialog id="settingsDialog" title={localization.settings} onClose={this.props.onClose}>
				<div ref={this.layout} className="settingsDialogBody">
					<input id="isSoundEnabled" type="checkbox" checked={this.props.settings.isSoundEnabled}
						onChange={() => this.props.onMute(!this.props.settings.isSoundEnabled)} />
					<label htmlFor="isSoundEnabled">{localization.sound}</label>

					<p className="header">{localization.sex}</p>
						<div className="sexLogin">
							<input type="radio" id="male" name="sex"
								checked={this.props.settings.sex === Sex.Male} onChange={this.onSexChanged} />
							<label htmlFor="male">{localization.male}</label>
							<input type="radio" id="female" name="sex"
								checked={this.props.settings.sex === Sex.Female} onChange={this.onSexChanged} />
							<label htmlFor="female">{localization.female}</label>
						</div>
				</div>
			</Dialog>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);