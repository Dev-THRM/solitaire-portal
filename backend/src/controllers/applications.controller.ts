import { Request, Response } from 'express';
import * as applicationsService from '../services/applications.service';

// Public: POST /api/apply
export async function applyForJob(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'Resume document is required' });
      return;
    }

    const data = { ...req.body };
    data.resumeUrl = `${process.env.API_URL || 'http://localhost:4000'}/uploads/${req.file.filename}`;
    if (!data.coverLetter) data.coverLetter = '';

    const application = await applicationsService.createApplication(data);
    res.status(201).json({
      success: true,
      data: { id: application.id },
      message: 'Application submitted successfully. We will be in touch!',
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'JOB_NOT_FOUND') {
        res.status(404).json({ success: false, error: 'Job not found' });
        return;
      }
      if (err.message === 'JOB_INACTIVE') {
        res.status(400).json({ success: false, error: 'This job is no longer accepting applications' });
        return;
      }
      if (err.message === 'ALREADY_APPLIED') {
        res.status(409).json({ success: false, error: 'You have already applied for this job' });
        return;
      }
    }
    res.status(500).json({ success: false, error: 'Failed to submit application' });
  }
}

// Admin: GET /api/admin/applications
export async function listApplications(req: Request, res: Response): Promise<void> {
  try {
    const { jobId } = req.query as { jobId?: string };
    const applications = await applicationsService.listApplications(jobId);
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch applications' });
  }
}

// Admin: GET /api/admin/applications/:id
export async function getApplication(req: Request, res: Response): Promise<void> {
  try {
    const application = await applicationsService.getApplicationById(req.params.id as string);
    if (!application) {
      res.status(404).json({ success: false, error: 'Application not found' });
      return;
    }
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch application' });
  }
}

// Admin: PATCH /api/admin/applications/:id/status
export async function updateStatus(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.body;
    const application = await applicationsService.updateApplicationStatus(req.params.id as string, status);
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
}
