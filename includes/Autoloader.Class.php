<?php
    require_once("includes/init.php");

    class Dev
    {
        const RELEASE = 0x0000;
        const SIMPLE  = 0x1000;
        const DEBUG   = 0x2000;
    }

    class AJAXTypes
    {
        const OK = 0;
        const FAILED = 1;        
    }

    class AutoLoader
    {            
        public static function Init($status)
        {
            switch ($status) 
            {
                case Dev::RELEASE:
                    error_reporting(E_NONE); 
                break;

                case Dev::DEBUG:                                        
                    //error_reporting(E_ALL);

                    ini_set('xdebug.var_display_max_depth', 1023);
                    ini_set('xdebug.var_display_max_children', 256);
                    ini_set('xdebug.var_display_max_data', 1024); 
                break;

                case Dev::SIMPLE:
                    error_reporting(E_ERROR | E_WARNING | E_PARSE);
                break;                
            }

            AutoLoader::Load();           
        }


       private static function Load()
       {        
         ### Helper Classes
            require_once("classes/Helper.Class.php");
            require_once("classes/Crypt.Class.php");
            require_once("classes/BasicEnum.Class.php");

        ### User/Permission Classes
            require_once("classes/User.Class.php");
            require_once("classes/Conversation.Class.php");
            require_once("classes/Message.Class.php");
       }
    }    
?>