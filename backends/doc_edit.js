/* Javascript for Document Editor */
/* Intended to be run with dojo already loaded */
/* Also should have loaded doc_edit_lib.js */

console.log("initial");

dojo.require('dijit.layout.ContentPane');
dojo.require('dijit.layout.TabContainer');
dojo.require('dijit.form.Button');
dojo.require('dijit.InlineEditBox');
dojo.require('dijit.form.TextBox');
dojo.require('dijit.Menu');


dojo.addOnLoad(function() {
	var gAuth = new dijit.InlineEditBox({editor: "dijit.form.TextBox"},"globalAuthor");
	var gRoot = new dijit.InlineEditBox({editor: "dijit.form.TextBox"},"globalRoot");

	console.log("Should have the inline edit boxes created now...");


    });



