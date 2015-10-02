var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to adduser
 */
router.post('/adduser', function(req, res) {
	var db = req.db;
	var collection = db.get('userlist');
	collection.insert(req.body, function(err, result){
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
		);
	});
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/* PUT to edituser */
router.put('/edituser/:id', function (req, res) {
    console.log(req.body)
    var db = req.db;
    var collection = db.get('userlist');
    var userToUpdate = req.params.id;
    collection.update({ '_id' : userToUpdate }, 
        { 'username': req.body.username, 
          'email': req.body.email, 
          'fullname': req.body.fullname,
          'age': req.body.age,
          'location': req.body.location,
          'gender': req.body.gender },
        function(err) {
            res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
        });
});


module.exports = router;
