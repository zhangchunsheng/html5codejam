<?php
/**
 * The upgrade router file of ZenTaoPMS.
 *
 * @copyright   Copyright 2009-2012 QingDao Nature Easy Soft Network Technology Co,LTD (www.cnezsoft.com)
 * @license     LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     ZenTaoPMS
 * @version     $Id: upgrade.php 2605 2012-02-21 07:22:58Z wwccss $
 * @link        http://www.zentao.net
 */
error_reporting(0);

/* Load the framework. */
include 'framework/router.class.php';
include 'framework/control.class.php';
include 'framework/model.class.php';
include 'framework/helper.class.php';

/* Instance the app. */
$app = router::createApp('pms', dirname(__FILE__));
$common = $app->loadCommon();

/* Reset the config params to make sure the install program will be lauched. */
$config->set('requestType', 'GET');
$config->set('debug', true);
$config->set('default.module', 'upgrade');
$app->setDebug();

/* Check the installed version is the latest or not. */
$config->installedVersion = $common->loadModel('setting')->getVersion();
if(version_compare($config->version, $config->installedVersion) <= 0) die(header('location: index.php'));

/* Run it. */
$app->parseRequest();
$app->loadModule();
