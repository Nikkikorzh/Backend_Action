import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Posts } from 'orm/entities/users/posts';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreateOrEditPost = async (req: Request, res: Response, next: NextFunction) => {
  let { postName, postDescription } = req.body;
  const errorsValidation: ErrorValidation[] = [];
  const postsRepository = getRepository(Posts);

  postName = !postName ? '' : postName;
  postDescription = !postDescription ? '' : postDescription;


  const existingPost = await postsRepository.findOne({ where: { name: postName } });
  if (existingPost) {
    errorsValidation.push({ postName: `Post with name '${postName}' already exists` });
  }


  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Create or Edit post validation error', null, null, errorsValidation);
    return next(customError);
  }

  return next();
};
