import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Posts } from 'orm/entities/users/Posts';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { User } from '../../orm/entities/users/User';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { postName, postDescription, likes, dislikes, userId } = req.body;

  if (!postName ) {
    return next(new CustomError(400, 'Raw', 'Post name required.'));
  }

  if (!postDescription) {
    return next(new CustomError(400, 'Raw', 'Вescription are required.'));
  }

  if (typeof likes !== 'number' || typeof dislikes !== 'number') {
    return next(new CustomError(400, 'Raw', 'Likes and dislikes should be numbers.'));
  }

  const postsRepository = getRepository(Posts);
  const userRepository = getRepository(User);

  try {
    const user = await userRepository.findOne(userId);
    if (!user) {
      return next(new CustomError(404, 'Raw', `User with id ${userId} not found.`));
    }

    const newPost = postsRepository.create({
      name: postName,
      description: postDescription,
      likes,
      dislikes,
      user: user,
    });

    await postsRepository.save(newPost);


    const postWithUser = await postsRepository.findOne({
      where: { id: newPost.id },
      relations: ['user'],
  });

    res.customSuccess(201, 'Post successfully created.', postWithUser);
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Post can't be created.`, null, err));
  }
};
