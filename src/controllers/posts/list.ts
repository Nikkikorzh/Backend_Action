import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { Posts } from 'orm/entities/users/Posts';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const postsRepository = getRepository(Posts);
  try {
    const posts = await postsRepository.find({
      select: ['id', 'name', 'description', 'likes', 'dislikes', 'created_at', 'updated_at','user'],
      relations: ['user'],
    });
    res.customSuccess(200, 'List of posts.', posts);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of posts.`, null, err);
    return next(customError);
  }
};

