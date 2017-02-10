<?php
    class User 
    {
        const NOBODY = 0;

        private $id;
        private $username;
        private $password;
        

        function __construct($id, $username, $password)
        {
            $this->id = (int) $id;
            $this->username = $username;
            $this->password = $password;           
        }

		public function setId($id)
		{
			$this->id = $id;
		}

        /**
         * Get the UserID
         *
         * Gets the unique ID of the User
         **/
        public function getID()
        {
            return $this->id;
        }

		public function setUsername($username)
		{
			$this->username = $username;
		}

        /**
         * Gets the Username of this User        
         **/
        public function getUsername()
        {
            return $this->username;
        }

         /**
         * Gets the Hashed Password of this User
         *
         * Get the Hashed Password of this User-Object
         * The Password is hashed with SHA sha256 and the SALT of the Crypt-Enum
         **/
        public function getPassword()
        {
            $query = "SELECT password FROM users WHERE id = {$this->id}";
            $res = mysql_query($query)or die(Helper::SQLErrorFormat(mysql_error(), $query, __METHOD__, __FILE__, __LINE__));
            $row = mysql_fetch_assoc($res); 

            return $row['password'];
        }           

        /**
         * Login the user with this username and password. 
         * If password is correct update LastLogin, LastIP and onlineState.     
         *
         * @param string username Username of the User
         * @param string password Password of the User
         *
         * @return User if login was succsessful else return null
         **/
        public static function Login($username, $password)
        {
            $user = User::getUser(strtolower($username));

            if($user == null) 
            {
                return null;
            }

            if (Crypt::hashStringWithSalt($password) == $user->getPassword()) 
            {                
                // $query = "UPDATE users SET lastLogin = NOW(), LastIP = '" . User::getIP() . "' WHERE id = '" . $user->getID() . "'";
                // $res = mysql_query($query)or die(Helper::SQLErrorFormat(mysql_error(), $query, __METHOD__, __FILE__, __LINE__));

                return User::getUser(strtolower($username));
            }
        }

        public static function Logout($userSession)
        {
            $user = $userSession;

            //$query = "UPDATE users SET online = '0' WHERE id = '" . $user->getID() . "'";
            //$res = mysql_query($query)or die(Helper::SQLErrorFormat(mysql_error(), $query, __METHOD__, __FILE__, __LINE__));
        }

        /**
         * Find the user with the given Username or UserID in the Database
         *
         * @param string/int $IDorUsername Username or userID         
         *
         * @return User returns a User if it exitsts else return null
         **/
        public static function getUser($ID_Username)
        {

            if (is_int($ID_Username)) 
            {
                 $query = "SELECT * FROM users WHERE id = '$ID_Username'";
            } 
            else 
            {
                $query = "SELECT * FROM users WHERE username = '$ID_Username'";
            }            
              
            $res = mysql_query($query)or die(Helper::SQLErrorFormat(mysql_error(), $query, __METHOD__, __FILE__, __LINE__));

            if (!$res) 
            {
                return null;
            }

            $row = mysql_fetch_assoc($res);

            $id = $row['id'];
            $username = $row['username'];
            $password = $row['password'];            

            return new User($id, $username, $password);
        }

        public static function getMemberCount()
        {
            $query = "SELECT count(*) AS memberCount FROM users";
            $res = mysql_query($query)or die(Helper::SQLErrorFormat(mysql_error(), $query, __METHOD__, __FILE__, __LINE__));
            $row = mysql_fetch_assoc($res);
            
            return $row['memberCount'];
        }

        public static function createUser($username, $password) 
        {
            $query = "INSERT INTO users (username, password) VALUES 
            ('" . strtolower($username) . "',
             '$password')";
            $res = mysql_query($query)or die(Helper::SQLErrorFormat(mysql_error(), $query, __METHOD__, __FILE__, __LINE__));
        }

        public static function getAllUsers()
        {
            $query = "SELECT * FROM users";
            $res = mysql_query($query)or die(Helper::SQLErrorFormat(mysql_error(), $query, __METHOD__, __FILE__, __LINE__));

            $users = new SplDoublyLinkedList();

            while($row = mysql_fetch_assoc($res))
            {
                $id = $row['id'];
                $username = $row['username'];
                $password = $row['password'];

                $users->push(new User($id, $username, $password));        
            }

            return $users;
        }

        /**
         * Gets the IP of the current User who visit the Site
         *
         * @return string IP-Adress of current Client
         **/
        public static function getIP()
        {            
            if (! isset($_SERVER['HTTP_X_FORWARDED_FOR'])) 
            {
                return $_SERVER['REMOTE_ADDR'];
            }
            else
            {
                return $_SERVER['HTTP_X_FORWARDED_FOR'];
            }
        }      
    }   
?>