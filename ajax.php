<?php        
    require_once("includes/Autoloader.Class.php");
    Autoloader::Init(Dev::DEBUG);    

    if (!isset($_SESSION['user'])) 
    {        
        //User is not LoggedIn
        echo json_encode(array('AJAXCode' => AJAXTypes::FAILED));       
    }

    echo handler();


    function handler()
    {
        $re = "";
        if(isset($_GET['act']))
        {
            $act = $_GET['act'];
        }
        else
        {
            $act = 'default';
        }

        switch ($act) {
            case 'all-conversations':                
                return json_encode(Conversation::getAllConversationsByUserID(unserialize($_SESSION['user'])->getID()));
                break;                    

            case 'get-all-messages-by-conversation':
                return json_encode(Message::getAllMessagesByConversationID($_GET['conversation-id']));
                break;

            case "send-message":
                if(isset($_GET['conversation-id']) && isset($_POST['content']))
                {
                    Message::add($_GET['conversation-id'], mysql_real_escape_string($_POST['content']));
                    
                    return json_encode(array('AJAXCode' => AJAXTypes::OK)); 
                }
                else
                {
                    return json_encode(array('AJAXCode' => AJAXTypes::FAILED)); 
                }
            break;

            case "get-messages-after":
                if(isset($_GET['conversation-id']) && isset($_GET['after']))
                {
                    return json_encode(Message::getAllNewMessagesAfter($_GET['conversation-id'], $_GET['after']));
                }
                else
                {
                    return json_encode(array('AJAXCode' => AJAXTypes::FAILED)); 
                }
            break;

            default:
                return json_encode(array('AJAXCode' => AJAXTypes::FAILED));
                break;
        }

        return $re;
    }



?>