'use strict';

/**
 * @ngdoc function
 * @name friluftsframjandetApp.controller:controller.dynamic
 * @author yianni.ververis@qlik.com
 * @description
 * # controller.dynamic
 * Controller of the myApp
 */
app.obj.angularApp
	.controller('controller.dynamic', function ($q, $scope, $rootScope, $location, $injector, api, utility) {
		var me = {};

		me.init = function () {
			$rootScope.page = 4;
			$scope.dimensionList = [];
			$scope.measureList = [];
			$scope.dimensions = [];
			$scope.measures = [];
			$scope.report = [];
			//$scope.table = {};
			$scope.dimCount = 0;
			$scope.measureCount = 0;
			$scope.currentApp = {};
			$scope.config = {
				apps: [{title:'Helpdesk Managment', id:'Helpdesk Management.qvf'}, {title:'Executive Dashboard', id:'Executive Dashboard.qvf'}],
				table: {title: '', id:'rJFbvG'}
			};
			me.objects = ['CurrentSelections'];
			
			$scope.dimensionConfig = {
	            group: {name:"dim"},
	            animation: 150,
	            ghostClass: "ghost",
	            onSort: function (/** ngSortEvent */evt){
	            	//console.log('dimOnSort:', evt)
	                // @see https://github.com/RubaXa/Sortable/blob/master/ng-sortable.js#L18-L24
            	}
        	};
        	$scope.measureConfig = {
	            group: {name:"measure"},
	            animation: 150,
	            ghostClass: "ghost",
	            onSort: function (/** ngSortEvent */evt){
	            	//console.log('measureOnSort:', evt)
	                // @see https://github.com/RubaXa/Sortable/blob/master/ng-sortable.js#L18-L24
            	}
        	};
        	$scope.reportConfig = {
	            group: {name:"report", put:['dim','measure']},
	            animation: 150,
	            ghostClass: "ghost",
	            filter: ".js-remove",
			    onFilter: function (evt) {
			        var item = evt.item,
			            ctrl = $(evt.target);
			        console.log('evt',evt);
			        console.log('ctrl',ctrl);
			        console.log('item',item);
			        if (ctrl.hasClass("js-remove")) {  // Click on remove button
			        	console.log('yes');
			            //item.parentNode.removeChild(item); // remove sortable item
			        }
			    },
	            onSort: function (/** ngSortEvent */evt){
	            //	console.log('reportOnSort:', evt)
	            //	$scope.createTable();
				/*
			app.visualization.get('xGhjKl').then(function(visual){
					visual.setOptions({title:"Now improved"});
				});*/
	                // @see https://github.com/RubaXa/Sortable/blob/master/ng-sortable.js#L18-L24
            	},
            	onMove: function (/** ngSortEvent */evt){
	            	//console.log('reportOnMove:', evt)
	                // @see https://github.com/RubaXa/Sortable/blob/master/ng-sortable.js#L18-L24
            	},
            	onAdd: function (/** ngSortEvent */evt){
	            	console.log('reportOnAdd:', evt)
	                // @see https://github.com/RubaXa/Sortable/blob/master/ng-sortable.js#L18-L24
            	}
        	};
			
		}
		$scope.exportData = function (options) {
			app.obj.app.visualization.get($scope.tableID).then(function(visual){
				visual.table.exportData(options);
			});
		}
		$scope.initObjectList = function( app ) {
			var deferred = $q.defer();
			//create a menu with all tables that have titles
			setTimeout(function(){ 
				var vislist = $( '#qvislist' );
				vislist.delegate( 'a[data-id]', "click", function ( e ) {
					var title = $( this ).data( 'title' ), id = $( this ).data( 'id' );
					if ( id ) {
						$scope.config.table.id = id;
						$scope.config.table.title = title;
						$scope.loadTable( app, id );
						
					}
				} );

				app.getList( 'sheet', function ( reply ) {
					vislist.html( "" );
					var currentTableIsNotSet = true;
					reply.qAppObjectList.qItems.forEach( function ( value ) {
						//vislist.append( '<li id="sheet_' + value.qInfo.qId + '">' + value.qData.title + '</li>' );

						app.getFullPropertyTree( value.qInfo.qId ).then( function ( prop ) {
							var str = "";
							prop.propertyTree.qChildren.forEach( function ( child ) {
								
								if ( child.qProperty.visualization == "table" && child.qProperty.title) {
									if (currentTableIsNotSet) {
										console.log('currentTableIsSet',currentTableIsNotSet);
										$scope.config.table.id = child.qProperty.qInfo.qId;
										$scope.config.table.title = child.qProperty.title;
										currentTableIsNotSet = false;
									}
									console.log("child", child);
									vislist.append( '<li><a href="#" data-id="' + child.qProperty.qInfo.qId + '" data-title="' + child.qProperty.title + '">' + child.qProperty.title + '</a></li>');
									//str += '<li><a href="#" data-id="' + child.qProperty.qInfo.qId + '" data-title="' + child.qProperty.title + '">' + child.qProperty.title + '</a></li>';
								}
							} );
							

						} );

					} );
					
										
				} );
			}, 500);
			
			console.log('currentTableIsSet',$scope.config.table);
			deferred.resolve();
			return deferred.promise;
		}

		$scope.initAppList = function(  ) {
			console.log('initAppList',app);
			//create a menu with all tables that have titles
			var applist = $( '#qapplist' );
			applist.delegate( 'a[data-id]', "click", function ( e ) {
				var title = $( this ).data( 'title' ), id = $( this ).data( 'id' );
				if ( id ) {
					console.log('initAppList getApp',id);
					me.getApp( id );
					$( '#brand' ).html( title );
				}
			} );

			$scope.config.apps.forEach( function ( value ) {
				applist.append( '<li><a href="#" data-id="' + value.id + '" data-title="' + value.title + '">' + value.title + '</a></li>');
			});
		}

		$scope.initBookmarkMenu = function ( app ) {
			app.getList( "BookmarkList", function ( reply ) {
				var str = "";
				reply.qBookmarkList.qItems.forEach( function ( value ) {
					if ( value.qData.title ) {
						str += '<li><a href="#" data-id="' + value.qInfo.qId + '">' + value.qData.title + '</a></li>';
					}
				} );
				str += '<li><a href="#" data-cmd="create">Create</a></li>';
				$( '#qbmlist' ).html( str ).find( 'a' ).on( 'click', function () {
					var id = $( this ).data( 'id' );
					if ( id ) {
						app.bookmark.apply( id );
					} else {
						var cmd = $( this ).data( 'cmd' );
						if ( cmd === "create" ) {
							var title = prompt( 'Bookmark title' ), desc = prompt( 'Bookmark desc' );
							app.bookmark.create( title, desc );
						}
					}
				} );
			} );
		}

		$scope.initLibraryItems = function ( app ) {

			app.getList( 'MeasureList', function(reply){
				$scope.measureList = reply;
			});
			app.getList( 'DimensionList', function(reply){
				$scope.dimensionList = reply;
			});
		}

		$scope.updateTable = function () {
			console.log('updateTable:',$scope.report);
			var dimensions = _.map($scope.report, function(item){ 
				if (item.type == 'dimension') {
					return   item.columnOptions;
				}
			});

		    dimensions = _.reduce($scope.report, function (acc, obj) {
				  if (obj.type == 'dimension') {
				    acc.push(obj.columnOptions);
				  }
				  return acc;
				}, [])

			var measures = _.map($scope.report, function(item){ 
				if (item.type == 'measure') {
					return   item.columnOptions;
				}
			});	

			measures = _.reduce($scope.report, function (acc, obj) {
				  if (obj.type == 'measure') {
				    acc.push(obj.columnOptions);
				  }
				  return acc;
				}, []);

			var columnOrder = [];
			var measureCount = 0;
			var dimensionCount = 0;
			
			_.each($scope.report, function(obj) {
				if (obj.type == 'measure') {
	  				columnOrder.push(dimensions.length + measureCount); 
	  				measureCount = measureCount + 1; 
	  			} else {
	  				columnOrder.push(dimensionCount); 
	  				dimensionCount = dimensionCount + 1;
	  			}
			});

			console.log("columnOrder",columnOrder);

			var columnWidths = [];

			console.log("report",$scope.report);

			for (var i = 0; i < $scope.report.length; i++) {
    				columnWidths.push(-1);
			}
			app.obj.app.getObject($scope.tableID).then(function(visual){
				var patches = [	{
									"qOp": "replace",
								  	"qPath": "qHyperCubeDef/qDimensions",
								  	"qValue": JSON.stringify(dimensions)
								},
								{
									"qOp": "replace",
								  	"qPath": "qHyperCubeDef/qMeasures",
								  	"qValue": JSON.stringify(measures)
								},
								{
									"qOp": "replace",
								  	"qPath": "qHyperCubeDef/columnOrder",
								  	"qValue": JSON.stringify(columnOrder)
								},
								{
									"qOp": "replace",
								  	"qPath": "qHyperCubeDef/columnWidths",
								  	"qValue": JSON.stringify(columnWidths)
								},
							];
					visual.applyPatches(patches,true)
        		});
		
		}
		$scope.sortTable = function () {
			app.obj.app.visualization.get($scope.tableID).then(function(visual){
				console.log('getTableVis:',visual);
				//visual.setOptions({"qHyperCubeDef": });
			});
		}
		$scope.removeItem = function (item) {
			$scope.report = _.without($scope.report, item);
			if (item.type == 'measure') {
				$scope.measures.push(item); 
			} else {
				$scope.dimensions.push(item);
			}
		}
		

		$scope.initButtons = function ( ) {
			$( "[data-qcmd]" ).on( 'click', function () {
				var $element = $( this );
				switch ( $element.data( 'qcmd' ) ) {
					//app level commands
					case 'exportToExcel':
						$scope.exportData({download:true});
						break;
					case 'exportAsCSV':
						$scope.exportData({format:'CSV_C',download:true});
						break;
					case 'exportAsCSVTab':
						$scope.exportData({format:'CSV_T',download:true});
						break;
					case 'exportToClipboard':
						$scope.exportData({download:true});
						break;
				}
			});
		}

		$scope.loadTable = function (app, id) {

			console.log('id loadTable:',id);

			$scope.report = [];
			setTimeout(function(){ 
				app.getObjectProperties(id).then(function(model){
					//Measures
					console.log('model',model);
					$scope.measures = _.map(model._properties.qHyperCubeDef.qMeasures, function(measure){ 
						if(measure.qLibraryId) {
							var libraryItem = _.find($scope.measureList.qMeasureList.qItems, function(item) {
													return item.qInfo.qId == measure.qLibraryId; 
						});

						var libraryMeasure = measure;
						libraryMeasure.qType = 'measure';
						
						return {  title: libraryItem.qMeta.title,
								  description: libraryItem.qMeta.description,
						  		  columnOptions: libraryMeasure,
						  		  type:'measure',
						  		  labelClass:'label-measure'
						}
						} else {
						return {  title: measure.qDef.qLabel,
								  description:'',
								  columnOptions:{"qDef":measure.qDef},
								  type:'measure',
						  		  labelClass:'label-measure'
							}
						}
					});
					//Dimensions
					$scope.dimensions = _.map(model._properties.qHyperCubeDef.qDimensions, function(dimension){ 
						if(dimension.qLibraryId) {
							var libraryItem = _.find($scope.dimensionList.qDimensionList.qItems, function(item) {
													return item.qInfo.qId == dimension.qLibraryId; 
							});
							var libraryDimension = dimension;
							libraryDimension.qType = 'dimension';
							return {  title: libraryItem.qMeta.title,
									  description: libraryItem.qMeta.description,
							  		  columnOptions:libraryDimension,
							  		  type:'dimension',
							  		  labelClass:'label-dimension'
							}
						} else {
						return {  title: dimension.qDef.qFieldLabels[0],
								  description:'',
								  columnOptions:  dimension,//{"qDef":dimension.qDef, "qNullSuppression": dimension.qNullSuppression},
								  type:'dimension',
								  labelClass:'label-dimension'
							}
						}
					});
				});	
			}, 500);
		}
		
		me.boot = function () {
			me.init();
			
			me.events();

			console.log("app",app);
			console.log("me",$scope.config.apps[0].id);
			
			me.getApp($scope.config.apps[0].id);
			
			$scope.initButtons();
			$scope.initAppList();

			$scope.$watchCollection('report', function(newItems, oldItems) {
				console.log('reportArray updated');
  			if (newItems.length == oldItems.length) {
					$scope.updateTable();
  				} else	{
  					$scope.updateTable();
  				}  
			});
/*
			app.obj.app.visualization.create('table',[],{title:"TABLE TITLE"}).then( function ( visual ) {
							$scope.tableID = visual.id;
							visual.show('table') ;
						});
*/		    
			utility.log('Page loaded: ', $scope.page);
		};

		me.events = function () {
			me.getApp = function (appToLoad) {
				
					//console.log("get app");
					$scope.report = [];
					$scope.dimensions = [];
					$scope.measures = [];

					api.loadApp(appToLoad).then(function(reply){
						console.log("app loaded",reply);

						me.getObjects();
						
						$scope.initLibraryItems(app.obj.app);
						$scope.initBookmarkMenu(app.obj.app);
						$scope.initObjectList(reply).then(function(){
									console.log("Load table",$scope.config);
									$scope.loadTable(app.obj.app, $scope.config.table.id);
						});

						app.obj.app.visualization.create('table',[],{title:"TABLE TITLE"}).then( function ( visual ) {
							$scope.tableID = visual.id;
							visual.show('table') ;
						});
				
						
					});
			}
			me.getObjects = function () {
				api.destroyObjects().then(function(){
					api.getObjects(me.objects);
				})
			}

			$rootScope.clearAll = function () {
				app.obj.app.clearAll();
			}
			$rootScope.goTo = function(page) {
				api.destroyObjects().then(function(){
					$location.url('/' + page);
				});
			}
		}

		me.boot();
	});
