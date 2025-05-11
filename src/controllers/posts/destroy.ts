import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Posts } from 'orm/entities/users/Posts';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const postsRepository = getRepository(Posts);
  try {
    const post = await postsRepository.findOne({ where: { id } });

    if (!post) {
      const customError = new CustomError(404, 'General', 'Not Found', [`Post with id:${id} doesn't exists.`]);
      return next(customError);
    }
    postsRepository.delete(id);

    res.customSuccess(200, 'Posts successfully deleted.', { id: post.id, name: post.name, description: post.description });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};

