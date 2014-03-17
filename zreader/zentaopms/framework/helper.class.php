<?php
/**
 * The helper class file of ZenTaoPHP framework.
 *
 * The author disclaims copyright to this source code.  In place of
 * a legal notice, here is a blessing:
 * 
 *  May you do good and not evil.
 *  May you find forgiveness for yourself and forgive others.
 *  May you share freely, never taking more than you give.
 */

/**
 * The helper class, contains the tool functions.
 *
 * @package framework
 */
class helper
{
    /**
     * Set the member's value of one object.
     * <code>
     * <?php
     * $lang->db->user = 'wwccss';
     * helper::setMember('lang', 'db.user', 'chunsheng.wang');
     * ?>
     * </code>
     * @param string    $objName    the var name of the object.
     * @param string    $key        the key of the member, can be parent.child.
     * @param mixed     $value      the value to be set.
     * @static
     * @access public
     * @return bool
     */
    static public function setMember($objName, $key, $value)
    {
        global $$objName;
        if(!is_object($$objName) or empty($key)) return false;
        $key   = str_replace('.', '->', $key);
        $value = serialize($value);
        $code  = ("\$${objName}->{$key}=unserialize(<<<EOT\n$value\nEOT\n);");
        eval($code);
        return true;
    }

    /**
     * Create a link to a module's method.
     * 
     * This method also mapped in control class to call conveniently.
     * <code>
     * <?php
     * helper::createLink('hello', 'index', 'var1=value1&var2=value2');
     * helper::createLink('hello', 'index', array('var1' => 'value1', 'var2' => 'value2');
     * ?>
     * </code>
     * @param string       $moduleName     module name
     * @param string       $methodName     method name
     * @param string|array $vars           the params passed to the method, can be array('key' => 'value') or key1=value1&key2=value2) or key1=value1&key2=value2
     * @param string       $viewType       the view type
     * @static
     * @access public
     * @return string the link string.
     */
    static public function createLink($moduleName, $methodName = 'index', $vars = '', $viewType = '')
    {
        global $app, $config;
        $link = $config->requestType == 'PATH_INFO' ? $config->webRoot : $_SERVER['PHP_SELF'];

        /* Set the view type and vars. */
        if(empty($viewType)) $viewType = $app->getViewType();
        if(!is_array($vars)) parse_str($vars, $vars);

        /* The PATH_INFO type. */
        if($config->requestType == 'PATH_INFO')
        {
            /* If the method equal the default method defined in the config file and the vars is empty, convert the link. */
            if($methodName == $config->default->method and empty($vars))
            {
                /* If the module also equal the default module, change index-index to index.html. */
                if($moduleName == $config->default->module)
                {
                    $link .= 'index.' . $viewType;
                }
                else
                {
                    $link .= $moduleName . '/';
                }
            }
            else
            {
                $link .= "$moduleName{$config->requestFix}$methodName";
                if($config->pathType == 'full')
                {
                    foreach($vars as $key => $value) $link .= "{$config->requestFix}$key{$config->requestFix}$value";
                }
                else
                {
                    foreach($vars as $value) $link .= "{$config->requestFix}$value";
                }    
                $link .= '.' . $viewType;
            }
        }
        elseif($config->requestType == 'GET')
        {
            $link .= "?{$config->moduleVar}=$moduleName&{$config->methodVar}=$methodName";
            if($viewType != 'html') $link .= "&{$config->viewVar}=" . $viewType;
            foreach($vars as $key => $value) $link .= "&$key=$value";
        }
        return $link;
    }

    /**
     * Import a file instend of include or requie.
     * 
     * @param string    $file   the file to be imported.
     * @static
     * @access public
     * @return bool
     */
    static public function import($file)
    {
        static $includedFiles = array();
        if(!isset($includedFiles[$file]))
        {
            $return = include $file;
            if(!$return) return false;
            $includedFiles[$file] = true;
            return true;
        }
        return true;
    }

