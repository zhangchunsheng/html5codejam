<?php
/**
 * The html template file of step3 method of install module of ZenTaoPMS.
 *
 * @copyright   Copyright 2009-2010 QingDao Nature Easy Soft Network Technology Co,LTD (www.cnezsoft.com)
 * @license     LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @author	  Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package	 ZenTaoPMS
 * @version	 $Id: step3.html.php 1526 2011-03-08 10:24:27Z wwccss $
 */
?>
<?php include '../../../common/view/header.lite.html.php';?>
<?php
if(!isset($error))
{
    $configContent = <<<EOT
<?php
\$config->installed       = true;
\$config->debug           = false;
\$config->requestType     = '$requestType';

\$config->db->host        = SAE_MYSQL_HOST_M;
\$config->db->slaveHost   = SAE_MYSQL_HOST_S;
\$config->db->port        = SAE_MYSQL_PORT;
\$config->db->name        = SAE_MYSQL_DB;
\$config->db->user        = SAE_MYSQL_USER;
\$config->db->password    = SAE_MYSQL_PASS;
\$config->db->prefix      = '$dbPrefix';
\$config->db->checkCentOS = false;

\$config->slaveDB->host        = SAE_MYSQL_HOST_S;
\$config->slaveDB->port        = SAE_MYSQL_PORT;
\$config->slaveDB->name        = SAE_MYSQL_DB;
\$config->slaveDB->user        = SAE_MYSQL_USER;
\$config->slaveDB->password    = SAE_MYSQL_PASS;
\$config->slaveDB->checkCentOS = false;

\$config->webRoot         = '$webRoot';
\$config->default->domain = '$domain';
\$config->default->lang   = '$defaultLang';

\$config->sae->storage->domain = '{$this->post->storageDomain}';
EOT;
}
?>
<?php if(isset($error)):?>
<table class='table-6' align='center'>
<caption><?php echo $lang->install->error;?></caption>
  <tr><td><?php echo $error;?></td></tr>
  <tr><td><?php echo html::commonButton($lang->install->pre, "onclick='javascript:history.back(-1)'");?></td></tr>
</table>
<?php else:?>
<table class='table-6' align='center'>
  <caption><?php echo $lang->install->saveConfig;?></caption>
  <tr>
    <td class='a-center'><?php echo html::textArea('config', $configContent, "rows='15' class='area-1 f-12px'");?></td>
  </tr>
  <tr>
    <td>
    <?php
    $configRoot   = $this->app->getConfigRoot();
    $myConfigFile = $configRoot . 'my.php';
    if(is_writable($configRoot))
    {
        if(@file_put_contents($myConfigFile, $configContent))
        {
            printf($lang->install->saved2File, $myConfigFile);
        }
        else
        {
            printf($lang->install->save2File, $this->app->getConfigRoot() . 'my.php');
        }
    }
    else
    {
        printf($lang->install->save2File.'<br>'.$lang->install->savePrompt, $this->app->getConfigRoot() . 'my.php');
    }
    echo "<br />";
    echo "<div class='a-center'>" . html::a($this->createLink('install', 'step4'), $lang->install->next) . '</div>';
    ?>
    </td>
  </tr>
</table>
<?php endif;?>
<?php include '../../../common/view/footer.lite.html.php';?>
