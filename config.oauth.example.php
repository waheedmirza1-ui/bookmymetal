<?php
/*
 * Copy the oauth section below into the server-only config.php that Hostinger
 * maintains outside Git. Never commit a real client secret.
 *
 * Callback URL: https://www.bookmymetal.com/api/oauth-callback.php
 */
return [
    'oauth' => [
        'google' => [
            'client_id' => 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            'client_secret' => 'YOUR_GOOGLE_CLIENT_SECRET',
            'redirect_uri' => 'https://www.bookmymetal.com/api/oauth-callback.php',
        ],
    ],
];
