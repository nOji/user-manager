(function(window, document, undefined){
	
	'use strict';

	var view = new app.View({
		groupList: '#groups-list',
		groupListNotice: '#groups-empty-notice',
		userList: '#users-list',
		userListNotice: '#users-empty-notice',
		addGroupForm: '#add-group-form',
		addUserForm: '#add-user-form'
	});

	var model = new app.Model('internations_db');

	var controller = new app.Controller(model, view);

	// STRAP'EM
	controller.init(showApp);

	function showApp() {
		requestAnimationFrame(function() {
			var mainContainer = _qs('#main');

			if (mainContainer.classList)
				mainContainer.classList.add('main--loaded');
			else
				mainContainer.className += ' ' + 'main--loaded';
		});
	}

})(this, document);