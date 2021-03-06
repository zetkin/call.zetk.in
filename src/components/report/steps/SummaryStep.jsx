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

    shouldComponentUpdate(nextProps) {
        let surveyCount = this.props.surveyList.get('items').size;
        let nextSurveyCount = nextProps.surveyList.get('items').size;

        if (surveyCount && !nextSurveyCount) {
            // If the surveys are being removed, that's because a new call is
            // being started, i.e we're transitioning away from the rendered
            // call. No use in trying to re-render (some data is missing).
            return false;
        }
        else {
            return true;
        }
    }

    render() {
        if (this.props.surveyResponses) {
            let surveyItems = this.props.surveyResponses.map((sub, key) => {
                let surveyId = key.toString();
                let survey = this.props.surveyList.getIn(['items', surveyId]);
                let included = sub.get('included');

                if (this.props.disableEdit) {
                    let msg = 'report.steps.summary.surveys.' + (included?
                        'surveySubmitted' : 'surveyDiscarded');

                    return (
                        <li key={ surveyId } className="SummaryStep-surveyItem">
                            <Msg id={ msg }
                                values={{ survey: survey.get('title') }}/>
                        </li>
                    );
                }
                else {
                    return (
                        <li key={ surveyId } className="SummaryStep-surveyItem">
                            <input type="checkbox"
                                id={ surveyId }
                                checked={ included }
                                onChange={ this.onSurveyToggle.bind(this, surveyId) }
                            />
                            <label htmlFor={ surveyId }>
                                { survey.get('title') }
                            </label>
                        </li>
                    );
                }
            }).toList();

            let msg = 'report.steps.summary.surveys.' + (this.props.disableEdit?
                'submitted' : 'status');

            return (
                <div className="SummaryStep">
                    <Msg tagName="p" id={ msg }
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
