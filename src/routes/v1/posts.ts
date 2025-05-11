import { Router } from 'express';

import { list, show, edit, destroy, create } from 'controllers/posts';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorEdit } from 'middleware/validation/users';

const router = Router();

// Створення нового поста
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR'])], create);

// Отримати всі пости
router.get('/', [checkJwt, checkRole(['STANDARD','ADMINISTRATOR'])], list);

// Отримати один пост за ID
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], show);

// Редагування поста
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true), validatorEdit], edit);

// Видалення поста
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], destroy);

export default router;

