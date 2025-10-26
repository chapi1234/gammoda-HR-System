import Activity from '../models/Activity.js';
import Employee from '../models/Employee.js';

// Create a new activity (used by other controllers when something happens)
export const createActivity = async (req, res) => {
  try {
    const { actorId, action, type, meta } = req.body;
    const activity = new Activity({ actor: actorId || req.user?._id, action, type, meta });
    await activity.save();
    const populated = await activity.populate({ path: 'actor', select: 'name profileImage employeeId' });
    const mapped = {
      id: populated._id,
      actorName: populated.actor?.name || '',
      actorId: populated.actor?._id || null,
      actorAvatar: populated.actor?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(populated.actor?.name || '')}&background=3b82f6&color=fff`,
      action: populated.action,
      type: populated.type,
      meta: populated.meta || {},
      createdAt: populated.createdAt,
    };
    return res.status(201).json({ status: true, message: 'Activity created', data: mapped });
  } catch (err) {
    console.error('createActivity error', err);
    return res.status(500).json({ status: false, message: 'Failed to create activity', error: err.message });
  }
};

// List recent activities (public to authenticated users)
export const listActivities = async (req, res) => {
  try {
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const skip = Number(req.query.skip) || 0;

    // Support filtering: mine=true (only my activities) or actorId=<id> (HR can query any actor)
    const q = {};
    if (String(req.query.mine) === 'true') {
      const uid = req.user?._id || req.user?.id;
      if (!uid) return res.status(401).json({ status: false, message: 'Unauthorized' });
      q.actor = uid;
    } else if (req.query.actorId) {
      q.actor = req.query.actorId;
    }

    const activities = await Activity.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: 'actor', select: 'name profileImage employeeId' });

    const mapped = activities.map(a => ({
      id: a._id,
      actorName: a.actor?.name || '',
      actorId: a.actor?._id || null,
      actorAvatar: a.actor?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.actor?.name || '')}&background=3b82f6&color=fff`,
      action: a.action,
      type: a.type,
      meta: a.meta || {},
      createdAt: a.createdAt,
    }));

    return res.status(200).json({ status: true, message: 'Activities fetched', data: mapped });
  } catch (err) {
    console.error('listActivities error', err);
    return res.status(500).json({ status: false, message: 'Failed to fetch activities', error: err.message });
  }
};
