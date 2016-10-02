import { PropTypes as ReactPropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

export default Object.assign({}, ReactPropTypes, ImmutablePropTypes, {
    complexList: ImmutablePropTypes.mapContains({
        isPending: ReactPropTypes.bool,
    }),
});
