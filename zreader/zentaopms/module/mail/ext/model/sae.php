<?php
private $mta = '';
private $options = array();

public function setMTA()
{
    $this->mta = new SaeMail();
}

private function setSMTP()
{
    $this->options['from']          = $this->config->mail->fromName;
    $this->options['smtp_host']     = $this->config->mail->smtp->host;
    $this->options['smtp_username'] = $this->config->mail->smtp->username;
    $this->options['smtp_password'] = $this->config->mail->smtp->password;
    $this->options['smtp_port']     = !empty($this->config->mail->smtp->port) ? $this->config->mail->smtp->port : 25;
    $this->options['charset']       = $this->config->encoding;
    $this->options['tls']           = !empty($this->config->mail->smtp->secure) ? $this->config->mail->smtp->secure : false;
}

public function send($toList, $subject, $body = '', $ccList = '')
{
    if(!$this->config->mail->turnon) return;

    /* Get realname and email of users. */
    $this->loadModel('user');
    $emails = $this->user->getRealNameAndEmails(str_replace(' ', '', $toList . ',' . $ccList));

    $this->mta->clean();
    $this->setSMTP();
    $this->setTO($toList, $emails);
    $this->setCC($ccList, $emails);
    $this->setSubject($subject);
    $this->setBody($body);
    $this->mta->setOpt($this->options);
    $ret = $this->mta->quickSend($this->options['to'], $this->options['subject'], $this->options['content'], $this->options['smtp_username'], $this->options['smtp_password'], $this->options['smtp_host'], 25 );
    if(!$ret) die(js::error($this->mta->errmsg()));
}

private function setTO($toList, $emails)
{
    $toList = explode(',', str_replace(' ', '', $toList));
    $toMail = '';
    foreach($toList as $account)
    {
        if(!isset($emails[$account]) or isset($emails[$account]->sended) or strpos($emails[$account]->email, '@') == false) continue;
        $toMail .= $emails[$account]->email . ','; 
        $emails[$account]->sended = true;
    }
    $this->options['to'] = rtrim($toMail, ',');
}

private function setCC($ccList, $emails)
{
    $ccList = explode(',', str_replace(' ', '', $ccList));
    $ccMail = '';
    if(!is_array($ccList)) return;
    foreach($ccList as $account)
    {
        if(!isset($emails[$account]) or isset($emails[$account]->sended) or strpos($emails[$account]->email, '@') == false) continue;
        $ccMail .= $emails[$account]->email . ','; 
        $emails[$account]->sended = true;
    }
    $this->options['cc'] = rtrim($ccMail, ',');
}

private function setSubject($subject)
{
    $this->options['subject'] = stripslashes($subject);
}

private function setBody($body)
{
    $this->options['content_type'] = 'HTML';
    $this->options['content']      = $body;
}
