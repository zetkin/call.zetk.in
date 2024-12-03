import * as types from '.';


export function retrieveUserMemberships() {
    return ({ dispatch, z }) => {
        dispatch({
            type: types.RETRIEVE_USER_MEMBERSHIPS,
            payload: {
                promise: z.resource('users', 'me', 'memberships')
                    .get()
                    .then(res => {
                        return Promise.all(res.data.data.map(membership => Promise.resolve(membership)
                            .then(membership => {
                                return z.resource('orgs', membership.organization.id, 'people', membership.profile.id)
                                    .get()
                                    .then(profileRes => {
                                        const profileData = profileRes.data.data;
                                        // Look for special custom fields for telavox user credentials to assess
                                        // whether to use VoIP for this caller profile.
                                        membership.profile.has_voip_credentials = (
                                            !!profileData.telavox_username && !!profileData.telavox_password
                                        );
                                    });
                            })
                        ))
                        .then(() => res);
                    })
            }
        });
    };
}

export function setUserData(data) {
    return {
        type: types.SET_USER_DATA,
        payload: data,
    };
}
