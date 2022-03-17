'use strict';

const JWT = require('@liqd-js/jwt');

module.exports = class WebergencyAuth extends require('@webergency/api')
{
    constructor( clientID, clientSecret )
    {
        let jwt = new JWT({});

        //super( 'https://api.auth.webergency.com', clientID, clientSecret,
        super( 'http://localhost:8082', clientID, clientSecret,
        {
            'user.register'     : ( $, user )   => $.client.request(  'PUT', 'user',  { body: user }),
            'user.login'        : ( $, user, options ) => 
            {
                let headers = {};

                options?.request?.headers?.['user-agent'] && ( headers['user-agent'] = options.request.headers['user-agent'] );
                options?.request && ( headers['x-forwarded-for'] = options.request.headers?.['x-forwarded-for'] || options.request?.socket?.remoteAddress );

                console.log( headers );

                return $.client.request( 'POST', 'login', { body: user, headers });
            },
            'jwt': token => jwt.parse( token )
        });

        Object.defineProperty( this, 'name', { value: 'WebergencyAuth' });
    }
}