import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';

import Orphanage from '../models/Orphanage';

export default {
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);

    const orphanages = await orphanagesRepository.find({
      relations: ['images'],
    });

    return response.json(orphanageView.renderMany(orphanages));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const orphanagesRepository = getRepository(Orphanage);

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images'],
    });

    return response.json(orphanageView.render(orphanage));
  },

  async create(request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = request.body;

    const orphanagesRepository = getRepository(Orphanage);

    //as Express.Multer.File[] - sinalizar que é uma array
    const requestImages = request.files as Express.Multer.File[];
    const images = requestImages.map((image) => {
      return { path: image.filename };
    });

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required('Nome obrigatório'),
      latitude: Yup.number().required('Latitude obrigatória'),
      longitude: Yup.number().required('Longitude obrigatória'),
      about: Yup.string().required('Ultrapassou 300 caracteres').max(300),
      instructions: Yup.string().required('Instruções obrigatória'),
      opening_hours: Yup.string().required(
        'Horário de funcionamento obrigatória'
      ),
      open_on_weekends: Yup.boolean().required(
        'Funcionamento nos finais de semana obrigatório'
      ),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required('Imagem obrigatória'),
        })
      ),
    });

    await schema.validate(data, { abortEarly: false });

    const orphanages = orphanagesRepository.create(data);

    await orphanagesRepository.save(orphanages);

    return response.status(201).json(orphanages);
  },
};
