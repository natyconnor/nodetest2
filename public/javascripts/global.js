// Userlist data array for filling in info box
var userListData = [];

// DOM Ready ====================================
$(document).ready(function() {
	// Hide the forms initially
	$('#addUserForm').hide();
	$('#editUserForm').hide();

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    $('#showAddUser').on('click', function () {
    	$('#addUserForm').show('fast');
    	$('#showAddUser').hide();
    })

    // Add User button click
    $('#btnAddUser').on('click', addUser);
    // Cancel Add User button click
    $('#btnCancelAddUser').on('click', function() {
    	// Clear form values
    	$('#addUserForm fieldset input').val('');

    	// Hide the Form and show the Add User button
    	$('#addUserForm').hide('fast');
    	$('#showAddUser').show();
    });

    // Edit User button click
    $('#btnEditUser').on('click', editUser);
    // Cancel Edit User button click
    $('#btnCancelEditUser').on('click', function() {
    	// Clear form values
    	$('#editUserForm fieldset input').val('');

    	// Hide the form and show the Add User button
    	$('#editUserForm').hide('fast');
    	$('#showAddUser').show();
    })

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

// Functions ======================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function(data) {
    	// Stick our user data array into a userlist variable in the global object
    	userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function() {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
}

function showUserInfo(event) {
	// Prevent link from firing
	event.preventDefault();

	// Retrieve username from link rel attribute
	var thisUserName = $(this).attr('rel');

	// Get Index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

	// Get our User Object
	var thisUserObject = userListData[arrayPosition];

	// Populate Info Box
	fillInfoBox(thisUserObject);

    // Show Edit User form
    $('#editUserForm').show('fast');
    // Hide the add user button
    $('#showAddUser').hide();
    // Give the form the id of this user
    $('#editUserForm').attr('rel', thisUserObject._id);

    // Fill in the form with current values
    $('#editUserName').val(thisUserObject.username);
    $('#editUserEmail').val(thisUserObject.email);
    $('#editUserFullname').val(thisUserObject.fullname);
    $('#editUserAge').val(thisUserObject.age);
    $('#editUserLocation').val(thisUserObject.location);
    $('#editUserGender').val(thisUserObject.gender);
}

function addUser(event) {
	event.preventDefault();

	// Super basic validation -- increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addUserForm input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});

	// Check and make sure errorCount's still at zero
	if(errorCount === 0) {
		// If it is, compile all user info into one object
		var newUser = {
			'username': $('#inputUserName').val(),
            'email': $('#inputUserEmail').val(),
            'fullname': $('#inputUserFullname').val(),
            'age': $('#inputUserAge').val(),
            'location': $('#inputUserLocation').val(),
            'gender': $('#inputUserGender').val()
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			url: 'users/adduser',
			type: 'POST',
			dataType: 'JSON',
			data: newUser
		})
		.done(function(response) {
			// Check for successful (blank) response
			if(response.msg === '') {
				// Clear the form inputs
				$('#addUserForm fieldset input').val('');

				// Update the table
				populateTable();

				// Hide Form, show add button
				$('#addUserForm').hide('fast');
				$('#showAddUser').show();
			} else {
				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		
	} else {
		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	}
}

function deleteUser(event) {
	event.preventDefault();

	// Pop up a confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this user?');

	// Check and make sure the user confirmed
	if (confirmation === true) {

		// If they did, do our delete
		$.ajax({
			url: '/users/deleteuser/' + $(this).attr('rel'),
			type: 'DELETE'
		})
		.done(function(response) {
			// Check for a successful (blank) response
			if(response.msg === '') {

			} else {
				alert('Error: ' + response.msg);
			}

			// Update the table
			populateTable();
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		
	} else {
		// If they said no to the confirm, do nothing
		return false;
	}
};

function editUser (event) {
	event.preventDefault();

	var newUserValues = {
		'username': $('#editUserName').val(),
        'email': $('#editUserEmail').val(),
        'fullname': $('#editUserFullname').val(),
        'age': $('#editUserAge').val(),
        'location': $('#editUserLocation').val(),
        'gender': $('#editUserGender').val()
	}

	$.ajax({
		url: '/users/edituser/' + $('#editUserForm').attr('rel'),
		type: 'PUT',
		dataType: 'JSON',
		data: newUserValues ,
	})
	.done(function(response) {
		// Check for a successful (blank) response
		if(response.msg === '') {

		} else {
			alert('Error: ' + response.msg);
		}

		// Update the table
		populateTable();

		// Hide Form, show add button
		$('#editUserForm').hide('fast');
		$('#showAddUser').show();

		// update info box
		fillInfoBox(newUserValues);
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
};

function fillInfoBox (userObject) {
	$('#userInfoName').text(userObject.fullname);
    $('#userInfoAge').text(userObject.age);
    $('#userInfoGender').text(userObject.gender);
    $('#userInfoLocation').text(userObject.location);
}