import { Request, Response } from 'express';
import * as jobsService from '../services/jobs.service';
import { JobQueryParams } from '../types';

// Public: GET /api/jobs
export async function listJobs(req: Request, res: Response): Promise<void> {
  try {
    const result = await jobsService.listJobs(req.query as JobQueryParams);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch jobs' });
  }
}

// Public: GET /api/jobs/:id
export async function getJob(req: Request, res: Response): Promise<void> {
  try {
    const job = await jobsService.getJobById(req.params.id);
    if (!job) {
      res.status(404).json({ success: false, error: 'Job not found' });
      return;
    }
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch job' });
  }
}

// Admin: GET /api/admin/jobs
export async function listAllJobs(_req: Request, res: Response): Promise<void> {
  try {
    const jobs = await jobsService.listAllJobs();
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch jobs' });
  }
}

// Admin: POST /api/admin/jobs
export async function createJob(req: Request, res: Response): Promise<void> {
  try {
    const job = await jobsService.createJob(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create job' });
  }
}

// Admin: PUT /api/admin/jobs/:id
export async function updateJob(req: Request, res: Response): Promise<void> {
  try {
    const job = await jobsService.updateJob(req.params.id, req.body);
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update job' });
  }
}

// Admin: DELETE /api/admin/jobs/:id
export async function deleteJob(req: Request, res: Response): Promise<void> {
  try {
    await jobsService.deleteJob(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete job' });
  }
}
