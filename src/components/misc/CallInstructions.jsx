import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';

import * as targetUtils from "../../utils/target";


export default class CallPage extends React.Component {
    constructor() {
        super();
        this.state = {
            instructionsOpen: false,
        }
    }

    toggleInstructions(){
        this.setState({instructionsOpen: !this.state.instructionsOpen})
    }

    render() {
        const {call, size} = this.props;
        if(call && size === "small") {
            const target = call.get("target")
            const { instructionsOpen } = this.state;
            const instructionsClasses = cx(
                "CallInstructions",
                {"CallInstructions-open": instructionsOpen}
            );

            return (
                <div className={instructionsClasses}>
                    <div className="CallInstructions-backgroundContainer">
                        <div className="CallInstructions-background"/>
                    </div>
                    <div className="CallInstructions-content">
                        <span className="CallInstructions-title">{target.get("name")}</span>
                        <div className="CallInstructions-numbers">
                            {targetUtils.getNumbers(target).map(num => (
                                <a key={num} href={"tel:" + num} className="CallInstructions-number">{num}</a>
                            ))}
                        </div>
                        <p className="CallInstructions-instructions">
                            <Msg id="misc.callInstructions.instructions"/>
                        </p>
                    </div>
                    <button className="CallInstructions-button" onClick={this.toggleInstructions.bind(this)}>
                        <span className="CallInstructions-icon"/>
                    </button>
                </div>
            )
            
        }
        else {
            return null;
        }
    }
}