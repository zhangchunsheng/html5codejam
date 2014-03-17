<?php
class project extends control
{
    public function computeBurn($admin = '', $reload = 'no')
    {
        $isDeny = false;
        if($admin == 'admin')
            $isDeny = true;
        else if(isset($this->app->user))
        {
            if(!common::hasPriv('project', 'computeburn'))
            {
                $this->loadModel('common')->deny('project', 'computeburn');
                exit;
            }
            $isDeny = true;  
        }

        if($isDeny)
        {
            $this->view->burns = $this->project->computeBurn();
            if($reload == 'yes') die(js::reload('parent'));
            die($this->display());
        }
        else
        {
            if(isset($this->app->user))
            {
                if(!common::hasPriv($module, $method)) $this->loadModel(common)->deny($module, $method);
            }
            else
            {
                $referer  = helper::safe64Encode($this->app->getURI(true));
                $this->locate($this->createLink('user', 'login', "referer=$referer"));
            }
        }
    }
}
