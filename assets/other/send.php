<?php
require '../../libs/autoload.php';
$data = [];
$from = new SendGrid\Email('Mistermoz', "indicadores@app.com");
$subject = "Hello Budy!";
$to = new SendGrid\Email('Claudio', '' . $_GET['emailTo'] . '');
$text = 'Nombre: ' . $_GET['name'] . '<br>';
$text .= 'Email: ' . $_GET['email'] . '<br>';
$text .= 'Comentario: ' . $_GET['comments'] . '';
$content = new SendGrid\Content("text/HTML", "" . $text . "");
$mail = new SendGrid\Mail($from, $subject, $to, $content);
$apiKey = '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';
$sg = new \SendGrid($apiKey);
$response = $sg->client->mail()->send()->post($mail);
$data['status'] = '' . $response->statusCode() . '';
echo $_GET['callback'] . '('.json_encode($data).')';