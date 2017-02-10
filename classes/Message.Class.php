<?php
    /**
     * 
     */
    class Message
    {
        private
            $id,
            $message,
            $user,
            $createTime;

        function __construct($id, $message, $user, $createTime)
        {
            $this->id = $id;
            $this->message = $message;
            $user->user = $user;
            $this->createTime = $dateTime;
        }

        public static function getAllMessagesByConversationID($conversationID)
        {
            $query = "SELECT messages.id, conversationID, content, userID, users.username, createTime
                      FROM messages
                      JOIN users
                      ON userID = users.id
                      WHERE conversationID = $conversationID
                      ORDER BY messages.id";
            $res = mysql_query($query)or die(Helper::SQLErrorFormat(mysql_error(), $query, __METHOD__, __FILE__, __LINE__));

            $messages = array();
            $i = 0;

            while($row = mysql_fetch_assoc($res))
            {
                $messages[$i] = array('id' => $row['id'],
                                      'content' => $row['content'],
                                      'user' => array(
                                          'id' => (int) $row['userID'],
                                          'username' => $row['username']),
                                      'createTime' => $row['createTime']);
                $i++;
            }

            return $messages;
        }

        public static function getAllNewMessagesAfter($conversationID, $after)
        {
            $query = "SELECT messages.id, conversationID, content, userID, users.username, createTime
                      FROM messages
                      JOIN users
                      ON userID = users.id
                      WHERE conversationID = $conversationID AND createTime > '$after' AND userID != " . unserialize($_SESSION['user'])->getID();
            $res = mysql_query($query)or die(Helper::SQLErrorFormat(mysql_error(), $query, __METHOD__, __FILE__, __LINE__));

            $messages = array();
            $i = 0;

            while($row = mysql_fetch_assoc($res))
            {
                $messages[$i] = array('id' => $row['id'],
                                      'content' => $row['content'],
                                      'user' => array(
                                          'id' => (int) $row['userID'],
                                          'username' => $row['username']),
                                      'createTime' => $row['createTime']);
                $i++;
            }

            return $messages;
        }

        public static function add($conversationID, $content)
        {
            $query = "INSERT INTO messages (conversationID, content, userID) VALUES ($conversationID, \"" . $content . "\", " . unserialize($_SESSION['user'])->getID() . ")";
            $res = mysql_query($query)or die(Helper::SQLErrorFormat(mysql_error(), $query, __METHOD__, __FILE__, __LINE__));
        }

    }
    
?>