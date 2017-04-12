var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

module.exports = function(schema, options) {
	options = options || {};
	schema.add({
	    cache: {},
	});

	schema.pre("save", function(next) {
		this._cache=this.cache || {};
		this.cache=undefined;
		this._cache["_fields"]={};
		var that = this;
		schema.eachPath(function(path, config) {
			if (!config.options.temporary) {
				return;
			}
			that._cache["_fields"][path]=that.get(path);
		});
		next()
	});
	schema.post("save", function(){
		this._cache = this._cache || {};
		for( var key in this._cache["_fields"]) {
			this.set(key, this._cache["_fields"][key]);
		}
		this._cache["_fields"]=undefined;
		this.cache=this._cache;
	});

	schema.methods.setTemp = function(key, value) {
		this.cache = this.cache || {};
		this.cache[key]=value;
	}
	schema.methods.getTemp = function(key) {
		this.cache = this.cache || {};
		return this.cache[key];
	}

}	
