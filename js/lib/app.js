/*
 * @owner yianni.ververis@qlik.com
 *
 */
var me = {
		obj: {
			qlik: null,
			app: null,
			angularApp: null,
			model: [],
		}
	};

me.init = function () {
	me.config = {
		host: null,
		prefix: "/",
		port: 4848,
		isSecure: false
	};
	me.vars = {
		server: {
			local: window.location.hostname
		},
		id: 'Helpdesk Management.qvf',
		
	};
	//me.title = 'Helpdesk Management';
	me.config.host = me.vars.server.local;
}

me.getApp = function (appID) {
		console.log("app", me);
		me.obj.app = me.obj.qlik.openApp(appID, me.config);
		console.log("app After",me);
	}
	

me.boot = function () {
	me.init();

	//me.obj.app = me.obj.qlik.openApp(me.vars.id, me.config);



	me.events();
};

me.events = function () {
	$( document ).ready(function() {
		$(".container").height($("body").height() - 50);
	});

	$(window).resize(function() {
	    $(".container").height($("body").height());
	});

};

app = me;
