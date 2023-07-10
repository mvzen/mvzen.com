<?php

$hashes = "";

// Create the Arrays for each category
$network = array("\n\nNETWORK:");
$cache = array("\n\nCACHE:");
$ignore = array("error_log", ".hg");

$dir = new RecursiveDirectoryIterator(".");

foreach (new RecursiveIteratorIterator($dir) as $file) {

    if (!$file->isFile()) {
        continue;
    }

    $filename = $file->getFilename();

    $file = str_replace('\\', '/', $file);

    if ($file != "./manifest.php" && $file != "./offline.appcache" && substr($filename, 0, 1) != ".") {
        $hash = md5_file($file);
        if (preg_match('/.php$/', $file)) {
            foreach ($ignore as $item):
                if (strpos($file, $item)): $allow = FALSE;
                    break;
                else: $allow = TRUE;
                endif;
            endforeach;
            if ($allow) {
                array_push($network, "\n" . $file);
                $hashes .= $hash;
            }
        } else {
            foreach ($ignore as $item):
                if (strpos($file, $item)): $allow = FALSE;
                    break;
                else: $allow = TRUE;
                endif;
            endforeach;
           if ($allow) {
               array_push($cache, "\n" . $file);
               $hashes .= $hash;
           }
        }
    }
}

$fh = fopen('offline.appcache', 'w');
fwrite($fh, 'CACHE MANIFEST');

foreach ($cache as $file): fwrite($fh, $file);
endforeach;

fwrite($fh, "\n\nSETTINGS:");
fwrite($fh, "\nprefer-online");

fwrite($fh, "\n\nNETWORK:");
fwrite($fh, "\n*");

fwrite($fh, "\n\n# Hash:" . md5($hashes) . "\n");
fclose($fh);

header('Content-Type: text/cache-manifest');
readfile('offline.appcache');
