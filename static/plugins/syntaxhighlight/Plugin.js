var EtherSyntax = {
	defaults : {
		'syntax': 'undefined'
	},
	
	selectLanguage : function(lang)
	{
		padcookie.setPref("SH_BRUSH", lang);
		window.location.reload();
	},

	init : function()
	{
		//Load the SyntaxHighlighter Core
		$(document).ready(EtherSyntax.loadCore);
	},
	
	loadCore : function()
	{
		$.getScript("../static/plugins/syntaxhighlight/XRegExp.js", function(){
			$.getScript("../static/plugins/syntaxhighlight/shCore.js", EtherSyntax.loadSyntaxes);
		});
		
		plugins.addClientHook("aceInitInnerdocbodyHead", { "aceInitInnerdocbodyHead": EtherSyntax.onPadLoaded } );
	},
	
	addSyntaxOption : function(syntax, shalias, url, syntaxroot)
	{
		$.getScript(url,
			function()
			{
				syntaxroot.append("<option value='" + shalias + "'>" + syntax + "</option>");
				//alert(padcookie.getPref("SH_BRUSH"));
				
				//alert(padcookie.getPref("SH_BRUSH") === shalias);
				if( padcookie.getPref("SH_BRUSH") === shalias )
				{
					$('#syntaxes').val(shalias);
				}
			});
	},
	
	loadSyntaxes : function()
	{
		var menu = $("#editbar #menu_right");
		menu.prepend("<li class='separator'></li>");
		menu.prepend("<li style='width: 10em;'><select id='syntaxes' style='width: 100%' onchange='EtherSyntax.selectLanguage(this.options[this.selectedIndex].value);'></select></li>");
		
		var syntaxroot = $("#editbar #menu_right #syntaxes");
		
		syntaxroot.append("<option value='undefined'>None</option>");
		
		// Load the brushes we want to use
		EtherSyntax.addSyntaxOption('Ruby', 'ruby', "../static/plugins/syntaxhighlight/shBrushRuby.js", syntaxroot);
		EtherSyntax.addSyntaxOption('Php', 'php', "../static/plugins/syntaxhighlight/shBrushPhp.js", syntaxroot);
		EtherSyntax.addSyntaxOption('Python', 'python', "../static/plugins/syntaxhighlight/shBrushPython.js", syntaxroot);
		EtherSyntax.addSyntaxOption('Java', 'java', "../static/plugins/syntaxhighlight/shBrushJava.js", syntaxroot);
		EtherSyntax.addSyntaxOption('Javascript', 'js', "../static/plugins/syntaxhighlight/shBrushJscript.js", syntaxroot);

		//plugins.addClientHook("acePostWriteDomLineHTML", { "acePostWriteDomLineHTML": EtherSyntax.highlightLine } );
	},
	
	onPadLoaded : function(args)
	{
		var iframeHTML = args.iframeHTML;
		iframeHTML.push('\'<link rel="stylesheet" type="text/css" href="../static/plugins/syntaxhighlight/shThemeDefault.css"/>\'');
		
		$(document).ready( function() { plugins.addClientHook("acePostWriteDomLineHTML", { "acePostWriteDomLineHTML": EtherSyntax.highlightLine } ); } );
	},
	
	highlightLine : function(args)
	{
		// Iterate through the child nodes (spans) and point SyntaxHighlighter at them
		var children = args.node.children;
		for(var i = 0; i < children.length; i++)
		{
			if(args.node.children[i].className.indexOf("list") != -1 || args.node.children[i].className.indexOf("tag") != -1 || args.node.children[i].className.indexOf("url") != -1) continue;
			if( padcookie.getPref("SH_BRUSH") != undefined )
				SyntaxHighlighter.highlight( {"brush": padcookie.getPref("SH_BRUSH")} , args.node.children[i] );
		}
	}
}