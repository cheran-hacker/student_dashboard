const express = require('express');
const router = express.Router();
const { loginAdmin, getAllStudents, updateStudent, deleteStudent } = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');

router.post('/admin/login', loginAdmin);
router.get('/students', auth, getAllStudents); // Also handles filtering if query params are added in future
router.put('/students/:id', auth, updateStudent);
router.delete('/students/:id', auth, deleteStudent);

module.exports = router;