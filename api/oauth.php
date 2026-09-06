<?php
declare(strict_types=1);
require_once __DIR__ . '/oauth-helpers.php';
oauth_session_start();
$provider = (string)($_GET['provider'] ?? '');
$returnPath = oauth_return_path((string)($_GET['return'] ?? '/account/'));
$config = oauth_provider_config($provider);
if (!$config) oauth_redirect('/account/', ['oauth_error'=>'credentials']);
$state = bin2hex(random_bytes(32));
$_SESSION['oauth_state'] = ['value'=>$state,'provider'=>$provider,'return'=>$returnPath,'created_at'=>time()];
if ($provider === 'google') {
    $params = ['client_id'=>$config['client_id'],'redirect_uri'=>$config['redirect_uri'],'response_type'=>'code','scope'=>'openid email profile','state'=>$state,'prompt'=>'select_account'];
    header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params,'','&',PHP_QUERY_RFC3986), true, 302); exit;
}
$params = ['client_id'=>$config['client_id'],'redirect_uri'=>$config['redirect_uri'],'response_type'=>'code','scope'=>'email,public_profile','state'=>$state];
header('Location: https://www.facebook.com/v20.0/dialog/oauth?' . http_build_query($params,'','&',PHP_QUERY_RFC3986), true, 302); exit;
