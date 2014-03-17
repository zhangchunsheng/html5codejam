<?php
class file extends control
{
    public function ajaxUpload()
    {
        $file = $this->file->getUpload('imgFile');
        $file = $file[0];
        if($file)
        {
            $url = $this->app->loadClass('saestorage')->upload($this->config->sae->storage->domain, $file['pathname'], $file['tmpname']);

            $file['addedBy']    = $this->app->user->account;
            $file['addedDate']  = helper::today();
            unset($file['tmpname']);
            $this->dao->insert(TABLE_FILE)->data($file)->exec();

            die(json_encode(array('error' => 0, 'url' => $url)));
        }
    }
}
