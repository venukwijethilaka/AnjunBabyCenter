import type { Request, Response } from 'express';
import * as bannerService from '../services/banner.service';

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await bannerService.getAllBanners();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch banners' });
  }
};

export const getActiveBanners = async (req: Request, res: Response) => {
  try {
    // FIX: Cast query to string or undefined specifically
    const position = req.query.position as string | undefined;
    const banners = await bannerService.getActiveBanners(position);
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch active banners' });
  }
};

export const getBannerById = async (req: Request, res: Response) => {
  try {
    // FIX: Ensure ID is parsed as a number and handled if NaN
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });

    const banner = await bannerService.getBannerById(id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch banner' });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    if (!req.body.imageUrl || !req.body.bannerPosition) {
      return res.status(400).json({ message: 'Image URL and position required' });
    }
    const banner = await bannerService.createBanner(req.body);
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create banner' });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    // FIX: Parse ID correctly
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });

    const banner = await bannerService.updateBanner(id, req.body);
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update banner' });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    // FIX: Parse ID correctly
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });

    await bannerService.deleteBanner(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete banner' });
  }
};