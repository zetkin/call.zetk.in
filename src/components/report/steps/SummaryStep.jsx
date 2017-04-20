import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import { toggleSurveyIncluded } from '../../../actions/survey';


const mapStateToProps = (state, props) => ({
    surveyList: state.getIn(['surveys', 'surveyList']),
    surveyResponses: state.getIn(['surveys', 'pendingResponsesByCall', props.call.get('id')]),
});

@connect(mapStateToProps)
export default class SummaryStep extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.surveyResponses) {
            let surveyItems = this.props.surveyResponses.map((sub, key) => {
                let surveyId = key.toString();
                let survey = this.props.surveyList.getIn(['items', surveyId]);
                let included = sub.get('included');

                return (
                    <li key={ surveyId } className="SummaryStep-surveyItem">
                        <input type="checkbox" checked={ included }
                            onChange={ this.onSurveyToggle.bind(this, surveyId) }
                            />
                        <label>{ survey.get('title') }</label>
                    </li>
                );
            }).toList();

            return (
                <div className="SummaryStep">
                    <Msg tagName="p"
                        id="report.steps.summary.surveys.status"
                        values={{ count: surveyItems.size }}/>
                    <ul className="SummaryStep-surveyList">
                        { surveyItems }
                    </ul>
                </div>
            );
        }
        else {
            return null;
        }
    }

    onSurveyToggle(surveyId, ev) {
        this.props.dispatch(toggleSurveyIncluded(surveyId, ev.target.checked));
    }
}
