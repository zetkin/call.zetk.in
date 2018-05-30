import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

export default class Avatar extends React.Component {
    render() {
        const personId = this.props.personId;
        const orgId = this.props.orgId;
        const avatarDomain = '//api.' + process.env.ZETKIN_DOMAIN;
        const avatarSrc = avatarDomain + '/orgs/'
            + orgId
            + '/people/' + personId + '/avatar';
        const avatarStyle = {backgroundImage: 'url("' + avatarSrc + '")'}

        let classes = cx('Avatar', {
            'Avatar-mask': this.props.mask,
        });

        if (this.props.mask) {
            return (
                <div className={ classes } style={ avatarStyle }></div>
            );
        }
        else {
            return (
                <img className={ classes } src={ avatarSrc }/>
            )
        }
    }
}

Avatar.propTypes = {
        personId: React.PropTypes.any, // TODO: Use string
        orgId: React.PropTypes.any,
        mask: React.PropTypes.bool,
};