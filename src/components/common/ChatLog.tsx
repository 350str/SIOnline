import * as React from 'react';
import ChatMessage from '../../model/ChatMessage';

import './ChatLog.css';

interface ChatLogProps {
	messages: ChatMessage[];
	className: string;
}

export default class ChatLog extends React.Component<ChatLogProps> {
	private myRef: React.RefObject<HTMLDivElement>;

	constructor(props: ChatLogProps) {
		super(props);

		this.myRef = React.createRef<HTMLDivElement>();
	}

	componentDidUpdate(): void {
		if (this.myRef.current) {
			this.myRef.current.scrollTop = this.myRef.current.scrollHeight;
		}
	}

	render(): JSX.Element {
		return (
			<div ref={this.myRef} className={`chatLog ${this.props.className}`}>
				{this.props.messages.map((message, index) => message.sender
					? <span key={index}><b>{message.sender}</b>{`: ${message.text}`}</span>
					: <span key={index}>{message.text}</span>)}
			</div>
		);
	}
}
