(function(global, undefined){

var classNamePrefix = 'widget-';
function nodeIsDisplayed(node){ return node.offsetParent != null; }
function updateWidget(config, x){
	if (arguments.length < 2){
		x = config;
		config = undefined;
	}
	
	var id = typeof x == 'number' ? classNamePrefix + x : typeof x == 'string' ? x : null, widget;
	if (id != null){
		// if widget ID is passed instead of widget itself, then select widget by the given ID
		var contNode = document.getElementById(id)
			|| config && config.forceRender && d3.select('body').append('div').attr('id', id).node();
			
		if (!contNode){
			log('no element found with the given id: ' + id);
			return null;
		}
		widget = contNode.__innerWidget__;
	}
	else if (widget = x) contNode = widget.config.renderTo;
	else return;
	
	var display = nodeIsDisplayed(contNode);
	if (widget){
		// if config is not defined or is the same then update widget (or stop update if its container is hidden)
		if (typeof config == 'undefined' || widget.config.originalConfig == config){
			if (!widget._contHidden != display && (widget._contHidden = !display, true)){
				switchRealtimeUpdate(display, [widget], true, true);
			}
			return widget;
		}
		widget.destroy();
	}
	
	// create a new widget if the old one was destroyed or there were not any
	return display && config && initializeWidget(config, contNode);
}

function initializeWidget(config, contNode){
	var type = config.type = toCapitalCase(config.type) || defaultWidgetType;
	//config.updateinterval = 0;
	config.fastenTooltips = true;
	
	var contEl = d3.select(contNode),
	initClasses = contEl.attr('class'),
	initStyles = contEl.classed(classNamePrefix + type.toLowerCase(), true).attr('style'),
	widget = contNode.__innerWidget__ = appendWidget(config, contNode);
	
	resizeWidget(widget);
	widget.destroy = extendFunction(widget.destroy, function(){
		contNode.__innerWidget__ = null;
		// reset style and class attributes
		contEl.attr('style', initStyles).attr('class', initClasses);
	});
	
	switch(type){
	case 'Gauge':
		widget.progress.alignNode(contNode).redraw();
		break;
	}
	return widget;
}

function resizeWidget(widget, size){
	if (typeof size != 'object') size = resizeWidget.getDefaultSize(widget.config);
	if (size){
		if (!size.isOwn){
			var contNode = widget.config.renderTo;
			contNode.style.width = typeof size.width == 'number' ? size.width + 'px' : size.width;
			contNode.style.height = typeof size.height == 'number' ? size.height + 'px' : size.height;
		}
		widget.resize(size);
	}
}

resizeWidget.getDefaultSize = function(config){
	var size = config.initSize;
	if (!size){
		var rect = config.renderTo.getBoundingClientRect();
		size = {
			width: Math.round(rect.width),
			height: Math.round(rect.height),
			isOwn: true
		};
	}
	return size;
};

function forceReload(el, properties, copyProperties){
	var name = el.tagName.toLowerCase();
	if (copyProperties == null) copyProperties = defaultCopyProperties[name];
	
	var copy = document.createElement(name),
	parentNode = el.parentNode,
	beforeNode = el.nextSibling;
	
	if (copyProperties) copyProperties.forEach(function(p){ if (!properties.hasOwnProperty(p)) copy[p] = el[p]; });
	for (var p in properties) if (properties.hasOwnProperty(p)) copy[p] = properties[p];
	
	parentNode.removeChild(el);
	parentNode.insertBefore(copy, beforeNode);
	return copy;
}

var defaultCopyProperties = {
	script: ['__initialized__', 'id', 'async', 'type', 'onload', 'src']
};

function loadElement(el, src, callback){
	if (typeof el == 'string' && !(el = document.querySelector(el))){
		return;
	}
	if (callback){
		el.onload = extendFunction(el.onload, function(){
			if (!document.body) return onBodyLoad = extendFunction(onBodyLoad, callback);
			callback.apply(this, arguments);
		});
	}
	
	var init = !el.__initialized__ && (el.__initialized__ = true);
	if (init){
		el.src = src;
	}
	else el = forceReload(el, { src: src });
	return el;
}

function loadWidgets(url, callback){
	global.getDefaultConfigURL = url;
	initializePortal(null, function(config){
		var widgets = config && config.groups.reduce(function(res, _g){
			_g.widgets.forEach(function(_w){
				var processConfig = global['get' + toCapitalCase(_w.type) + 'Config'];
				if (processConfig){
					res.push(processConfig(_w));
				}
			});
		}, []);
		callback(widgets);
	});
}

global.loadWidgets = loadWidgets;
global.nodeIsDisplayed = nodeIsDisplayed;
global.loadElement = loadElement;
global.forceReload = forceReload;
global.updateWidget = updateWidget;
global.resizeWidget = resizeWidget;

})(window);
