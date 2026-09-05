<?php
// Copy this file to config.php on Hostinger and fill in your private credentials.
// NEVER commit the real config.php to GitHub.
return [
    'db_host' => 'srv877.hstgr.io',
    'db_name' => 'u262231215_bookmymetal',
    'db_user' => 'u262231215_bookmymetal',
    'db_pass' => 'YOUR_PRIVATE_DATABASE_PASSWORD',
    // Keep OAuth client secrets in config.php only; never expose them to browser code.
    'oauth' => [
        'google' => [
            'client_id' => 'GOOGLE_OAUTH_CLIENT_ID',
            'client_secret' => 'GOOGLE_OAUTH_CLIENT_SECRET',
            'redirect_uri' => 'https://www.bookmymetal.com/api/oauth-callback.php',
        ],
        'facebook' => [
            'client_id' => 'FACEBOOK_APP_ID',
            'client_secret' => 'FACEBOOK_APP_SECRET',
            'redirect_uri' => 'https://www.bookmymetal.com/api/oauth-callback.php',
        ],
    ],
    // OTP delivery configuration. Set only in config.php on the server.
    'otp' => [
        'email_from' => 'BOOKMYMETAL_VERIFIED_SENDER_EMAIL',
        'twilio_account_sid' => 'TWILIO_ACCOUNT_SID',
        'twilio_auth_token' => 'TWILIO_AUTH_TOKEN',
        'twilio_from' => 'TWILIO_SENDER_NUMBER',
    ],
];