    /**
     * Set the model file of one module. If there's an extension file, merge it with the main model file.
     * 
     * @param   string $moduleName the module name
     * @static
     * @access  public
     * @return  string the model file
     */
    static public function setModelFile($moduleName)
    {
        global $app;

        /* Set the main model file and extension path and files. */
        $mainModelFile = $app->getModulePath($moduleName) . 'model.php';
        $modelExtPath  = $app->getModuleExtPath($moduleName, 'model');
        $extFiles      = helper::ls($modelExtPath, '.php');

        /* If no extension file, return the main file directly. */
        if(empty($extFiles)) return $mainModelFile;

        /* Else, judge whether needed update or not .*/
        $mergedModelFile = "saemc://" . $app->getTmpRoot() . 'model' . $app->getPathFix() . $moduleName . '.php';
        $needUpdate      = false;
        $lastTime        = file_exists($mergedModelFile) ? filemtime($mergedModelFile) : 0;
        foreach($extFiles as $extFile)
        {
            if(filemtime($extFile) > $lastTime)
            {
                $needUpdate = true;
                break;
            }
        }
        if(filemtime($mainModelFile) > $lastTime) $needUpdate = true;

        /* If need'nt update, return the cache file. */
        if(!$needUpdate) return $mergedModelFile;

        /* Update the cache file. */
        if($needUpdate)
        {
            $modelClass    = $moduleName . 'Model';
            $extModelClass = 'ext' . $modelClass;
            $modelLines    = trim(file_get_contents($mainModelFile));
            $modelLines    = rtrim($modelLines, '?>');     // To make sure the last end tag is removed.
            $modelLines   .= "class $extModelClass extends $modelClass {\n";

            /* Cycle all the extension files. */
            foreach($extFiles as $extFile)
            {
                $extLines = trim(file_get_contents($extFile));
                if(strpos($extLines, '<?php') !== false) $extLines = ltrim($extLines, '<?php');
                if(strpos($extLines, '?>')    !== false) $extLines = rtrim($extLines, '?>');
                $modelLines .= $extLines . "\n";
            }

            /* Create the merged model file. */
            $modelLines .= "}";
            file_put_contents($mergedModelFile, $modelLines);

            return $mergedModelFile;
        }
    }

    /**
     * Create the in('a', 'b') string.
     * 
     * @param   string|array $ids   the id lists, can be a array or a string with ids joined with comma.
     * @static
     * @access  public
     * @return  string  the string like IN('a', 'b').
     */
    static public function dbIN($ids)
    {
        if(is_array($ids)) return "IN ('" . join("','", $ids) . "')";
        return "IN ('" . str_replace(',', "','", str_replace(' ', '',$ids)) . "')";
    }

    /**
     * Create safe base64 encoded string for the framework.
     * 
     * @param   string  $string   the string to encode.
     * @static
     * @access  public
     * @return  string  encoded string.
     */
    static public function safe64Encode($string)
    {
        return strtr(base64_encode($string), '/', '.');
    }

    /**
     * Decode the string encoded by safe64Encode.
     * 
     * @param   string  $string   the string to decode
     * @static
     * @access  public
     * @return  string  decoded string.
     */
    static public function safe64Decode($string)
    {
        return base64_decode(strtr($string, '.', '/'));
    }

    /**
     * Judge a string is utf-8 or not.
     * 
     * @param  string    $string 
     * @author hmdker@gmail.com
     * @see    http://php.net/manual/en/function.mb-detect-encoding.php
     * @static
     * @access public
     * @return bool
     */
    static public function isUTF8($string)
    {
        $c    = 0; 
        $b    = 0;
        $bits = 0;
        $len  = strlen($string);
        for($i=0; $i<$len; $i++)
        {
            $c = ord($str[$i]);
            if($c > 128)
            {
                if(($c >= 254)) return false;
                elseif($c >= 252) $bits=6;
                elseif($c >= 248) $bits=5;
                elseif($c >= 240) $bits=4;
                elseif($c >= 224) $bits=3;
                elseif($c >= 192) $bits=2;
                else return false;
                if(($i+$bits) > $len) return false;
                while($bits > 1)
                {
                    $i++;
                    $b=ord($str[$i]);
                    if($b < 128 || $b > 191) return false;
                    $bits--;
                }
            }
        }
        return true;
    }

