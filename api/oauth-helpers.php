<?php
declare(strict_types=1);

function oauth_session_start(): void {
    session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off','httponly'=>true,'samesite'=>'Lax']);
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
}

function oauth_config(): array {
    $configFile = dirname(__DIR__) . '/config.php';
    $config = is_file($configFile) ? require $configFile : [];
    $oauth = is_array($config['oauth'] ?? null) ? $config['oauth'] : [];
    $google = [
        'client_id' => trim((string)(getenv('BMM_GOOGLE_OAUTH_CLIENT_ID') ?: ($oauth['google']['client_id'] ?? ''))),
        'client_secret' => trim((string)(getenv('BMM_GOOGLE_OAUTH_CLIENT_SECRET') ?: ($oauth['google']['client_secret'] ?? ''))),
        'redirect_uri' => trim((string)(getenv('BMM_GOOGLE_OAUTH_REDIRECT_URI') ?: ($oauth['google']['redirect_uri'] ?? ''))),
    ];
    if ($google['client_id'] !== '' || $google['client_secret'] !== '' || $google['redirect_uri'] !== '') $oauth['google'] = $google;
    return $oauth;
}

function oauth_provider_config(string $provider): ?array {
    if (!in_array($provider, ['google','facebook'], true)) return null;
    $providerConfig = oauth_config()[$provider] ?? null;
    if (!is_array($providerConfig)) return null;
    $id = trim((string)($providerConfig['client_id'] ?? ''));
    $secret = trim((string)($providerConfig['client_secret'] ?? ''));
    $redirectUri = trim((string)($providerConfig['redirect_uri'] ?? ''));
    return $id !== '' && $secret !== '' && $redirectUri !== '' ? ['client_id'=>$id,'client_secret'=>$secret,'redirect_uri'=>$redirectUri] : null;
}

function oauth_return_path(string $path): string {
    return in_array($path, ['/account/','/marketplace/','/seller/'], true) ? $path : '/account/';
}

function oauth_site_url(string $path): string { return 'https://www.bookmymetal.com' . $path; }

function oauth_redirect(string $path, array $query=[]): never {
    $url = oauth_site_url($path);
    if ($query) $url .= '?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
    header('Location: ' . $url, true, 302);
    exit;
}

function oauth_http_post(string $url, array $payload): array {
    if (!function_exists('curl_init')) throw new RuntimeException('OAuth requires PHP cURL on the server.');
    $curl = curl_init($url);
    curl_setopt_array($curl, [CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>http_build_query($payload,'','&',PHP_QUERY_RFC3986),CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>15,CURLOPT_CONNECTTIMEOUT=>8,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_HTTPHEADER=>['Accept: application/json']]);
    $body = curl_exec($curl); $code = (int)curl_getinfo($curl, CURLINFO_RESPONSE_CODE); $error = curl_error($curl); curl_close($curl);
    if ($body === false || $code < 200 || $code >= 300) throw new RuntimeException($error ?: 'OAuth provider token exchange failed.');
    $data = json_decode($body, true); if (!is_array($data)) throw new RuntimeException('OAuth provider returned an invalid token response.');
    return $data;
}

function oauth_http_get(string $url, array $headers=[]): array {
    if (!function_exists('curl_init')) throw new RuntimeException('OAuth requires PHP cURL on the server.');
    $curl = curl_init($url);
    curl_setopt_array($curl, [CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>15,CURLOPT_CONNECTTIMEOUT=>8,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_HTTPHEADER=>array_merge(['Accept: application/json'],$headers)]);
    $body = curl_exec($curl); $code = (int)curl_getinfo($curl, CURLINFO_RESPONSE_CODE); $error = curl_error($curl); curl_close($curl);
    if ($body === false || $code < 200 || $code >= 300) throw new RuntimeException($error ?: 'OAuth provider identity lookup failed.');
    $data = json_decode($body, true); if (!is_array($data)) throw new RuntimeException('OAuth provider returned an invalid identity response.');
    return $data;
}
