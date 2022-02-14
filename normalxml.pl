#!/usr/bin/perl -w

use strict;

my $input = "";
my $location = 0;
my $inputlen = 0;
my $workspace = "";
my $indent = 0;
my $bkt = 0;
my $mode = 0;
my $quoteon = 0; # 1 for single, 2 for double
my $debug = shift || 0;

sub indentify {
	my $tind = $indent;
	while($tind--) {
		print " ";
	}
}

# preappend, newvalue, newmode
sub display {
	my $preappend = shift || "";
	my $newvalue = shift || "";
	my $newmode = shift || 0;
	$workspace.=$preappend;
	if($debug || (length($workspace) > 0)) {
		if($debug) {
			print "{".$mode.$quoteon.$bkt.$indent."} ";
		}
		indentify();
		print $workspace;
		print "\n";
	}
	$workspace = $newvalue;
	$mode = $newmode;
}


# modes
# 0 = normal content (default)
# 1 = cdata content (<![CDATA[    ]]>)
# 2 = comment content (<!--  -->)
# 3 = other meta content (<!   >)
# 4 = special content  (<?    ?>)
# 5 = open tag  (<  >) or (<   />)
# 6 = close tag  (</    >)

while(<>) {
	chomp;
	$input .= $_;
}

$inputlen = length($input);

while($location < $inputlen) {
	my $sym = substr($input, $location, 1);
	if(($mode == 0) && $sym eq "<") {
		my $sym2 = substr($input,$location+1, 1);
		if($sym2 eq "?") {
			display("",$sym.$sym2,4);
			$location++;
		} elsif($sym2 eq "/") {
			display("",$sym.$sym2,6);
			$indent-=2;
			$location++;
		} elsif($sym2 eq "!") {
			if(substr($input, $location+2,2) eq "--") {
				display("",$sym.$sym2.substr($input,$location+2,2),2);
				$location+=2;
			} elsif(substr($input, $location+2, 7) eq "[CDATA[") {
				display("",$sym.$sym2.substr($input,$location+2,7),1);
				$location+=7;
			} else {
				display("",$sym.$sym2,3);
			}
			$location++;
		} else {
			display("",$sym,5);
		}
	} elsif(($mode > 0) && ($quoteon == 0) && $sym eq ">") {
		if((substr($input, $location-2,2) eq "--") && $mode == 2) {
			display($sym);
		} elsif((substr($input, $location-2,2) eq "]]") && $mode == 1) {
			display($sym);
		} elsif((substr($input, $location-1,1) eq "?") && $mode == 4) {
			display($sym);
		} elsif((substr($input, $location-1,1) eq "/") && $mode == 5) {
			display($sym);
		} elsif(($bkt == 0) && $mode == 3) {
			display($sym);
		} elsif($mode == 5) {
			display($sym);
			$indent+=2;
		} elsif($mode == 6) {
			display($sym);
		} else {
			$workspace .= $sym;
		}
	} elsif(($mode == 3) && ($quoteon == 0) && $sym eq "[") {
		$bkt++;
		$workspace .= $sym;
	} elsif(($mode == 3) && ($quoteon == 0) && $sym eq "]") {
		$bkt--;
		$workspace .= $sym;
	} elsif(($mode > 2) && ($quoteon != 2) && $sym eq "'") {
		if($quoteon == 1) {
			$quoteon = 0;
		} else {
			$quoteon = 1;
		}
		$workspace .= $sym;
	} elsif(($mode > 2) && ($quoteon != 1) && $sym eq '"') {
		if($quoteon == 2) {
			$quoteon = 0;
		} else {
			$quoteon = 2;
		}
		$workspace .= $sym;
	} else {
		$workspace .= $sym;
	}
	$location++;
}


