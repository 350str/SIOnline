import { connect } from 'react-redux';
import localization from '../../model/resources/localization';
import * as React from 'react';
import Sex from '../../model/enums/Sex';
import runActionCreators from '../../state/run/runActionCreators';
import Role from '../../model/enums/Role';
import State from '../../state/State';
import { Dispatch, Action } from 'redux';
import Constants from '../../model/enums/Constants';

interface ChatInputProps {
	message: string;
	onChatMessageChanged: (message : string) => void;
	onChatMessageSend: () => void;
}

const mapStateToProps = (state: State) => ({
	message: state.run.chat.message
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
	onChatMessageSend: () => {
		dispatch((runActionCreators.runChatMessageSend() as object) as Action);
	},
	onChatMessageChanged: (message: string) => {
		dispatch(runActionCreators.runChatMessageChanged(message));
	},
});

// tslint:disable-next-line: function-name
export function ChatInput(props: ChatInputProps) {
	const onMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		props.onChatMessageChanged(e.target.value);
	};

	const onMessageKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.charCode === Constants.KEY_ENTER) {
			props.onChatMessageSend();
			e.preventDefault();
		}
	};

	return (
		<input className="gameInputBox gameMessage" value={props.message}
			onChange={onMessageChanged} onKeyPress={onMessageKeyPress} />
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);