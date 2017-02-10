<?php     
    require_once("includes/Autoloader.Class.php");
    Autoloader::Init(Dev::DEBUG);    

    if (!isset($_SESSION['user'])) 
    {        
        //User is not LoggedIn
        Helper::redirectTo("index.php");
        exit;         
    }
?>

<!DOCTYPE html>
<html>
<head>
    <title><?php echo APPNAME; ?></title>

    <meta charset="ISO-8859-1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1"> 

    <!-- Bootstrap -->
    <link href="https://bootswatch.com/cyborg/bootstrap.min.css" rel="stylesheet">

    <!-- Unterstützung für Media Queries und HTML5-Elemente in IE8 über HTML5 shim und Respond.js -->
    <!-- ACHTUNG: Respond.js funktioniert nicht, wenn du die Seite über file:// aufrufst -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <link href="styles/style.css" type="text/css" rel="stylesheet" />
    <link href="favicon.ico" type="image/x-icon" rel="shortcut icon" />  
    <link rel="stylesheet" href="css/font-awesome.min.css">    
</head>
<body>        
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <!-- Titel und Schalter werden fuer eine bessere mobile Ansicht zusammengefasst -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span class="sr-only">Navigation ein-/ausblenden</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"><?php echo APPNAME; ?> <span class='glyphicon glyphicon-envelope'></span></a>
            </div>

            <!-- Alle Navigationslinks, Formulare und anderer Inhalt werden hier zusammengefasst und koennen dann ein- und ausgeblendet werden -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">                
                <ul class="nav navbar-nav navbar-right">                                
                    <!--<form class="navbar-form navbar-left" role="search">
                        <div class="form-group">
                            <input class="form-control" placeholder="Search" type="text">
                        </div>
                        <button type="submit" class="btn btn-default"><span class="glyphicon glyphicon-search"></span></button>
                    </form> -->
                    <p class="navbar-text logged_in_as" style="padding-left: 10px;">Logged in as <a class='user-data' data-id="<?php echo unserialize($_SESSION['user'])->getID() ?>" href="account-panel.php"><?php echo unserialize($_SESSION['user'])->getUsername() ?></a></p>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Menu <span class="caret"></span></a>
                        <ul class="dropdown-menu">                                                                                                                     
                            <li><a href="logout.php"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
    </nav>

    <div class='container main-frame'>
        <ul class="nav nav-tabs col-sm-10">
            
        </ul>
        <div class="tab-content">
            <center><i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i>
                <span class="sr-only">Loading...</span></center>
        </div>        
    </div>

    <!-- jQuery (wird für Bootstrap JavaScript-Plugins benötigt) -->
    <script src="js/jquery.min.js"></script>
    <!-- Binde alle kompilierten Plugins zusammen ein (wie hier unten) oder such dir einzelne Dateien nach Bedarf aus -->
    <script src="js/bootstrap.min.js"></script>

    <script src='js/message-system.js'></script>
  </body>
</html>