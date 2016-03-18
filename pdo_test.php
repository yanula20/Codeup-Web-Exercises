<?PHP
define('PASSWORD','vagrant');
define('DB_USER','vagrant');
define('DB_NAME','employees');
define('DB_HOST','127.0.0.1');
require_once 'db_connect.php';
echo $dbc->getAttribute(PDO::ATTR_CONNECTION_STATUS) . "\n";