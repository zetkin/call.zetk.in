import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';


export default class CallLogItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: null,
        };
    }

    componentDidMount() {
        let node = ReactDOM.findDOMNode(this.refs.notes);
        if (node && node.clientHeight > 25) {
            this.setState({
                viewMode: 'contracted',
            });
        }
    }

    render() {
        let call = this.props.call;
        let state = call.get('state');

        let allocTime = new Date(call.get('allocation_time'));

        let summaryMsg = 'misc.callLog.summary.status' + state;
        let summaryValues = {
            caller: call.getIn(['caller', 'name']),
            target: call.getIn(['target', 'name']),
        };

        let classes = cx('CallLogItem', 'status' + state, {
            contracted: this.state.viewMode === 'contracted',
            expanded: this.state.viewMode === 'expanded',
        });

        let notes = null;
        if (call.get('notes').length > 0) {
            notes = (
                <div ref="notes"
                    className="CallLogItem-notes">
                    {   call.get('notes') }
                </div>
            );
        }

        let expandButton = null;
        if (this.state.viewMode && call.get('notes').length > 30) {
            expandButton = (
                <button className="CallLogItem-button"
                    onClick={ this.onExpandButtonClick.bind(this) }>
                </button>
            );
        }

        return (
            <div className={ classes }>
                <div className="CallLogItem-status">
                    <span className="CallLogItem-statusBar0"/>
                    <span className="CallLogItem-statusBar1"/>
                </div>
                <div className="CallLogItem-timeStamp">
                    <FormattedDate value={ allocTime }
                        weekday="short"
                        day="numeric"
                        month="short"
                        year="numeric"
                        hour="2-digit"
                        minute="2-digit"
                        />
                </div>
                <div className="CallLogItem-summary">
                    <Msg id={ summaryMsg }
                        values={ summaryValues }
                        />
                </div>
                { notes }
                { expandButton }
                <div className="CallLogItem-caller">
                    { call.getIn(['caller', 'name']) }</div>
            </div>
        );
    }

    onExpandButtonClick() {
        this.setState({
            viewMode: this.state.viewMode === 'contracted'?
                'expanded' : 'contracted',
        });
    }
}
