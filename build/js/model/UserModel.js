(function(window,document,undefined){
	'use strict';

	// Model Constructor Function
	function Model(storageKey) {
		var self = this;

		self.storageKey = storageKey;

		if( localStorage[self.storageKey] ) {
			self.data = JSON.parse( localStorage[self.storageKey] );
		}
		else {
			self.data = { users: [], groups: [] }
		}

		localStorage[self.storageKey] = JSON.stringify(self.data);
	};

	// Returns All Users
	Model.prototype.getUsers = function() {
		this.data = JSON.parse( localStorage[this.storageKey] );
		return this.data.users;
	};

	Model.prototype.getUser = function(id) {
		this.data = JSON.parse( localStorage[this.storageKey] );

		for(var i = 0; i < this.data.users.length; i++) {
			if( this.data.users[i].id == id ) {
				return this.data.users[i];
			}
		}

		return true;
	};

	// Returns All Groups
	Model.prototype.getGroups = function() {
		this.data = JSON.parse( localStorage[this.storageKey] );
		return this.data.groups;
	};

	Model.prototype.getGroup = function(id) {
		this.data = JSON.parse( localStorage[this.storageKey] );
		this.data.groups.forEach(function(group, offset) {
			if( group.id == id ) {
				// FOUND IT!
				return group;
			}
		});

		return false;
	};

	// Removes a user by it's ID
	Model.prototype.removeUser = function(id, callback) {
		var self = this;
		callback = callback || function(){};

		self.data = JSON.parse( localStorage[self.storageKey] );

		self.data.groups.forEach(function(group, i) {
			group.users.forEach(function(user, x) {
				if( self.data.groups[i].users[x] == id ) {
					self.data.groups[i].users.splice(x, 1);
				}
			});
		});

		for(var i = 0; i < self.data.users.length; i++) {
			if( self.data.users[i].id == id ) {
				self.data.users.splice(i, 1);
				localStorage[self.storageKey] = JSON.stringify(self.data);
				callback();
				return false;
			}
		}
		return true;
	};

	// Removes a group by it's ID,
	// also first makes sure that it doesn't have any users in it
	Model.prototype.removeGroup = function(id, callback) {
		callback = callback || function(){};

		this.data = JSON.parse( localStorage[this.storageKey] );

		for(var i = 0; i < this.data.groups.length; i++) {
			if( this.data.groups[i].id == id ) {
				// Making sure that this group doesn't have any users in it.
				if( this.data.groups[i].users.length )
					return true;

				this.data.groups.splice(i, 1);
				localStorage[this.storageKey] = JSON.stringify(this.data);
				callback();
				return false;
			}
		}
		return true;
	};

	Model.prototype.addUser = function(name, callback) {
		callback = callback || function(){};

		var newUser = {
			id: new Date().getTime(),
			name: name
		}

		this.data = JSON.parse( localStorage[this.storageKey] );
		this.data.users.push( newUser );

		// SAVE
		localStorage[this.storageKey] = JSON.stringify(this.data);
		callback();
	};

	Model.prototype.addGroup = function(name, callback) {
		callback = callback || function(){};

		var newGroup = {
			id: new Date().getTime(),
			name: name,
			users: []
		}

		this.data = JSON.parse( localStorage[this.storageKey] );
		this.data.groups.push( newGroup );

		// SAVE
		localStorage[this.storageKey] = JSON.stringify(this.data);
		callback();
	};

	Model.prototype.toggleGroupAssociativity = function(userID, groupID, callback) {
		callback = callback || function(){};

		this.data = JSON.parse( localStorage[this.storageKey] );

		for(var i = 0; i < this.data.groups.length; i++) {
			if( this.data.groups[i].id == groupID ) {
				// FOUND IT!
				var indexOfUser = this.data.groups[i].users.indexOf( userID );

				if( indexOfUser == -1 ) {
					// PUSH IT IN
					this.data.groups[i].users.push(userID);
				}
				else {
					// PULL IT OUT
					this.data.groups[i].users.splice(indexOfUser, 1);
				}

				localStorage[this.storageKey] = JSON.stringify(this.data);
				callback();
			}
		}

		return true;
	};


	window.app = window.app || {};
	window.app.Model = Model;

})(this, document);
