import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Posts } from 'orm/entities/users/Posts';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name, description} = req.body;

  const postsRepository = getRepository(Posts);
  try {
    const post = await postsRepository.findOne({ where: { id } });

    if (!post) {
      const customError = new CustomError(404, 'General', `Post with id:${id} not found.`, ['Posts not found.']);
      return next(customError);
    }

    post.name = name;
    post.description = description;

    try {
      await postsRepository.save(post);
      res.customSuccess(200, 'Posts successfully saved.');
    } catch (err) {
      const customError = new CustomError(409, 'Raw', `Post with id:${post.id} can't be saved.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
