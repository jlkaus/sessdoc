<?php
ob_start();

require 'sess_doc_db_help.php';

$reqd = sdd_GetRequestData();

$sts = 200;
$msg = "OK";

if(isset($reqd['doc'])) {
  // Necessary data is all here. Proceed.
  sdd_Lock();

  sdd_CheckReservation($reqd['doc'], $reqd['resid'], $reqd['resexp']);

  // Reservation verified/acquired/non-existant
  $doc_info = sdd_GetDocumentInfo($reqd['doc'], $reqd['rev']);

  if(isset($doc_info['latest-revision'])) {
    if(isset($doc_info['revision'])) {
      $sts = 200;
      $msg = "OK";
    } else {
      $sts = 404;
      $msg = "No such revision";
    }
  } else {
    $sts = 404;
    $msg = "No such document";
  }

  if($sts < 300) {
    ob_clean();
    sdd_GoodOut($reqd['doc'], $reqd['rev']);
  }
  
  sdd_Unlock();
} else {
  $sts = 400;
  $msg = "Bad request";
}

if($sts > 299) {
  ob_clean();
}

sdd_SetStatus($sts, $msg);

ob_end_flush();
?>
