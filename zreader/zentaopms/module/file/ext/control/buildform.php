<?php
class file extends control
{
    /**
     * Build the upload form.
     * 
     * @param  int    $fileCount 
     * @param  float  $percent 
     * @access public
     * @return void
     */
    public function buildForm($fileCount = 2, $percent = 0.9)
    { 
        $this->view->fileCount = $fileCount;
        $this->view->percent   = $percent;
        $this->display();
    }
}
