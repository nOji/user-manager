(function(window,document,undefined){
	'use strict';

	function View(selectors) {
		var self = this;

		self.$groupList = _qs(selectors.groupList);
		self.$groupListNotice = _qs(selectors.groupListNotice);
		self.$userList = _qs(selectors.userList);
		self.$userListNotice = _qs(selectors.userListNotice);
		self.$addUserForm = _qs(selectors.addUserForm);
		self.$addGroupForm = _qs(selectors.addGroupForm);
	};

	// Makes Small Talks with Controller and Does His Dirty Work
	View.prototype.talk = function(eventName, callback) {
		var self = this;

		eventName = eventName || '';
		callback = callback || function(){};

		if(eventName == 'addUser') {
			_on(self.$addUserForm, 'submit', function(event) {
				event.preventDefault();

				var theInput = _qs( 'input[type="text"]', self.$addUserForm );
				callback(theInput.value);
				theInput.value = '';

				return false;
			});
		}

		if(eventName == 'deleteUser') {
			self.$userList.addEventListener('click', function(event) {
				var parentA = _parent(event.target, 'a');

				if(event.target.tagName == 'A' && indexOf(event.target.classList, 'user-item__action--delete') > -1)
				{
					var target = event.target;
				}
				else if( parentA && indexOf(parentA.classList, 'user-item__action--delete') > -1 ) {
					var target = parentA;
				}

				if(target) {
					event.preventDefault();
					callback( parseInt(target.dataset.id, 10) );
					return false;
				}
			});
		}

		if(eventName == 'addGroup') {
			_on(self.$addGroupForm, 'submit', function(event) {
				event.preventDefault();

				var theInput = _qs( 'input[type="text"]', self.$addGroupForm );
				callback(theInput.value);
				theInput.value = '';

				return false;
			});
		}

		if(eventName == 'deleteGroup') {
			_delegate(self.$groupList, '.group-item__empty-notice__link', 'click', function(event) {
				event.preventDefault();
				callback( parseInt( this.getAttribute('data-group-id'), 10 ) );
				return false;
			});
		}

		if(eventName == 'userGroupToggle') {
			_delegate(self.$userList, '.user-item__group-selector', 'click', function(event) {
				event.preventDefault();
				callback( parseInt(this.getAttribute('data-user-id'), 10), parseInt(this.getAttribute('data-group-id'), 10) );
				return false;
			});
		}

		return false; 
	}

	function userTemplate(user, groups) {
		user = user || {};
		groups = groups || [];

		var template
		= '<li class="users__item" data-id="'+ user.id +'">'
		+ '	<span class="users__item__name">'
		+ '		<svg class="users__item__name__icon">'
		+ '		    <use xlink:href="#user"></use>'
		+ '		</svg>'
		+ '		'+ user.name
		+ '	</span>'
		+ '	<div class="users__item__actions">'
		+ '		<a href="#" class="user-item__action user-item__action--delete"  data-id="'+ user.id +'">'
		+ '			<svg class="user-item__action__icon">'
		+ '			    <use xlink:href="#delete"></use>'
		+ '			</svg>'
		+ '			<span class="user-item__action__title">Delete</span>'
		+ '		</a>'
		+ '		<h3 class="user-item__groups-head">Groups:</h3>';

		// GOING THROUGH THE GROUPS AND ADD THEM HERE FOR ASSIGNING/LEAVING
		for(var i = 0; i < groups.length; i++) {
			var activeClass = ( groups[i].users.indexOf(user.id) > -1 ) ? ' user-item__group-selector--selected' : '';

			template += ''
			+ '		<label class="user-item__group-selector'+ activeClass +'"'
			+ '		data-group-id="'+ groups[i].id +'" data-user-id="'+ user.id +'">'
			+ '			<svg class="user-item__group-selector__icon">'
			+ '			    <use xlink:href="#assign"></use>'
			+ '			</svg>'
			+ '			<input type="checkbox">'
			+ '			'+ groups[i].name
			+ '		</label>';
		}

		template += ''
		+ '	</div>'
		+ '</li>';

		return template;
	};

	function groupTemplate(group) {
		group = group || {};
		var users = group.users;

		var template
		= '<li class="group-item" data-group-id="'+ group.id +'">'
		+ '	<h3 class="group-item__name">'
		+ '		'+ group.name
		+ '	</h3>';

		if( users.length ) {
			template += '<ul class="group-item__users">';
			
			for(var i = 0; i < users.length; i++) {
				template += ''
				+ '		<li class="group-item__users_i">'
				+ '			'+users[i].name
				+ '		</li>';
			}
			
			template += '</ul>';
		}
		else {
			template += ''
			+ ' <p class="group-item__empty-notice">'
			+ ' 	This group doesn\'t have any users. You can '
			+ ' 	<a href="#" data-group-id="'+ group.id +'" class="group-item__empty-notice__link">get rid of it</a> ;)'
			+ ' </p>';
		}
		
		template += ''
		+ '</li>';

		return template;
	};

	View.prototype.renderUsers = function(users, groups) {
		users = users || [];
		groups = groups || [];

		var usersHTML = '';

		// Hiding The Empty Notice
		this.$userListNotice.style.display = 'none';

		for(var i = 0; i < users.length; i++) {
			usersHTML += userTemplate(users[i], groups);
		}

		this.$userList.innerHTML = usersHTML;

		if( !users.length ) {
			// Showign the Empty Notice
			this.$userListNotice.style.display = 'block';
		}
	};

	View.prototype.renderGroups = function(groups) {
		groups = groups || [];

		var self = this;
		var groupsHTML = '';

		// Hiding Notice
		self.$groupListNotice.style.display = 'none';

		groups.forEach(function(element, index) {
			groupsHTML += groupTemplate(element, element.users);
		});

		self.$groupList.innerHTML = groupsHTML;

		if( !groups.length ) {
			self.$groupListNotice.style.display = 'block';
		}
	};

	window.app = window.app || {};
	window.app.View = View;
})(this, document);