    /**
     *  Compute the diff days of two date.
     * 
     * @param   date  $date1   the first date.
     * @param   date  $date2   the sencode date.
     * @access  public
     * @return  int  the diff of the two days.
     */
    static public function diffDate($date1, $date2)
    {
        return round((strtotime($date1) - strtotime($date2)) / 86400, 0);
    }

    /**
     *  Get now time use the DT_DATETIME1 constant defined in the lang file.
     * 
     * @access  public
     * @return  datetime  now
     */
    static public function now()
    {
        return date(DT_DATETIME1);
    }

    /**
     *  Get today according to the  DT_DATE1 constant defined in the lang file.
     * 
     * @access  public
     * @return  date  today
     */
    static public function today()
    {
        return date(DT_DATE1);
    }

    /**
     *  Judge a date is zero or not.
     * 
     * @access  public
     * @return  bool
     */
    static public function isZeroDate($date)
    {
        return substr($date, 0, 4) == '0000';
    }

    /**
     *  Get files match the pattern under one directory.
     * 
     * @access  public
     * @return  array   the files match the pattern
     */
    static public function ls($dir, $pattern = '')
    {
        $files = array();
        $dir = realpath($dir);
        if(is_dir($dir))
        {
            if($dh = opendir($dir))
            {
                while(($file = readdir($dh)) !== false) 
                {
                    if(strpos($file, $pattern) !== false) $files[] = $dir . DIRECTORY_SEPARATOR . $file;
                }
                closedir($dh);
            }
        }
        return $files;
    }

    /**
     * Change directory.
     * 
     * @param  string $path 
     * @static
     * @access public
     * @return void
     */
    static function cd($path = '')
    {
        static $cwd = '';
        if($path)
        {
            $cwd = getcwd();
            chdir($path);
        }
        else
        {
            chdir($cwd);
        }
    }
}

/**
 *  The short alias of helper::createLink() method. 
 *
 * @param  string        $methodName  the method name
 * @param  string|array  $vars        the params passed to the method, can be array('key' => 'value') or key1=value1&key2=value2)
 * @param  string        $viewType    
 * @return string the link string.
 */
function inLink($methodName = 'index', $vars = '', $viewType = '')
{
    global $app;
    return helper::createLink($app->getModuleName(), $methodName, $vars, $viewType);
}

/**
 *  Static cycle a array 
 *
 * @param array  $items     the array to be cycled.
 * @return mixed
 */
function cycle($items)
{
    static $i = 0;
    if(!is_array($items)) $items = explode(',', $items);
    if(!isset($items[$i])) $i = 0;
    return $items[$i++];
}

/**
 * Get current microtime.
 * 
 * @access protected
 * @return float current time.
 */
function getTime()
{
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}

/**
 * Save the sql.
 * 
 * @access protected
 * @return void
 */
function saveSQL()
{
    if(!class_exists('dao')) return;
    global $app;
    $sqlLog = $app->getLogRoot() . 'sql.' . date('Ymd') . '.log';
    $fh = @fopen($sqlLog, 'a');
    if(!$fh) return false;
    fwrite($fh, date('Ymd H:i:s') . ": " . $app->getURI() . "\n");
    foreach(dao::$querys as $query) fwrite($fh, "  $query\n");
    fwrite($fh, "\n");
    fclose($fh);
}

/**
 * dump a var.
 * 
 * @param mixed $var 
 * @access public
 * @return void
 */
function a($var)
{
    echo "<xmp class='a-left'>";
    print_r($var);
    echo "</xmp>";
}
function saveSQL4SAE()
{
    if(!class_exists('dao')) return;
    global $app;
    $log = date('Ymd H:i:s') . ": " . $app->getURI() . "; ";
    foreach(dao::$querys as $query) $log .= $query . "; ";
    sae_debug($log);
}
