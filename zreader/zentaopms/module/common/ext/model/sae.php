<?php
public function isOpenMethod($module, $method)
{
    if($module == 'project' && $method == 'computeburn') return true;
    return parent::isOpenMethod($module, $method);
}
