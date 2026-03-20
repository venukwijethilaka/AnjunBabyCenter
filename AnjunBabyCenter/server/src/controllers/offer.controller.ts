import type { Request, Response } from 'express';
import * as offerService from '../services/offer.service';

export const getAllOffers = async (req: Request, res: Response) => {
  try {
    const includeAll = req.query.all === 'true';
    const offers = await offerService.getAllOffers(includeAll);
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch offers' });
  }
};

export const getActiveOffer = async (req: Request, res: Response) => {
  try {
    const offer = await offerService.getActiveOffer();
    if (!offer) {
      return res.status(204).send(); // No active offer found
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch active offer' });
  }
};

export const createOffer = async (req: Request, res: Response) => {
  try {
    const offer = await offerService.createOffer(req.body);
    res.status(201).json(offer);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create offer', error: error.message });
  }
};

export const updateOffer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

    const offer = await offerService.updateOffer(id, req.body);
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update offer' });
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

    await offerService.deleteOffer(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete offer' });
  }
};