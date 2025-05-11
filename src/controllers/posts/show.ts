import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Posts } from 'orm/entities/users/Posts';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const postsRepository = getRepository(Posts);
  try {
    const posts = await postsRepository.findOne(id, {
      select: ['id', 'name', 'description', 'likes', 'dislikes','user'],
      relations: ['user'],
    });

    if (!posts) {
      const customError = new CustomError(404, 'General', `Post with id:${id} not found.`, ['Posts not found.']);
      return next(customError);
    }
    res.customSuccess(200, 'Posts found', posts);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
