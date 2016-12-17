import React from 'react';
import { connect, Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';


const IntlReduxProvider = ({ store, ...props }) => {
    return (
        <Provider store={ store }>
            <IntlProvider { ...props }/>
        </Provider>
    );
};

const mapStateToProps = state =>
    state.get('intl').toJS();

export default connect(mapStateToProps)(IntlReduxProvider);
