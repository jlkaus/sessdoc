<?php
ob_start();

require 'sess_doc_db_help.php';

$reqd = sdd_GetRequestData();

$sts = 200;
$msg = "OK";

if(isset($reqd['doc']) && isset($reqd['agent']) && isset($reqd['author'])) {
  // Necessary data is all here. Proceed.
  sdd_Lock();

  if(sdd_CheckReservation($reqd['doc'], $reqd['resid'], $reqd['resexp'])) {
    // Reservation verified/acquired/non-existant
    $doc_info = sdd_GetDocumentInfo($reqd['doc'], null);

    if(!isset($doc_info['latest-revision'])) {
      // Document doesn't exist! Great. Create it.
      if(isset($reqd['bdoc'])) {
	// Since there is a branch doc specified, we need to get the branching document info.  If a branching revision is specified, use that, otherwise, use the latest.
	$bdoc_info = sdd_GetDocumentInfo($reqd['bdoc'], $reqd['brev']);

	if(isset($bdoc_info['latest-revision'])) {
	  if(isset($bdoc_info['type']) && isset($bdoc_info['data'])) {
	    if(!isset($reqd['rev']) || ($reqd['rev'] == 0)) {
	      if(!isset($reqd['title'])) {
	        $reqd['title'] = $bdoc_info['title'];
	      }
	      // Got branching doc info, so lets go ahead with the branch.
	      sdd_BranchDocument($reqd['doc'], $reqd['bdoc'], $bdoc_info['revision'], $reqd['date'], $reqd['title'], $reqd['author'], $reqd['source'], $reqd['agent'], $bdoc_info['type'], $bdoc_info['data']);
	      $sts = 201;
	      $msg = "Branch document created";
	    } else {
	      $sts = 409;
	      $msg = "Invalid target revision";
	    }
	  } else {
	    $sts = 400;
	    $msg = "Invalid branch source revision";
	  }
	} else {
	  $sts = 400;
	  $msg = "Invalid branch source document";
	}
      } else if(!isset($reqd['rev']) || ($reqd['rev'] == 0)) {
        if(isset($reqd['title']) && isset($reqd['type'])) {
	  // Correct revision for new document (or no revision specified.  That's fine too) and title specified
	  sdd_NewDocument($reqd['doc'], $reqd['date'], $reqd['title'], $reqd['author'], $reqd['source'], $reqd['agent'], $reqd['type'], $reqd['data']);
	  $sts = 201;
	  $msg = "Document created";
	} else {
	  $sts = 400;
	  $msg = "Bad request";
	}
      } else {
	$sts = 409;
	$msg = "Invalid target revision";
      }
    } else if(!isset($reqd['rev']) || ($reqd['rev'] == ($doc_info['latest-revision']+1))) {
      if(!isset($reqd['bdoc'])) {
        if(!isset($reqd['title'])) {
          $reqd['title'] = $doc_info['title'];
        }
        if(isset($reqd['type'])) {
          // Correct revision for new document (or no revision specified.  That's fine too)
          sdd_NewRevision($reqd['doc'], $doc_info['latest-revision'] + 1, $reqd['date'], $reqd['title'], $reqd['author'], $reqd['source'], $reqd['agent'], $reqd['type'], $reqd['data']);
          $sts = 201;
          $msg = "Revision created";
        } else {
          $sts = 400;
  	  $msg = "Bad request";
        }
      } else {
	$sts = 409;
	$msg = "Invalid target revision";
      }
    } else {
      $sts = 409;
      $msg = "Invalid target revision";
    }
  } else {
    $sts = 409;
    $msg = "Invalid reservation";
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
