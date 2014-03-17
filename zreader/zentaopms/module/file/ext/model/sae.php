<?php
public function getById($fileID)
{
    $file = $this->dao->findById($fileID)->from(TABLE_FILE)->fetch();
    $file->realPath = 'saestor://' . $this->config->sae->storage->domain . '/' . $file->pathname;
    $file->webPath  = $this->app->loadClass('saestorage')->getURL($this->config->sae->storage->domain, $file->pathname);
    return $file;
}

public function saveUpload($objectType = '', $objectID = '', $extra = '')
{
    $fileTitles = array();
    $now        = helper::today();
    $files      = $this->getUpload();

    $this->storage = $this->app->loadClass('saestorage');
    foreach($files as $id => $file)
    {
        $this->storage->upload($this->config->sae->storage->domain, $file['pathname'], $file['tmpname']);
        $file['objectType'] = $objectType;
        $file['objectID']   = $objectID;
        $file['addedBy']    = $this->app->user->account;
        $file['addedDate']  = $now;
        $file['extra']      = $extra;
        unset($file['tmpname']);
        $this->dao->insert(TABLE_FILE)->data($file)->exec();
        $fileTitles[$this->dao->lastInsertId()] = $file['title'];
    }
    return $fileTitles;
}
