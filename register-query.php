<?php    
    require_once("includes/Autoloader.Class.php");
    Autoloader::Init(Dev::DEBUG); 

    if(isset($_POST['username']) && isset($_POST['password1']) && isset($_POST['password2'])) 
    {
        if ($_POST['password1'] == $_POST['password2']) 
        {
            $user = User::getUser(mysql_real_escape_string($_POST['username']));
            
            if($user->getID() == 0)
            {                
                User::createUser(mysql_real_escape_string($_POST['username']), Crypt::hashStringWithSalt($_POST['password1']));
                Helper::redirectTo("index.php?error=User%20successfully%20created%21&color=success");                
            }
            else
            {
                //User existiert bereits
                Helper::redirectTo("register.php?error=User%20already%20exists%21&color=warning");
                var_dump($user);                
            }         
        }
        else
        {
            //Passwörter stimmen nicht überein!
            Helper::redirectTo("register.php?error=Passwords%20are%20not%20correct!%21&color=warning");            
        }

       
    }
?>