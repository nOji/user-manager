(function(window,document,undefined){
	'use strict';

	function Controller(model, view) {
		var self = this;

		self.model = model;
		self.view = view;

		// Registering Event Callbacks to be able to talk to the view
		self.view.talk('addUser', function(title) {
			if( title.trim().length > 0 ) {
				self.model.addUser(title.trim(), function() {
					self.render('users');
				});
			}
		});

		self.view.talk('deleteUser', function(userID) {
			if(userID) {
				self.model.removeUser(userID, function()
				{
					self.render();
				});
			}
		});

		self.view.talk('addGroup', function(title) {
			if( title.trim().length > 0 ) {
				self.model.addGroup(title.trim(), function() {
					self.render();
				});
			}
		});

		self.view.talk('deleteGroup', function(groupID) {
			var theGroup = self.model.getGroup(groupID);

			// VALIDATION
			if( theGroup.users && theGroup.users.length )
				return;

			self.model.removeGroup(groupID, function() {
				self.render();
			});
		});

		self.view.talk('userGroupToggle', function(userID, groupID) {
			if( userID && groupID ) {
				self.model.toggleGroupAssociativity(userID, groupID, function()
				{
					self.render();
				});
			}
		});
	};

	Controller.prototype.render = function(type) {
		var self = this;

		var groups = self.model.getGroups();
		var users = self.model.getUsers();
		var groupsWithUserData = self.model.getGroups();
			
			groupsWithUserData.forEach(function(group, key1) {
				groupsWithUserData[key1].users.forEach(function(userID, key2) {
					groupsWithUserData[key1].users[key2] = self.model.getUser(userID);
				});
			});

		switch(type) {
			case 'users':
				self.view.renderUsers( users, groups );
				break;
			case 'groups':
				self.view.renderGroups( groupsWithUserData );
				break;
			default:
				self.view.renderUsers( users, groups );
				self.view.renderGroups( groupsWithUserData );
				break;
		}
		return false;
	}

	Controller.prototype.init = function(callback) {
		callback = callback || function(){};

		var self = this;
		self.render();
		callback();
	}


	window.app = window.app || {};
	window.app.Controller = Controller;
})(this, document);