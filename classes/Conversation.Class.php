<?php
    /**
     * 
     */
    class Conversation 
    {
        private $id;
        private $userA;
        private $userB;
        private $userAclosed;
        private $userBclosed;
        
        function __construct($id, $userA, $userB, $userAclosed = false, $userBclosed = false)
        {
            $this->id = $id;
            $this->userA = $userA;
            $this->userB = $userB;
            $this->userAclosed = (bool) $userAclosed;
            $this->userBclosed = (bool) $userBclosed;
        }

        public static function getAllConversationsByUserID($userID)
        {
            $query = "SELECT conversations.id, conversations.userA, a.username AS usernameA, conversations.userB, b.username AS usernameB, conversations.userAclosed, conversations.userBclosed
                      FROM conversations
                      JOIN users AS A
                      ON userA = a.id
                      JOIN users AS B
                      ON userB = b.id
                      WHERE userA = $userID OR userB = $userID";
            $res = mysql_query($query)or die(Helper::SQLErrorFormat(mysql_error(), $query, __METHOD__, __FILE__, __LINE__));

            $conversations = array();
            $i = 0;

            while($row = mysql_fetch_assoc($res))
            {
                $conversations[$i] = array('id' => $row['id'],
                                           'userA' => array(
                                               'id' => (int) $row['userA'], 
                                               "username" => $row['usernameA']),
                                           'userB' => array(
                                               'id' => (int) $row['userB'], 
                                               "username" => $row['usernameB']),
                                           'userAclosed' => (bool) $row['userAclosed'],
                                           'userBclosed' => (bool) $row['userBclosed'],
                                           'messages' => Message::getAllMessagesByConversationID($row['id'])); 
                $i++;
            }
            
            return $conversations;
        }
    }
    
?>